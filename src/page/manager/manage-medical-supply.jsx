import React, { useEffect, useState } from "react";
import {
  getMedicalSupplies,
  hardDeleteMedicalSupply,
  createMedicalSupply,
} from "../../services/api.medicalSupply";
import MedicalSupplyTableTemplate from "../../components/templates/medicalSupplyTableTemplate";
import { toast } from "react-toastify";
import { Modal, Form, Input } from "antd";

const ManageMedicalSupplyM = () => {
  const [medicalList, setMedicalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm();

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
      console.log(response);
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
