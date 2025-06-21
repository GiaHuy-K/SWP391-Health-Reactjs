import React, { useEffect, useState } from "react";
import { Drawer, Button, Descriptions, Spin, message } from "antd";
import { getMedicalSupplyById } from "../../services/api.medicalSupply";
import MedicalSupplyTransaction from "./medicalSupplyTransaction";

const MedicalSupplyDrawer = ({ open, onClose, supplyId }) => {
  const [supply, setSupply] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionDrawerOpen, setTransactionDrawerOpen] = useState(false);

  useEffect(() => {
    if (!open || !supplyId) return;

    setLoading(true);
    getMedicalSupplyById(supplyId)
      .then((data) => setSupply(data))
      .catch(() => {
        message.error("Không lấy được thông tin vật tư");
        onClose?.();
      })
      .finally(() => setLoading(false));
  }, [supplyId, open]);

  return (
    <>
      <Drawer
        title="Chi tiết vật tư y tế"
        open={open}
        onClose={onClose}
        width={800}
      >
        {loading ? (
          <Spin />
        ) : (
          <>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Tên">{supply.name}</Descriptions.Item>
              <Descriptions.Item label="Loại">{supply.category}</Descriptions.Item>
              <Descriptions.Item label="Đơn vị">{supply.unit}</Descriptions.Item>
              <Descriptions.Item label="Tồn kho">{supply.currentStock}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <span style={{ color: supply.active ? "green" : "red" }}>
                  {supply.active ? "Còn hạn sử dụng" : "Hết hạn sử dụng"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo">{supply.createdByUserEmail}</Descriptions.Item>
              <Descriptions.Item label="Người cập nhật">{supply.updatedByUserEmail}</Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(supply.createdAt).toLocaleString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật gần nhất">
                {new Date(supply.lastUpdatedAt).toLocaleString("vi-VN")}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <Button type="primary" onClick={() => setTransactionDrawerOpen(true)}>
                Xem lịch sử giao dịch
              </Button>
            </div>
          </>
        )}
      </Drawer>

      <Drawer
        title="Lịch sử giao dịch"
        open={transactionDrawerOpen}
        onClose={() => setTransactionDrawerOpen(false)}
        width={700}
      >
        <MedicalSupplyTransaction supplyId={supplyId} />
      </Drawer>
    </>
  );
};

export default MedicalSupplyDrawer;
