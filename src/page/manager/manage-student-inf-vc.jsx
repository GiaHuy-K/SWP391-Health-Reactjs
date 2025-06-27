import React, { useState, useEffect } from 'react';
import { getStudent } from '../../services/api.student';
import { getStudentVaccinations } from '../../services/api.vaccine';
import { Table, Button, Pagination, message, Drawer } from 'antd';

const studentColumns = [
  { title: 'Mã HS', dataIndex: 'studentId', key: 'studentId' },
  { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
  { title: 'Lớp', dataIndex: 'className', key: 'className' },
  {
    title: 'Hành động',
    key: 'action',
    render: (_, record) => (
      <Button onClick={() => handleShowVaccination(record)}>Xem tiêm chủng</Button>
    ),
  },
];

const vaccColumns = [
  { title: 'Tên vắc xin', dataIndex: 'vaccineName', key: 'vaccineName' },
  { title: 'Ngày tiêm', dataIndex: 'vaccinationDate', key: 'vaccinationDate' },
  { title: 'Mũi số', dataIndex: 'doseNumber', key: 'doseNumber' },
  { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
];

const StudentVaccinationPage = () => {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [vaccLoading, setVaccLoading] = useState(false);
  const [vaccPagination, setVaccPagination] = useState({ page: 0, size: 10, total: 0 });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await getStudent();
        setStudents(res || []);
      } catch (err) {
        message.error('Không thể tải danh sách học sinh');
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  const handleShowVaccination = async (student) => {
    if (!student?.id) {
      message.error("Không tìm thấy ID học sinh!");
      return;
    }
    setSelectedStudent(student);
    setDrawerOpen(true);
    fetchVaccinations(student.id, 0, vaccPagination.size);
  };

  const fetchVaccinations = async (studentId, page = 0, size = 10) => {
    if (!studentId) return;
    setVaccLoading(true);
    try {
      const res = await getStudentVaccinations(studentId, { page, size, sort: 'vaccinationDate,DESC' });
      setVaccinations(res.content || []);
      setVaccPagination({ page: res.number, size: res.size, total: res.totalElements });
    } catch (err) {
      setVaccinations([]);
      setVaccPagination({ page: 0, size: 10, total: 0 });
    } finally {
      setVaccLoading(false);
    }
  };

  const handleVaccPageChange = (page, pageSize) => {
    if (selectedStudent) {
      fetchVaccinations(selectedStudent.id, page - 1, pageSize);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách học sinh</h2>
      <Table
        columns={studentColumns.map(col =>
          col.key === 'action'
            ? { ...col, render: (_, record) => <Button onClick={() => handleShowVaccination(record)}>Xem tiêm chủng</Button> }
            : col
        )}
        dataSource={students}
        rowKey={r => r.id}
        loading={loadingStudents}
        pagination={false}
        locale={{ emptyText: 'Không có dữ liệu học sinh' }}
      />
      <Drawer
        title={`Thông tin tiêm chủng: ${selectedStudent?.fullName || ''}`}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={700}
      >
        <Table
          columns={vaccColumns}
          dataSource={vaccinations}
          rowKey={r => r.id || r.vaccineName + r.vaccinationDate}
          loading={vaccLoading}
          pagination={false}
          locale={{ emptyText: 'Không có dữ liệu tiêm chủng' }}
        />
        <Pagination
          style={{ marginTop: 16, textAlign: 'right' }}
          current={vaccPagination.page + 1}
          pageSize={vaccPagination.size}
          total={vaccPagination.total}
          onChange={handleVaccPageChange}
          showSizeChanger
          pageSizeOptions={['5', '10', '20', '50']}
        />
      </Drawer>
    </div>
  );
};

export default StudentVaccinationPage;
