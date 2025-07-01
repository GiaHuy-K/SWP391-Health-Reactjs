import React, { useEffect, useState } from "react";
import {
  getMedicalSupplies,
  createMedicalSupply,
  softDeleteMedicalSupply,
  adjustMedicalSupplyStock,
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

  const handleSoftDelete = async (id) => {
    try {
      await softDeleteMedicalSupply(id);
      fetchSupply();
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
      fetchSupply();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdjustSubmit = async (supplyId, data) => {
    try {
      await adjustMedicalSupplyStock(supplyId, data);
      toast.success("Điều chỉnh tồn kho thành công");
      fetchSupply();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi điều chỉnh tồn kho");
    }
  };

  return (
    <>
      <MedicalSupplyTableTemplate
        data={medicalList}
        loading={loading}
        onDelete={handleSoftDelete}
        onCreateClick={() => setCreateModalOpen(true)}
        onReload={fetchSupply}
        permissions={permissions}
        onAdjust={handleAdjustSubmit}
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
    </>
  );
};

export default ManageMedicalSupplyM;
