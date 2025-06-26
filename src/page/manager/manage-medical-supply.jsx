import React, { useEffect, useState } from "react";
import {
  getMedicalSupplies,
  hardDeleteMedicalSupply,
} from "../../services/api.medicalSupply";
import MedicalSupplyTableTemplate from "../../components/templates/medicalSupplyTableTemplate";
import { toast } from "react-toastify";
import { getStudent } from "../../services/api.student";
import { getStudentVaccinations, addStudentVaccination, updateStudentVaccination, deleteStudentVaccination, updateVaccinationStatus } from "../../services/api.student";
import { Table, Input, Button, Drawer, Pagination, message } from "antd";

function ManageMedicalSupplyM() {
    const [medicalList, setMedicalList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [vaccinations, setVaccinations] = useState([]);
    const [vaccLoading, setVaccLoading] = useState(false);
    const [vaccPage, setVaccPage] = useState(0);
    const [vaccSize, setVaccSize] = useState(10);
    const [vaccTotal, setVaccTotal] = useState(0);
    const [addForm, setAddForm] = useState({ vaccineName: '', vaccinationDate: '', doseNumber: '', note: '' });
    const [addLoading, setAddLoading] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [statusLoadingId, setStatusLoadingId] = useState(null);

    const role = localStorage.getItem("role");
    const canDelete = role === "Quản lý Nhân sự/Nhân viên";
    const canView = true;
  
    const fetchSupply = async () => {
      setLoading(true);
      try {
        const response = await getMedicalSupplies();
        setMedicalList(response);
      } catch (error) {
          console.log(error);
        toast.error("Lỗi API");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchSupply();
      fetchStudents();
    }, []);
  
    const handleDelete = async (id) => {
      await hardDeleteMedicalSupply(id);
      fetchSupply();
    };

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await getStudent();
        setStudents(res);
      } catch (err) {
        message.error("Không thể tải danh sách học sinh");
      } finally {
        setLoading(false);
      }
    };

    const handleSearch = () => {
      if (!search) {
        fetchStudents();
        return;
      }
      const filtered = students.filter(
        (s) =>
          s.studentId?.toString().includes(search) ||
          s.fullName?.toLowerCase().includes(search.toLowerCase())
      );
      setStudents(filtered);
    };

    const showVaccination = async (student) => {
      setSelectedStudent(student);
      setVaccLoading(true);
      try {
        const res = await getStudentVaccinations(student.studentId, {
          page: vaccPage,
          size: vaccSize,
          sort: "vaccinationDate,DESC",
        });
        setVaccinations(res.content || []);
        setVaccTotal(res.totalElements || 0);
      } catch (err) {
        setVaccinations([]);
        setVaccTotal(0);
      } finally {
        setVaccLoading(false);
      }
    };

    const handleVaccPageChange = (page, pageSize) => {
      setVaccPage(page - 1);
      setVaccSize(pageSize);
      if (selectedStudent) {
        showVaccination(selectedStudent);
      }
    };

    const handleAddChange = (e) => {
      const { name, value } = e.target;
      setAddForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSubmit = async (e) => {
      e.preventDefault();
      if (!selectedStudent) return;
      setAddLoading(true);
      try {
        await addStudentVaccination(selectedStudent.studentId, addForm);
        setAddForm({ vaccineName: '', vaccinationDate: '', doseNumber: '', note: '' });
        showVaccination(selectedStudent); // reload list
      } catch (err) {}
      setAddLoading(false);
    };

    const handleEditClick = (record) => {
      setEditForm({ ...record });
    };

    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
      e.preventDefault();
      if (!editForm?.id) return;
      setEditLoading(true);
      try {
        await updateStudentVaccination(editForm.id, editForm);
        setEditForm(null);
        showVaccination(selectedStudent); // reload list
      } catch (err) {}
      setEditLoading(false);
    };

    const handleDeleteVaccination = async (record) => {
      if (!window.confirm("Bạn có chắc chắn muốn xoá bản ghi này?")) return;
      try {
        await deleteStudentVaccination(record.id);
        showVaccination(selectedStudent);
      } catch (err) {}
    };

    const handleStatusChange = async (record, newStatus) => {
      setStatusLoadingId(record.id);
      try {
        await updateVaccinationStatus(record.id, newStatus);
        showVaccination(selectedStudent);
      } catch (err) {}
      setStatusLoadingId(null);
    };

    const columns = [
      { title: "Mã HS", dataIndex: "studentId" },
      { title: "Họ tên", dataIndex: "fullName" },
      { title: "Lớp", dataIndex: "className" },
      {
        title: "Hành động",
        render: (_, record) => (
          <Button onClick={() => showVaccination(record)}>
            Xem tiêm chủng
          </Button>
        ),
      },
    ];

    const vaccColumns = [
      { title: "Tên vắc xin", dataIndex: "vaccineName" },
      { title: "Ngày tiêm", dataIndex: "vaccinationDate" },
      { title: "Mũi số", dataIndex: "doseNumber" },
      { title: "Ghi chú", dataIndex: "note" },
      { title: "Trạng thái", dataIndex: "status", render: (text) => text || 'Chưa duyệt' },
      {
        title: "Hành động",
        render: (_, record) => (
          <>
            <Button onClick={() => handleEditClick(record)} size="small" style={{ marginRight: 8 }}>Sửa</Button>
            <Button onClick={() => handleDeleteVaccination(record)} size="small" danger style={{ marginRight: 8 }}>Xoá</Button>
            <Button
              size="small"
              loading={statusLoadingId === record.id}
              onClick={() => handleStatusChange(record, record.status === 'APPROVED' ? 'REJECTED' : 'APPROVED')}
              type={record.status === 'APPROVED' ? 'default' : 'primary'}
            >
              {record.status === 'APPROVED' ? 'Hủy duyệt' : 'Duyệt'}
            </Button>
          </>
        ),
      },
    ];

    return (
      <div style={{ padding: 24 }}>
        <h2>Danh sách học sinh</h2>
        <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
          <Input
            placeholder="Tìm kiếm theo mã HS hoặc tên"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
          />
          <Button onClick={handleSearch}>Tìm kiếm</Button>
        </div>
        <Table
          columns={columns}
          dataSource={students}
          rowKey={(r) => r.studentId}
          loading={loading}
          pagination={false}
          locale={{ emptyText: "Không có dữ liệu" }}
        />
        <Drawer
          title={`Thông tin tiêm chủng: ${selectedStudent?.fullName || ""}`}
          open={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          width={700}
        >
          <form onSubmit={handleAddSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Input
              name="vaccineName"
              placeholder="Tên vắc xin"
              value={addForm.vaccineName}
              onChange={handleAddChange}
              style={{ width: 180 }}
              required
            />
            <Input
              name="vaccinationDate"
              placeholder="Ngày tiêm (YYYY-MM-DD)"
              value={addForm.vaccinationDate}
              onChange={handleAddChange}
              style={{ width: 150 }}
              required
            />
            <Input
              name="doseNumber"
              placeholder="Mũi số"
              value={addForm.doseNumber}
              onChange={handleAddChange}
              style={{ width: 100 }}
              required
            />
            <Input
              name="note"
              placeholder="Ghi chú"
              value={addForm.note}
              onChange={handleAddChange}
              style={{ width: 200 }}
            />
            <Button type="primary" htmlType="submit" loading={addLoading}>
              Thêm mới
            </Button>
          </form>
          {editForm && (
            <form onSubmit={handleEditSubmit} style={{ marginBottom: 24, display: 'flex', gap: 8, flexWrap: 'wrap', background: '#f6f6f6', padding: 12, borderRadius: 6 }}>
              <Input
                name="vaccineName"
                placeholder="Tên vắc xin"
                value={editForm.vaccineName}
                onChange={handleEditChange}
                style={{ width: 180 }}
                required
              />
              <Input
                name="vaccinationDate"
                placeholder="Ngày tiêm (YYYY-MM-DD)"
                value={editForm.vaccinationDate}
                onChange={handleEditChange}
                style={{ width: 150 }}
                required
              />
              <Input
                name="doseNumber"
                placeholder="Mũi số"
                value={editForm.doseNumber}
                onChange={handleEditChange}
                style={{ width: 100 }}
                required
              />
              <Input
                name="note"
                placeholder="Ghi chú"
                value={editForm.note}
                onChange={handleEditChange}
                style={{ width: 200 }}
              />
              <Button type="primary" htmlType="submit" loading={editLoading}>
                Lưu
              </Button>
              <Button type="default" onClick={() => setEditForm(null)}>
                Hủy
              </Button>
            </form>
          )}
          <Table
            columns={vaccColumns}
            dataSource={vaccinations}
            rowKey={(r, idx) => idx}
            loading={vaccLoading}
            pagination={false}
            locale={{ emptyText: "Không có dữ liệu tiêm chủng" }}
          />
          <Pagination
            style={{ marginTop: 16, textAlign: "right" }}
            current={vaccPage + 1}
            pageSize={vaccSize}
            total={vaccTotal}
            onChange={handleVaccPageChange}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
          />
        </Drawer>
      </div>
    );
}

export default ManageMedicalSupplyM;