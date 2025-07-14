import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Spin,
  Form,
  Row,
  Col,
  Tag,
  Dropdown,
  Button,
  Menu,
} from "antd";
import {
  getVaccinationRecordsByCampaign,
  getVaccinationDetail,
  getVaccinationMonitoring,
} from "../../services/api.vaccineAtSchool";
import VaccinationDetailModal from "../../components/vaccination/AtSchool/vaccinationDetailModal";
import VaccinationMonitoringModal from "../../components/vaccination/AtSchool/vaccinationMonitoringModal";
import { DownOutlined } from "@ant-design/icons";
const { Option } = Select;

function VaccinationAtSchool() {
  const campaignId = 1; // TODO: lấy từ router params nếu cần
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    studentName: "",
    status: "",
  });

  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detail, setDetail] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [monitoringData, setMonitoringData] = useState([]);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [monitoringVisible, setMonitoringVisible] = useState(false);

  const handleOpenMonitoring = async (vaccinationId) => {
    setMonitoringVisible(true);
    setMonitoringLoading(true);
    try {
      const res = await getVaccinationMonitoring(vaccinationId);
      setMonitoringData(res || []);
    } catch (err) {
      console.error("Lỗi khi lấy theo dõi sau tiêm:", err);
      setMonitoringData([]);
    } finally {
      setMonitoringLoading(false);
    }
  };
  const fetchData = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params = {
        page: page - 1,
        size: pageSize,
        ...filters,
      };
      const res = await getVaccinationRecordsByCampaign(campaignId, params);
      setData(res.content || []);
      setPagination({
        current: res.number + 1,
        pageSize: res.size,
        total: res.totalElements,
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bản ghi tiêm chủng:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [filters]);
  
  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  const handleRowClick = async (record) => {
    setSelectedId(record.schoolVaccinationId);
    setShowModal(true);
    setModalLoading(true);
    try {
      const res = await getVaccinationDetail(record.schoolVaccinationId);
      setDetail(res);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết bản ghi:", err);
      setDetail(null);
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    {
      title: "Chiến dịch",
      dataIndex: "campaignName",
      key: "campaignName",
      render: (text) => (
        <div style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Học sinh",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => renderStatusTag(status),
    },
    {
      title: "Ngày tiêm",
      dataIndex: "vaccinationDate",
      key: "vaccinationDate",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => {
        const items = [
          {
            key: "monitoring",
            label: "📋 Theo dõi sau tiêm",
          },
          {
            key: "edit",
            label: "✏️ Cập nhật trạng thái tiêm chủng",
          },
          {
            key: "editMonitoring",
            label: "✏️ Cập nhật theo dõi sau tiêm",
          },
        ];

        const handleMenuClick = ({ key, domEvent }) => {
          domEvent.stopPropagation(); // Chặn click lan ra ngoài (fix dính onRow)
          if (key === "monitoring") {
            handleOpenMonitoring(record.schoolVaccinationId);
          } else if (key === "edit") {
            // TODO: handleEdit(record.schoolVaccinationId);
          } else if (key === "editMonitoring") {
            // TODO: handleEditMonitoring(record.schoolVaccinationId);
          }
        };

        return (
          <Dropdown
            trigger={["click"]}
            menu={{
              items,
              onClick: handleMenuClick,
            }}
          >
            <Button type="link" onClick={(e) => e.stopPropagation()}>
              Hành động <DownOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const renderStatusTag = (status) => {
    const normalized = status?.toLowerCase();
    if (["đã lên lịch", "scheduled"].includes(normalized))
      return <Tag color="blue">Đã lên lịch</Tag>;
    if (["đã hoàn thành", "completed"].includes(normalized))
      return <Tag color="green">Đã hoàn thành</Tag>;
    if (["vắng mặt", "absent"].includes(normalized))
      return <Tag color="red">Vắng mặt</Tag>;
    if (["từ chối", "declined"].includes(normalized))
      return <Tag color="orange">Từ chối</Tag>;
    return <Tag>{status}</Tag>;
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Danh sách bản ghi tiêm chủng</h2>

      <Form
        layout="vertical"
        form={form}
        style={{ marginBottom: 24 }}
        onValuesChange={(changedValues, allValues) => {
          setFilters({
            studentName: allValues.studentName || "",
            status: allValues.status || "",
          });
        }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Tên học sinh" name="studentName">
              <Input placeholder="Nhập tên học sinh" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Trạng thái" name="status">
              <Select allowClear placeholder="Chọn trạng thái">
                <Option value="SCHEDULED">Đã lên lịch</Option>
                <Option value="COMPLETED">Đã hoàn thành</Option>
                <Option value="ABSENT">Vắng mặt</Option>
                <Option value="DECLINED">Từ chối</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Spin spinning={loading}>
        <Table
          rowKey={(record) => record.schoolVaccinationId}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          onChange={handleTableChange}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </Spin>
      {/* {console.log("Modal open?", showModal)} */}
      {/* Modal xem chi tiết bản ghi tiêm chủng */}
      <VaccinationDetailModal
        open={showModal}
        onClose={() => setShowModal(false)}
        loading={modalLoading}
        detail={detail}
      />
      {/* Modal theo dõi sau tiêm */}
      <VaccinationMonitoringModal
        open={monitoringVisible}
        loading={monitoringLoading}
        data={monitoringData}
        onClose={() => setMonitoringVisible(false)}
      />
    </div>
  );
}

export default VaccinationAtSchool;
