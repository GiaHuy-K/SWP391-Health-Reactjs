import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Spin,
  Input,
  DatePicker,
  Select,
  Form,
  Row,
  Col,
} from "antd";
import { getHealthIncidents } from "../../services/api.healthIncident";
import dayjs from "dayjs";

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
  const [form] = Form.useForm(); // dùng form để reset

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
    setPage(0); // reset về trang đầu khi lọc
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
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
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
          <Button type="primary">Sửa</Button>
          <Button type="primary" danger>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Danh sách sự cố sức khỏe</h2>

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
        />
      </Spin>
    </div>
  );
};

export default EventHealthIncidentTemplate;
