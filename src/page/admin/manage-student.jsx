import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Space,
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
  const [studentList, setStudentList] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Modal xem chi tiết thông tin student
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // lấy dữ liệu học sinh 
  const fetchStudent = async () => {
    const data = await getStudent();
    setStudentList(data);
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  // hàm tạo mới học sinh 
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
      fetchStudent();
    } catch (err) {
      message.error("Lỗi khi tạo học sinh");
      console.error(err);
    }
  };

  const handleRowClick = (record) => {
    setSelectedStudentId(record.studentId);
    setIsDetailModalOpen(true);
  };

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
        const color = gender === "Nam" || gender === "MALE" ? "blue" : "magenta";// màu cho 2 giới tính
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
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsCreateModalOpen(true)}
      >
        Tạo mới học sinh
      </Button>

      <Table
        dataSource={studentList}
        columns={columns}
        rowKey="studentId"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" },
        })}
      />

      {/* Modal tạo mới student */}
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
            label="Mã học sinh"
            name="studentCode"
            rules={[{ required: true, message: "Nhập mã học sinh" }]}
          >
            <Input />
          </Form.Item>
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
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết student */}
      <StudentDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        studentId={selectedStudentId}
      />
    </div>
  );
}

export default ManageStudent;
