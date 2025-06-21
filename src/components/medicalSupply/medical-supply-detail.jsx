import React, { useEffect, useState } from "react";
import { Modal, Descriptions, Spin, message } from "antd";
import { getMedicalSupplyById } from "../../services/api.medicalSupply";

const MedicalSupplyDetailModal = ({ supplyId, open, onClose }) => {
  const [supply, setSupply] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !supplyId) return;

    setLoading(true);
    getMedicalSupplyById(supplyId)
      .then((data) => setSupply(data))
      .catch(() => {
        message.error("Không lấy được thông tin vật tư");
        onClose?.(); // nếu lỗi thì tự đóng modal luôn
      })
      .finally(() => setLoading(false));
  }, [supplyId, open]);

  return (
    <Modal
      title="Chi tiết vật tư y tế"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      {loading ? (
        <Spin />
      ) : (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Tên vật tư">
            {supply.name}
          </Descriptions.Item>
          <Descriptions.Item label="Loại">{supply.category}</Descriptions.Item>
          <Descriptions.Item label="Đơn vị">{supply.unit}</Descriptions.Item>
          <Descriptions.Item label="Tồn kho">
            {supply.currentStock}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {supply.description}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <span style={{ color: supply.active ? "green" : "red" }}>
              {supply.active ? "Còn hạn sử dụng" : "Hết hạn sử dụng"}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Người tạo">
            {supply.createdByUserEmail}
          </Descriptions.Item>
          <Descriptions.Item label="Người cập nhật">
            {supply.updatedByUserEmail}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(supply.createdAt).toLocaleString("vi-VN")}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật gần nhất">
            {new Date(supply.lastUpdatedAt).toLocaleString("vi-VN")}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default MedicalSupplyDetailModal;
