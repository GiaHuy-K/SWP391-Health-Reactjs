import React, { useState } from 'react';
import { getStudentVaccinations } from '../../services/api.vaccine';
import { Table, Input, Button, Pagination, message } from 'antd';

const columns = [
  {
    title: 'STT',
    dataIndex: 'index',
    key: 'index',
    render: (text, record, idx) => idx + 1,
  },
  {
    title: 'Tên vắc xin',
    dataIndex: 'vaccineName',
    key: 'vaccineName',
  },
  {
    title: 'Ngày tiêm',
    dataIndex: 'vaccinationDate',
    key: 'vaccinationDate',
  },
  {
    title: 'Mũi số',
    dataIndex: 'doseNumber',
    key: 'doseNumber',
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
  },
];

const StudentVaccinationPage = () => {
  const [studentId, setStudentId] = useState('');
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, size: 10, total: 0 });
  const [loading, setLoading] = useState(false);

  const fetchVaccinations = async (page = 0, size = 10) => {
    if (!studentId) {
      message.warning('Vui lòng nhập mã học sinh!');
      return;
    }
    setLoading(true);
    try {
      const res = await getStudentVaccinations(studentId, { page, size, sort: 'vaccinationDate,DESC' });
      setData(res.content || []);
      setPagination({
        page: res.number,
        size: res.size,
        total: res.totalElements,
      });
    } catch (err) {
      setData([]);
      setPagination({ page: 0, size: 10, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchVaccinations(0, pagination.size);
  };

  const handlePageChange = (page, pageSize) => {
    fetchVaccinations(page - 1, pageSize);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Tra cứu thông tin tiêm chủng của học sinh</h2>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Input
          placeholder="Nhập mã học sinh"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
          style={{ width: 200 }}
        />
        <Button type="primary" onClick={handleSearch} loading={loading}>
          Tìm kiếm
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record, idx) => idx}
        loading={loading}
        pagination={false}
        locale={{ emptyText: 'Không có dữ liệu' }}
      />
      <Pagination
        style={{ marginTop: 16, textAlign: 'right' }}
        current={pagination.page + 1}
        pageSize={pagination.size}
        total={pagination.total}
        onChange={handlePageChange}
        showSizeChanger
        pageSizeOptions={['5', '10', '20', '50']}
      />
    </div>
  );
};

export default StudentVaccinationPage;
