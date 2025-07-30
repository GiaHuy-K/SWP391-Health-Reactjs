import React, { useEffect, useState } from "react";
import { Table, Input, Select, Tag, Space, Button, Pagination, Spin } from "antd";
import { getCampaignConsents } from "../../services/api.vaccination";
import VaccinationConsentEditModal from "./VaccinationConsentEditModal";

const { Search } = Input;
const { Option } = Select;

const statusColors = {
  "Đồng ý": "green",
  "Từ chối": "red",
  "Chưa phản hồi": "orange"
};

const VaccinationConsentList = ({ campaignId, onConsentClick }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    studentName: "",
    studentClass: "",
    status: ""
  });
  const [editConsent, setEditConsent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCampaignConsents(campaignId, {
        page: page - 1,
        size: pageSize,
        studentName: filters.studentName || undefined,
        studentClass: filters.studentClass || undefined,
        status: filters.status || undefined
      });
      setData((res.content || []).map(item => ({
        ...item,
        id: item.id || item._id || item.consentId
      })));
      setTotal(res.totalElements || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (campaignId) fetchData();
    // eslint-disable-next-line
  }, [campaignId, page, pageSize, filters]);

  const handleConsentClick = (record) => {
    setEditConsent(record);
    setModalOpen(true);
  };

  const columns = [
    {
      title: "Học sinh",
      dataIndex: "studentName",
      key: "studentName",
      render: (text, record) => (
        <Button type="link" onClick={() => handleConsentClick(record)}>{text}</Button>
      )
    },
    {
      title: "Lớp",
      dataIndex: "studentClass",
      key: "studentClass"
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={statusColors[status] || "default"}>{status}</Tag>
    },  
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm tên học sinh"
          allowClear
          onSearch={value => setFilters(f => ({ ...f, studentName: value }))}
          style={{ width: 180 }}
        />
        <Input
          placeholder="Lọc theo lớp"
          allowClear
          onChange={e => setFilters(f => ({ ...f, studentClass: e.target.value }))}
          style={{ width: 120 }}
        />
        <Select
          placeholder="Trạng thái"
          allowClear
          style={{ width: 120 }}
          onChange={value => setFilters(f => ({ ...f, status: value }))}
        >
          <Option value="Đồng ý">Đồng ý</Option>
          <Option value="Từ chối">Từ chối</Option>
          <Option value="Chưa phản hồi">Chưa phản hồi</Option>
        </Select>
      </Space>
      <Spin spinning={loading} tip="Đang tải...">
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(record, idx) => record.id || record._id || idx}
          pagination={false}
          onRow={record => ({ onClick: () => handleConsentClick(record) })}
        />
        <VaccinationConsentEditModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          consent={editConsent}
          onSuccess={fetchData}
        />
        <Pagination
          style={{ marginTop: 16, textAlign: "right" }}
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          onChange={setPage}
          onShowSizeChange={(_, size) => setPageSize(size)}
        />
      </Spin>
    </div>
  );
};

export default VaccinationConsentList; 