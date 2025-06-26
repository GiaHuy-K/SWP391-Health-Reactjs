import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Table,
  Tag,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import api from "../../config/axios";
import { getStudent } from "../../services/api.student";
import StudentDetailModal from "../../components/admin/student-detail-modal";

const { Option } = Select;

function ManageStudent() {
  // Danh sách học sinh
  const [studentList, setStudentList] = useState([]);

  // Modal tạo mới học sinh
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Modal xem chi tiết học sinh
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Lấy danh sách học sinh từ API
  const fetchStudent = async () => {
    const data = await getStudent();
    setStudentList(data);
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  // Tạo mới học sinh
  const handleCreateStudent = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        dateOfBirth: dayjs(values.dateOfBirth).format("YYYY-MM-DD"),
      };

      await api.post("/admin/users/students", payload);
      message.success("Tạo học sinh thành công");
      form.resetFields();
      setIsCreateModalOpen(false);
      fetchStudent(); // load lại danh sách
    } catch (err) {
      message.error("Lỗi khi tạo học sinh");
      console.error(err);
    }
  };

  // Xử lý khi click vào 1 dòng → mở modal xem chi tiết
  const handleRowClick = (record) => {
    setSelectedStudentId(record.id); // dùng id đúng với API trả về
    setIsDetailModalOpen(true);
  };

  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Lớp",
      dataIndex: "className",
      key: "className",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => {
        const color = gender === "Nam" || gender === "MALE" ? "blue" : "magenta";
        return <Tag color={color}>{gender}</Tag>;
      },
    },
    {
      title: "Mã mời",
      dataIndex: "invitationCode",
      key: "invitationCode",
    },
  ];

  return (
    <div>
      {/* Nút mở modal tạo mới */}
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsCreateModalOpen(true)}
      >
        Tạo mới học sinh
      </Button>

      {/* Bảng danh sách học sinh */}
      <Table
        dataSource={studentList}
        columns={columns}
        rowKey="id" // đảm bảo key đúng với dữ liệu trả về
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" },
        })}
      />

      {/* Modal tạo mới học sinh */}
      <Modal
        title="Tạo học sinh mới"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={handleCreateStudent}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: "Nhập họ tên" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="dateOfBirth"
            rules={[{ required: true, message: "Chọn ngày sinh" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Chọn giới tính" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="MALE">Nam</Option>
              <Option value="FEMALE">Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Lớp"
            name="className"
            rules={[{ required: true, message: "Nhập lớp học" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết học sinh */}
      <StudentDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        studentId={selectedStudentId}
      />
    </div>
  );
}

export default ManageStudent;
