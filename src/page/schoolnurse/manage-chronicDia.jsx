import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Form,
  DatePicker,
  Space,
  Popconfirm,
  message,
  Typography,
  Pagination,
  Row,
  Col,
  Card,
  Statistic,
  Progress,
} from "antd";
import {
  getStudentChronicDiseases,
  updateChronicDiseaseStatus,
  updateChronicDisease,
  getAllChronicDiseases,
  getChronicDiseaseFileUrl,
  deleteChronicDisease,
} from "../../services/api.chronic";
import { getStudent } from "../../services/api.student";
import dayjs from "dayjs";
import {
  validateDiagnosisDate,
  getStudentBirthDate,
} from "../../utils/dateValidation";
import {
  FileOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../config/AuthContext";

const { Option } = Select;
const { Title, Text } = Typography;

const normalizeStatus = (status) =>
  (status || "").trim().toLowerCase().normalize("NFC");

const ManageChronicDia = () => {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [chronicList, setChronicList] = useState([]);
  const [chronicLoading, setChronicLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editModalMode, setEditModalMode] = useState("edit");
  const [selectedChronic, setSelectedChronic] = useState(null);
  const [chronicForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const { user } = useAuth();

  // Lấy danh sách học sinh
  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await getStudent();
        setStudents(Array.isArray(res) ? res : res?.content || []);
      } catch (err) {
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  // Lấy danh sách bệnh mãn tính
  const fetchChronic = async (page = 0, size = 10) => {
    setChronicLoading(true);
    try {
      const params = {
        page,
        size,
        sort: "createdAt,DESC",
        status: status || undefined,
        search: searchText || undefined,
        studentId: selectedStudent?.id || undefined,
      };
      Object.keys(params).forEach((k) => {
        if (params[k] === undefined) delete params[k];
      });
      const res = await getAllChronicDiseases(params);
      let list = res.content || [];
      // Nếu đã chọn học sinh, filter chính xác theo studentId
      if (selectedStudent?.id) {
        list = list.filter((item) => item.studentId === selectedStudent.id);
      } else if (searchText) {
        // Nếu không chọn học sinh, filter theo searchText trên cả tên học sinh và tên bệnh
        const lowerSearch = searchText.toLowerCase();
        list = list.filter(
          (item) =>
            (item.studentFullName &&
              item.studentFullName.toLowerCase().includes(lowerSearch)) ||
            (item.diseaseName &&
              item.diseaseName.toLowerCase().includes(lowerSearch))
        );
      }
      setChronicList(list);
      setPagination({
        page: res.number,
        size: res.size,
        total: res.totalElements,
      });

      // Tính toán thống kê
      const allChronic = res.content || [];
      setStats({
        total: allChronic.length,
        pending: allChronic.filter(
          (item) => normalizeStatus(item.status) === "chờ xử lý"
        ).length,
        approved: allChronic.filter(
          (item) => normalizeStatus(item.status) === "chấp nhận"
        ).length,
        rejected: allChronic.filter(
          (item) => normalizeStatus(item.status) === "từ chối"
        ).length,
      });
    } catch (err) {
      setChronicList([]);
      setPagination({ page: 0, size: 10, total: 0 });
    } finally {
      setChronicLoading(false);
    }
  };

  useEffect(() => {
    fetchChronic();
  }, [searchText, status, selectedStudent]);

  const handlePageChange = (page, pageSize) => {
    fetchChronic(page - 1, pageSize);
  };

  // Modal xem file bằng chứng
  const handleViewFile = async (chronicDiseaseId) => {
    setFileLoading(true);
    try {
      const res = await getChronicDiseaseFileUrl(chronicDiseaseId);
      const url = res?.url || (typeof res === "string" ? res : "");
      if (!url) {
        message.error("Không có file bằng chứng cho bản ghi này");
        setFileUrl("");
        setFileModalVisible(true);
        return;
      }
      setFileUrl(url);
      setFileModalVisible(true);
    } catch (err) {
      message.error("Không thể tải file bằng chứng");
      setFileUrl("");
      setFileModalVisible(true);
    } finally {
      setFileLoading(false);
    }
  };

  // Modal chi tiết
  const handleShowDetail = (record) => {
    setSelectedChronic(record);
    setDetailModalVisible(true);
  };

  // Modal chỉnh sửa
  const handleEdit = (record) => {
    setEditModalMode("edit");
    setSelectedChronic(record);
    chronicForm.setFieldsValue({
      diseaseName: record.diseaseName,
      diagnosedDate: record.diagnosedDate ? dayjs(record.diagnosedDate) : null,
      diagnosingDoctor: record.diagnosingDoctor,
      notes: record.notes,
    });
    setEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    setLoading(true);
    try {
      // Validate diagnosis date
      if (values.diagnosedDate) {
        const selectedStudent = students.find(
          (s) => s.id === selectedChronic.studentId
        );
        const studentBirthDate = getStudentBirthDate(selectedStudent);

        const diagnosisValidation = validateDiagnosisDate(
          values.diagnosedDate.format("YYYY-MM-DD"),
          studentBirthDate
        );
        if (!diagnosisValidation.isValid) {
          message.error(diagnosisValidation.error);
          setLoading(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("diseaseName", values.diseaseName);
      if (values.diagnosedDate)
        formData.append(
          "diagnosedDate",
          values.diagnosedDate.format("YYYY-MM-DD")
        );
      if (values.diagnosingDoctor)
        formData.append("diagnosingDoctor", values.diagnosingDoctor);
      if (values.notes) formData.append("notes", values.notes);
      if (values.attachmentFile && values.attachmentFile[0]) {
        formData.append(
          "attachmentFile",
          values.attachmentFile[0].originFileObj
        );
      }
      await updateChronicDisease(selectedChronic.id, formData);
      message.success("Cập nhật thông tin bệnh mãn tính thành công!");
      setEditModalVisible(false);
      fetchChronic(pagination.page, pagination.size);
    } catch (err) {
      message.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Duyệt
  const handleApprove = async (chronicDiseaseId) => {
    try {
      await updateChronicDiseaseStatus(
        chronicDiseaseId,
        "APPROVE",
        "Hồ sơ hợp lệ, đã duyệt"
      );
      message.success("Duyệt thành công!");
      fetchChronic(pagination.page, pagination.size);
    } catch (err) {
      message.error("Duyệt thất bại!");
    }
  };

  // Từ chối
  const handleReject = async (chronicDiseaseId) => {
    try {
      await updateChronicDiseaseStatus(
        chronicDiseaseId,
        "REJECTED",
        "Thiếu thông tin cần thiết"
      );
      message.success("Từ chối thành công!");
      fetchChronic(pagination.page, pagination.size);
    } catch (err) {
      message.error("Từ chối thất bại!");
    }
  };

  // Xóa
  const handleDelete = async (chronicDiseaseId) => {
    try {
      await deleteChronicDisease(chronicDiseaseId);
      message.success("Đã xóa bản ghi bệnh mãn tính");
      fetchChronic(pagination.page, pagination.size);
    } catch (err) {
      message.error("Xóa thất bại");
    }
  };

  // Cột bảng
  const columns = [
    {
      title: "Tên học sinh",
      dataIndex: "studentFullName",
      key: "studentFullName",
    },
    { title: "Lớp", dataIndex: "studentClassName", key: "studentClassName" },
    { title: "Tên bệnh", dataIndex: "diseaseName", key: "diseaseName" },
    {
      title: "Ngày chẩn đoán",
      dataIndex: "diagnosedDate",
      key: "diagnosedDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          PENDING: { text: "Chờ duyệt", color: "#faad14" },
          APPROVED: { text: "Đã duyệt", color: "#52c41a" },
          REJECTED: { text: "Từ chối", color: "#ff4d4f" },
        };
        const info = statusMap[status] || { text: status, color: "#666" };
        return (
          <span style={{ color: info.color, fontWeight: "bold" }}>
            {info.text}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleShowDetail(record)}
            size="small"
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<FileOutlined />}
            onClick={() => handleViewFile(record.id)}
            size="small"
            loading={fileLoading}
          >
            File
          </Button>
          {(record.status === "PENDING" || record.status === "Chờ xử lý") && (
            <>
              <Button
                type="link"
                style={{ color: "#52c41a", fontWeight: 600 }}
                onClick={() => handleApprove(record.id)}
              >
                Duyệt
              </Button>
              <Button
                type="link"
                style={{ color: "#ff4d4f", fontWeight: 600 }}
                onClick={() => handleReject(record.id)}
              >
                Từ chối
              </Button>
            </>
          )}
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa bản ghi này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Lọc danh sách học sinh theo tên
  const filteredStudents = Array.isArray(students)
    ? students.filter((s) =>
        s.fullName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Quản lý bệnh mãn tính học sinh</Title>

      {/* Dashboard thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số bệnh mãn tính"
              value={stats.total}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Chờ duyệt"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã duyệt"
              value={stats.approved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Từ chối"
              value={stats.rejected}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ tỷ lệ */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Tỷ lệ trạng thái bệnh mãn tính">
            <div style={{ textAlign: "center" }}>
              <Progress
                type="circle"
                percent={
                  stats.total > 0
                    ? Math.round((stats.approved / stats.total) * 100)
                    : 0
                }
                format={(percent) => `${percent}%`}
                strokeColor="#52c41a"
                trailColor="#f0f0f0"
              />
              <div style={{ marginTop: 16 }}>
                <Text>
                  Đã duyệt: {stats.approved}/{stats.total}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Thống kê theo trạng thái">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <Text>Chờ duyệt: </Text>
                <Progress
                  percent={
                    stats.total > 0
                      ? Math.round((stats.pending / stats.total) * 100)
                      : 0
                  }
                  strokeColor="#faad14"
                  showInfo={false}
                />
              </div>
              <div>
                <Text>Đã duyệt: </Text>
                <Progress
                  percent={
                    stats.total > 0
                      ? Math.round((stats.approved / stats.total) * 100)
                      : 0
                  }
                  strokeColor="#52c41a"
                  showInfo={false}
                />
              </div>
              <div>
                <Text>Từ chối: </Text>
                <Progress
                  percent={
                    stats.total > 0
                      ? Math.round((stats.rejected / stats.total) * 100)
                      : 0
                  }
                  strokeColor="#ff4d4f"
                  showInfo={false}
                />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <div
        style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}
      >
        <Input
          placeholder="Tìm kiếm tên học sinh hoặc tên bệnh"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
        <Select
          placeholder="Trạng thái"
          value={status}
          onChange={setStatus}
          style={{ width: 150 }}
          allowClear
        >
          <Option value="PENDING">Chờ duyệt</Option>
          <Option value="APPROVE">Đã duyệt</Option>
          <Option value="REJECTED">Từ chối</Option>
        </Select>
        <Select
          placeholder="Học sinh"
          value={selectedStudent?.id}
          onChange={(id) =>
            setSelectedStudent(
              Array.isArray(students)
                ? students.find((s) => s.id === id)
                : undefined
            )
          }
          style={{ width: 200 }}
          allowClear
          showSearch
          filterOption={(input, option) => {
            const label = option.children;
            return typeof label === "string"
              ? label.toLowerCase().includes(input.toLowerCase())
              : String(label).toLowerCase().includes(input.toLowerCase());
          }}
        >
          {Array.isArray(students) &&
            students.map((stu) => (
              <Option key={stu.id} value={stu.id}>
                {stu.fullName} - {stu.className}
              </Option>
            ))}
        </Select>
        <Button type="primary" onClick={() => fetchChronic(0, pagination.size)}>
          Tìm kiếm
        </Button>
      </div>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={chronicList}
        rowKey={(r) => r.id}
        loading={chronicLoading}
        pagination={false}
        bordered
        locale={{ emptyText: "Không có dữ liệu bệnh mãn tính" }}
      />
      <Pagination
        style={{ marginTop: 16, textAlign: "right" }}
        current={pagination.page + 1}
        pageSize={pagination.size}
        total={pagination.total}
        onChange={handlePageChange}
        showSizeChanger
        pageSizeOptions={["10", "20", "50", "100"]}
      />

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết bệnh mãn tính"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedChronic && (
          <div>
            <div style={{ marginBottom: 12 }}>
              <b>Học sinh:</b> {selectedChronic.studentFullName} (
              {selectedChronic.studentClassName})
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Tên bệnh:</b> {selectedChronic.diseaseName}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Ngày chẩn đoán:</b>{" "}
              {selectedChronic.diagnosedDate
                ? dayjs(selectedChronic.diagnosedDate).format("DD/MM/YYYY")
                : "-"}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Bác sĩ chẩn đoán:</b> {selectedChronic.diagnosingDoctor || "-"}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Ghi chú:</b> {selectedChronic.notes || "-"}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Trạng thái:</b> {selectedChronic.status}
            </div>
            {selectedChronic.hasAttachmentFile && (
              <div style={{ marginBottom: 12 }}>
                <b>File đính kèm:</b>{" "}
                {selectedChronic.attachmentFileOriginalName || "Có file"}
              </div>
            )}
            <div style={{ marginBottom: 12 }}>
              <b>Ngày tạo:</b>{" "}
              {selectedChronic.createdAt
                ? dayjs(selectedChronic.createdAt).format("DD/MM/YYYY HH:mm")
                : "-"}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Người tạo:</b> {selectedChronic.createdByUserFullName || "-"}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Ngày cập nhật:</b>{" "}
              {selectedChronic.updatedAt
                ? dayjs(selectedChronic.updatedAt).format("DD/MM/YYYY HH:mm")
                : "-"}
            </div>
            <div style={{ marginBottom: 12 }}>
              <b>Người cập nhật:</b>{" "}
              {selectedChronic.updatedByUserFullName || "-"}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal file bằng chứng */}
      <Modal
        title="File bằng chứng bệnh mãn tính"
        open={fileModalVisible}
        onCancel={() => setFileModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setFileModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="download"
            type="primary"
            onClick={() => fileUrl && window.open(fileUrl, "_blank")}
            disabled={!fileUrl}
          >
            Tải xuống
          </Button>,
        ]}
        width={800}
      >
        {fileUrl ? (
          <div style={{ textAlign: "center" }}>
            <iframe
              src={fileUrl}
              style={{ width: "100%", height: "500px", border: "none" }}
              title="File bằng chứng"
            />
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "50px" }}>
            {fileLoading ? (
              <div>Đang tải file...</div>
            ) : (
              <div>Không thể hiển thị file</div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa bệnh mãn tính"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={chronicForm} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="diseaseName"
            label="Tên bệnh mãn tính"
            rules={[
              { required: true, message: "Vui lòng nhập tên bệnh mãn tính" },
            ]}
          >
            <Input placeholder="Nhập tên bệnh mãn tính" />
          </Form.Item>
          <Form.Item
            name="diagnosedDate"
            label={
              <span>
                Ngày chẩn đoán
                {selectedChronic &&
                  (() => {
                    const selectedStudent = students.find(
                      (s) => s.id === selectedChronic.studentId
                    );
                    return selectedStudent ? (
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          fontWeight: "normal",
                          marginLeft: "8px",
                        }}
                      >
                        (Học sinh sinh ngày:{" "}
                        {dayjs(selectedStudent.dateOfBirth).format(
                          "DD/MM/YYYY"
                        )}
                        )
                      </span>
                    ) : null;
                  })()}
              </span>
            }
            rules={[]}
            extra={
              selectedChronic ? (
                (() => {
                  const selectedStudent = students.find(
                    (s) => s.id === selectedChronic.studentId
                  );
                  return selectedStudent ? (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginTop: "4px",
                      }}
                    >
                      <span>
                        📅 Có thể chọn từ ngày sinh (
                        {dayjs(selectedStudent.dateOfBirth).format(
                          "DD/MM/YYYY"
                        )}
                        ) đến ngày hiện tại
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#ff4d4f",
                        marginTop: "4px",
                      }}
                    >
                      ⚠️ Không tìm thấy thông tin học sinh
                    </div>
                  );
                })()
              ) : (
                <div
                  style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}
                >
                  💡 Chọn ngày chẩn đoán (không bắt buộc)
                </div>
              )
            }
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder={
                selectedChronic
                  ? (() => {
                      const selectedStudent = students.find(
                        (s) => s.id === selectedChronic.studentId
                      );
                      return selectedStudent
                        ? `Chọn ngày từ ${dayjs(
                            selectedStudent.dateOfBirth
                          ).format("DD/MM/YYYY")} đến hôm nay`
                        : "Không tìm thấy thông tin học sinh";
                    })()
                  : "Chọn ngày chẩn đoán (không bắt buộc)"
              }
              disabledDate={(current) => {
                if (!current || !selectedChronic) return false;
                const selectedStudent = students.find(
                  (s) => s.id === selectedChronic.studentId
                );
                if (!selectedStudent) return false;
                const birthDate = dayjs(selectedStudent.dateOfBirth);
                const today = dayjs();
                return (
                  current.isBefore(birthDate, "day") ||
                  current.isAfter(today, "day")
                );
              }}
              allowClear={true}
              showToday={true}
              inputReadOnly={false}
            />
          </Form.Item>
          <Form.Item name="diagnosingDoctor" label="Bác sĩ chẩn đoán">
            <Input placeholder="Nhập tên bác sĩ chẩn đoán" />
          </Form.Item>
          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>
          <Form.Item name="attachmentFile" label="File bằng chứng" rules={[]}>
            <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setEditModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Cập nhật
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageChronicDia;
