import React, { useEffect, useState } from "react";
import {
  getMedicalSupplies,
  createMedicalSupply,
  softDeleteMedicalSupply,
  adjustMedicalSupplyStock,
} from "../../services/api.medicalSupply";
import MedicalSupplyTableTemplate from "../../components/templates/medicalSupplyTableTemplate";
import { toast } from "react-toastify";
import { Input, Select, Row, Col } from "antd";

import { Form, Modal } from "antd";
import { Button } from "antd";
const ManageMedicalSupplyM = () => {
  const [medicalList, setMedicalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [supplies, setSupplies] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const permissions = {
    canView: true,
    canCreate: true,
    canDelete: true,
    canEdit: true,
    canAdjustStock: true,
  };
  const [filters, setFilters] = useState({
  status: null,
});

const fetchSupplies = async () => {
  setLoading(true);
  try {
    const res = await getMedicalSupplies({
      page,
      size: pageSize,
      sort: "name,ASC",
      ...(filters.status ? { status: filters.status } : {}),
    });
    setSupplies(res.content || []);
    setTotalItems(res.totalElements || 0);
  } catch (err) {
    console.error("Lỗi khi tải vật tư:", err);
  } finally {
    setLoading(false);
  }
};


const handleStatusFilterChange = (statusValue) => {
  setPage(0); // reset về trang đầu
  setFilters((prev) => ({
    ...prev,
    status: statusValue,
  }));
};

  useEffect(() => {
    fetchSupplies();
  }, [filters, page, pageSize]);

  const handleSoftDelete = async (id) => {
    try {
      await softDeleteMedicalSupply(id);
      fetchSupplies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createMedicalSupply(values);
      toast.success("Tạo mới thành công");
      setCreateModalOpen(false);
      form.resetFields();
      fetchSupplies();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdjustSubmit = async (supplyId, data) => {
    try {
      await adjustMedicalSupplyStock(supplyId, data);
      toast.success("Điều chỉnh tồn kho thành công");
      fetchSupplies();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi điều chỉnh tồn kho");
    }
  };

  return (
    <div>

      <MedicalSupplyTableTemplate
      data={supplies}
      loading={loading}
      onDelete={handleSoftDelete}
      onCreateClick={() => setCreateModalOpen(true)}
      onReload={fetchSupplies}
      permissions={permissions}
      onAdjust={handleAdjustSubmit}
      onStatusFilterChange={handleStatusFilterChange} 
      pagination={{
        current: page + 1,
        total: totalItems,
        pageSize: pageSize,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10"],
        onChange: (newPage, newSize) => {
          setPage(newPage - 1);
          setPageSize(newSize);
        },
      }}
    />
      {/* Modal tạo mới vật tư y tế */}
      <Modal
        title="Tạo mới vật tư y tế"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={handleCreate}
        okText="Tạo"
        cancelText="Hủy"
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên vật tư"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Loại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="unit" label="Đơn vị" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="initialStock"
            label="Tồn kho ban đầu"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>

  );
};

export default ManageMedicalSupplyM;
