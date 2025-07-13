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
  Menu,
  Dropdown,
} from "antd";
import dayjs from "dayjs";
import api from "../../config/axios";
import {
  getStudent,
  graduateStudent,
  withdrawStudent,
} from "../../services/api.student";
import StudentDetailModal from "../../components/admin/student-detail-modal";
import styles from "./ManageStudent.module.css";
import EditStudentModal from "../../components/admin/editStudentModal";

const { Option } = Select;

function ManageStudent() {
  // Danh sách học sinh
  // Sử dụng useState để quản lý trạng thái của component
  // studentList: lưu trữ danh sách học sinh từ API
  const [studentList, setStudentList] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  // Modal tạo mới học sinh
  // Sử dụng useState để quản lý trạng thái mở/đóng modal
  // isCreateModalOpen: true nếu modal đang mở, false nếu đóng
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Modal xem chi tiết học sinh
  // Sử dụng useState để quản lý trạng thái mở/đóng modal
  // selectedStudentId: lưu trữ ID của học sinh được chọn để xem chi tiết
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Lấy danh sách học sinh từ API
  const [pagination, setPagination] = useState({
    current: 1, // Trang hiện tại
    pageSize: 10, // Số dòng mỗi trang
    total: 0, // Tổng số học sinh (server trả về)
  });

  const [filters, setFilters] = useState({
    gender: null,
    classGroup: null,
    classValue: null,
    status: null,
  });

  const fetchStudent = async (page = 1, size = 10, filters = {}) => {
    try {
      const res = await api.get("/students", {
        params: {
          page: page - 1,
          size,
          ...filters,
        },
      });

      setStudentList(res.data.content);
      setPagination({
        current: page,
        pageSize: size,
        total: res.data.totalElements,
      });
    } catch (error) {
      message.error("Không thể tải danh sách học sinh");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  // Tạo mới học sinh
  const handleCreateStudent = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        fullName: values.fullName,
        gender: values.gender,
        classGroup: values.classGroup,
        classValue: values.classValue,
        dateOfBirth: dayjs(values.dateOfBirth).format("YYYY-MM-DD"),
      };
      console.log("Payload gửi lên:", payload); // debug

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
  const renderStatus = (status) => {
    let color;

    switch (status?.toLowerCase()) {
      case "hoạt động":
        color = "green";
        break;
      case "tốt nghiệp":
        color = "blue";
        break;
      case "thôi học":
        color = "red";
        break;
      default:
        color = "default";
    }

    return <Tag color={color}>{status}</Tag>;
  };
  // Hàm để đánh dấu học sinh đã thôi học hoặc tốt nghiệp
  const handleStatusChange = (status, record) => {
    const { id, fullName } = record;
    let actionText = "";

    switch (status) {
      case "WITHDRAWN":
        actionText = "đánh dấu thôi học";
        break;
      case "GRADUATED":
        actionText = "đánh dấu tốt nghiệp";
        break;
      case "REACTIVATE":
        actionText = "kích hoạt lại học sinh";
        break;
      default:
        return;
    }

    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn ${actionText} cho học sinh "${fullName}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          let endpoint = "";

          if (status === "WITHDRAWN") endpoint = `/students/${id}/withdraw`;
          else if (status === "GRADUATED")
            endpoint = `/students/${id}/graduate`;
          else if (status === "REACTIVATE")
            endpoint = `/students/${id}/reactivate`;

          await api.post(endpoint);
          message.success(`Đã ${actionText} cho học sinh "${fullName}"`);
          fetchStudent(); // load lại danh sách
        } catch (err) {
          message.error("Lỗi khi cập nhật trạng thái");
          console.error(err);
        }
      },
    });
  };
  // Cấu hình cột cho bảng
  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Khối",
      dataIndex: "classGroup",
      key: "classGroup",
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
        const color =
          gender === "Nam" || gender === "MALE" ? "blue" : "magenta";
        return <Tag color={color}>{gender}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatus(status),
    },
    {
      title: "Mã mời",
      dataIndex: "invitationCode",
      key: "invitationCode",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        const menuItems = [];

        if (record.status !== "Thôi học") {
          menuItems.push({
            key: "WITHDRAWN",
            label: "Đánh dấu thôi học",
          });
        }

        if (record.status !== "Tốt nghiệp") {
          menuItems.push({
            key: "GRADUATED",
            label: "Đánh dấu tốt nghiệp",
          });
        }

        menuItems.push({
          key: "EDIT",
          label: "Cập nhật thông tin",
        });

        const handleMenuClick = ({ key }) => {
          if (key === "WITHDRAWN" || key === "GRADUATED") {
            handleStatusChange(key, record);
          }
          if (key === "EDIT") {
            setEditingStudentId(record.id);
            setIsEditModalOpen(true);
          }
        };

        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Dropdown
              menu={{ items: menuItems, onClick: handleMenuClick }}
              trigger={["click"]}
            >
              <Button type="link">Hành động ▾</Button>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    fetchStudent(1, pagination.pageSize, updated);
  };

  return (
    <div>
      {/* Nút mở modal tạo mới */}
      <Button
        type="primary"
        className={styles.buttonCreate}
        onClick={() => setIsCreateModalOpen(true)}
      >
        Tạo mới học sinh
      </Button>
      {/* Bảng filter để lọc học sinh theo giới tính, khối và lớp */}
      <Form layout="inline" className={styles.filterBar}>
        <Form.Item label="Giới tính">
          <Select
            allowClear
            placeholder="Chọn giới tính"
            style={{ width: 150, marginRight: 8 }}
            onChange={(value) => handleFilterChange("gender", value)}
            value={filters.gender}
          >
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Khối">
          <Select
            allowClear
            placeholder="Chọn khối"
            style={{ width: 150, marginRight: 8 }}
            onChange={(value) => handleFilterChange("classGroup", value)}
            value={filters.classGroup}
          >
            <Option value="Mầm">Mầm</Option>
            <Option value="Chồi">Chồi</Option>
            <Option value="Lá">Lá</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Lớp">
          <Select
            allowClear
            placeholder="Chọn lớp"
            style={{ width: 120 }}
            onChange={(value) => handleFilterChange("classValue", value)}
            value={filters.classValue}
          >
            {["A", "B", "C", "D", "E", "F", "G", "H"].map((c) => (
              <Option key={c} value={c}>
                {c}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Trạng thái">
          <Select
            allowClear
            placeholder="Chọn trạng thái"
            style={{ width: 160, marginRight: 8 }}
            onChange={(value) => handleFilterChange("status", value)}
            value={filters.status}
          >
            <Option value="Hoạt Động">Hoạt động</Option>
            <Option value="Tốt Nghiệp">Tốt nghiệp</Option>
            <Option value="Thôi Học">Thôi học</Option>
          </Select>
        </Form.Item>
        <Button
          onClick={() => {
            const cleared = {
              gender: null,
              classGroup: null,
              classValue: null,
              status: null,
            };
            setFilters(cleared);
            fetchStudent(1, pagination.pageSize, cleared);
          }}
          type="default"
        >
          Xóa lọc
        </Button>
      </Form>

      {/* Bảng danh sách học sinh */}
      <Table
        dataSource={Array.isArray(studentList) ? studentList : []}
        columns={columns}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
          showTotal: (total) => `Tổng cộng ${total} học sinh`,
          onChange: (page, pageSize) => {
            fetchStudent(page, pageSize); // Gọi lại API khi đổi trang hoặc size
          },
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowClassName={() => styles.clickableRow}
      />

      {/* Modal tạo mới học sinh */}
      <Modal
        title="Tạo học sinh mới"
        open={isCreateModalOpen}
        onCancel={() => {
          setIsCreateModalOpen(false);
          form.resetFields();
        }}
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
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              inputReadOnly={false}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Chọn giới tính" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Khối lớp"
            name="classGroup"
            rules={[{ required: true, message: "Chọn khối lớp" }]}
          >
            <Select placeholder="Chọn khối">
              <Option value="Mầm">Mầm</Option>
              <Option value="Chồi">Chồi</Option>
              <Option value="Lá">Lá</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Lớp (A → H)"
            name="classValue"
            rules={[{ required: true, message: "Chọn lớp" }]}
          >
            <Select placeholder="Chọn lớp">
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
              <Option value="E">E</Option>
              <Option value="F">F</Option>
              <Option value="G">G</Option>
              <Option value="H">H</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết học sinh */}
      <StudentDetailModal
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        studentId={selectedStudentId}
      />
      {/* Modal chỉnh sửa thông tin học sinh */}
      <EditStudentModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        studentId={editingStudentId}
        onSuccess={() =>
          fetchStudent(pagination.current, pagination.pageSize, filters)
        }
      />
    </div>
  );
}

export default ManageStudent;
