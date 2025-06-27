import React, { useEffect, useState } from "react";
import {
  getMedicalSupplies,
  hardDeleteMedicalSupply,
  createMedicalSupply,
} from "../../services/api.medicalSupply";
import MedicalSupplyTableTemplate from "../../components/templates/medicalSupplyTableTemplate";
import { toast } from "react-toastify";
<<<<<<< HEAD
import { Modal, Form, Input } from "antd";

const ManageMedicalSupplyM = () => {
  const [medicalList, setMedicalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
=======
import { getStudent } from "../../services/api.student";
import { getStudentVaccinations, addStudentVaccination, updateStudentVaccination, deleteStudentVaccination, updateVaccinationStatus, getVaccinationDetail } from "../../services/api.student";
import { Table, Input, Button, Drawer, Pagination, message, Modal, Descriptions } from "antd";

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
    const [detailModal, setDetailModal] = useState({ open: false, data: null, loading: false });
>>>>>>> b22523da30c4303a3a8d45e3e038801a19a2e448

  const permissions = {
    canView: true,
    canCreate: true,
    canDelete: true,
    canEdit: true,
    canAdjustStock: true,
  };

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
  }, []);

  const handleDelete = async (id) => {
    await hardDeleteMedicalSupply(id);
    fetchSupply();
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createMedicalSupply(values);
      toast.success("Tạo mới thành công");
      setCreateModalOpen(false);
      form.resetFields();
      fetchSupply();
<<<<<<< HEAD
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <MedicalSupplyTableTemplate
        data={medicalList}
        loading={loading}
        onDelete={handleDelete}
        onCreateClick={() => setCreateModalOpen(true)}
        permissions={permissions}
      />
=======
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

    const handleShowDetail = async (record) => {
      setDetailModal({ open: true, data: null, loading: true });
      try {
        const data = await getVaccinationDetail(record.id);
        setDetailModal({ open: true, data, loading: false });
      } catch (err) {
        setDetailModal({ open: false, data: null, loading: false });
      }
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
            <Button onClick={() => handleShowDetail(record)} size="small" style={{ marginRight: 8 }}>Chi tiết</Button>
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
        <Modal
          open={detailModal.open}
          onCancel={() => setDetailModal({ open: false, data: null, loading: false })}
          footer={null}
          title="Chi tiết tiêm chủng"
          width={600}
          loading={detailModal.loading ? 1 : 0}
        >
          {detailModal.data && (
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Tên vắc xin">{detailModal.data.vaccineName}</Descriptions.Item>
              <Descriptions.Item label="Ngày tiêm">{detailModal.data.vaccinationDate}</Descriptions.Item>
              <Descriptions.Item label="Mũi số">{detailModal.data.doseNumber}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú">{detailModal.data.note}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{detailModal.data.status}</Descriptions.Item>
              <Descriptions.Item label="Người duyệt">{detailModal.data.approvedByUserFullName || '-'}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú duyệt">{detailModal.data.approverNotes || '-'}</Descriptions.Item>
              <Descriptions.Item label="Ngày duyệt">{detailModal.data.approvedAt || '-'}</Descriptions.Item>
              <Descriptions.Item label="File chứng nhận">
                {detailModal.data.hasProofFile ? (
                  <a href={detailModal.data.proofFileAccessUrl} target="_blank" rel="noopener noreferrer">Tải file</a>
                ) : 'Không có'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    );
}
>>>>>>> b22523da30c4303a3a8d45e3e038801a19a2e448

      <Modal
        title="Tạo mới vật tư y tế"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={handleCreate}
        okText="Tạo"
        cancelText="Hủy"
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên vật tư" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Loại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="unit" label="Đơn vị" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="initialStock" label="Tồn kho ban đầu" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ManageMedicalSupplyM;
