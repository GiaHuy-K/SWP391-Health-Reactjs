import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Spin,
  Input,
  DatePicker,
  Select,
  Form,
  Row,
  Col,
  Modal,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import {
  deleteHealthIncident,
  getHealthIncidents,
} from "../../services/api.healthIncident";
import { getStudent } from "../../services/api.student";
import { getMedicalSupplies } from "../../services/api.medicalSupply";
import HealthIncidentDetailModal from "../healthIncident/healthIncidentDetailModal";
import CreateHealthIncidentModal from "../healthIncident/createHealthIncidentModal";
import EditHealthIncidentModal from "../healthIncident/editHealthIncidentModal";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

const incidentTypes = [
  "Chấn thương nhẹ",
  "Ốm đau",
  "Phản ứng dị ứng",
  "Chấn thương đầu",
  "Sốt",
  "Đau bụng",
  "Khác",
];

const EventHealthIncidentTemplate = () => {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [supplies, setSupplies] = useState([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageSize,
        sort: "incidentDateTime,DESC",
        ...filters,
      };
      const res = await getHealthIncidents(params);
      setData(res.content || []);
      setTotalItems(res.totalElements || 0);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách sự cố:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [page, pageSize, filters]);

  const handleSearch = (values) => {
    const { studentName, recordedByName, incidentType, dateRange } = values;
    const newFilters = {};
    if (studentName) newFilters.studentName = studentName;
    if (recordedByName) newFilters.recordedByName = recordedByName;
    if (incidentType) newFilters.incidentType = incidentType;
    if (dateRange && dateRange.length === 2) {
      newFilters.startDate = dayjs(dateRange[0]).format("YYYY-MM-DD");
      newFilters.endDate = dayjs(dateRange[1]).format("YYYY-MM-DD");
    }
    setFilters(newFilters);
    setPage(0);
  };

  const handleReset = () => {
    form.resetFields();
    setFilters({});
    setPage(0);
  };

  const columns = [
    {
      title: "Học sinh",
      dataIndex: "studentName",
      key: "studentName",
      render: (name, record) => `${name} (${record.studentClass})`,
    },
    {
      title: "Thời gian",
      dataIndex: "incidentDateTime",
      key: "incidentDateTime",
      render: (value) =>
        new Date(value)
          .toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
          .replace(",", " -"),
    },
    {
      title: "Loại sự cố",
      dataIndex: "incidentType",
      key: "incidentType",
    },
    {
      title: "Người ghi nhận",
      dataIndex: "recordedByUserName",
      key: "recordedByUserName",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIncident(record);
              setModalOpen(true);
            }}
          >
            Cập Nhật
          </Button>

          <Button
            type="primary"
            danger
            onClick={(e) => {
              e.stopPropagation();
              Modal.confirm({
                title: "Xác nhận xóa",
                content: "Bạn có chắc chắn muốn xóa sự cố này?",
                okText: "Xóa",
                cancelText: "Hủy",
                onOk: async () => {
                  try {
                    await deleteHealthIncident(record.incidentId);
                    fetchIncidents(); // reload danh sách
                  } catch (error) {
                    console.error("Lỗi khi xóa sự cố:", error);
                  }
                },
              });
            }}
          >
            Xóa mềm
          </Button>
        </Space>
      ),
    },
  ];
  const fetchDataAgain = () => {
    fetchIncidents();
  };

  return (
    <div>
      <div>
        <Button
          type="primary"
          onClick={() => {
            setCreateModalOpen(true);
          }}
        >
          Thêm sự cố sức khỏe
        </Button>
      </div>
      {/* Modal Thêm sự cố sức khỏe */}

      <CreateHealthIncidentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={() => {
          fetchIncidents();
          setCreateModalOpen(false);
        }}
        students={students}
        supplies={supplies}
        incidentTypes={incidentTypes}
      />
      {/* Thanh lọc thông tin sự cố sức khỏe */}
      <Form
        layout="vertical"
        onFinish={handleSearch}
        form={form}
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Tên học sinh" name="studentName">
              <Input placeholder="Nhập tên học sinh" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Người ghi nhận" name="recordedByName">
              <Input placeholder="Nhập tên người ghi nhận" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Loại sự cố" name="incidentType">
              <Select allowClear placeholder="Chọn loại sự cố">
                {incidentTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Khoảng thời gian" name="dateRange">
              <RangePicker format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="end" gutter={16}>
          <Col>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
          </Col>
          <Col>
            <Button onClick={handleReset}>Đặt lại</Button>
          </Col>
        </Row>
      </Form>

      <Spin spinning={loading}>
        <Table
          rowKey="incidentId"
          columns={columns}
          dataSource={data}
          pagination={{
            current: page + 1,
            total: totalItems,
            pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10"],
            onChange: (p, ps) => {
              setPage(p - 1);
              setPageSize(ps);
            },
          }}
          onRow={(record) => ({
            onClick: () => {
              // dùng để fix bug
              // console.log("🖱️ Dòng được click:", record);
              // console.log("🆔 incidentId =", record.incidentId);
              setSelectedIncidentId(record.incidentId);
              setDetailModalOpen(true);
            },
            style: { cursor: "pointer" },
          })}
        />
      </Spin>
      {/* Modal Chi tiết sự cố sức khỏe */}
      <HealthIncidentDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        incidentId={selectedIncidentId}
      />
      <EditHealthIncidentModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        incidentData={selectedIncident}
        onSuccess={fetchDataAgain}
        incidentTypes={[
          "Chấn thương nhẹ",
          "Ốm đau",
          "Phản ứng dị ứng",
          "Chấn thương đầu",
          "Sốt",
          "Đau bụng",
          "Khác",
        ]}
      />
    </div>
  );
};

export default EventHealthIncidentTemplate;
