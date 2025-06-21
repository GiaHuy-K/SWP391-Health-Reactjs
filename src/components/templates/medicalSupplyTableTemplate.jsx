import React, { useState } from "react";
import { Table, Button, Tag, Modal } from "antd";
import MedicalSupplyDetailModal from "../medicalSupply/medical-supply-detail";
import MedicalSupplyTransaction from "../medicalSupply/medicalSupplyTransaction";

const MedicalSupplyTableTemplate = ({
  data,
  loading,
  onDelete,
  canDelete = false,
  canView = true,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  const handleViewDetail = (id) => {
    setSelectedId(id);
    setDetailModalOpen(true);
  };

  const handleViewTransaction = (id) => {
    setSelectedId(id);
    setTransactionModalOpen(true);
  };

  const columns = [
    {
      title: "Tên vật tư",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Loại",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Tồn kho",
      dataIndex: "currentStock",
      key: "currentStock",
    },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (value) =>
        value ? (
          <Tag color="green">Còn hạn sử dụng</Tag>
        ) : (
          <Tag color="red">Hết hạn sử dụng</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          {canView && (
            <>
              <Button
                type="link"
                onClick={() => handleViewDetail(record.supplyId)}
              >
                Xem chi tiết
              </Button>
              <Button
                type="link"
                onClick={() => handleViewTransaction(record.supplyId)}
              >
                Xem giao dịch
              </Button>
            </>
          )}
          {canDelete && (
            <Button
              type="link"
              danger
              onClick={() => onDelete && onDelete(record.supplyId)}
            >
              Xóa
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        rowKey="supplyId"
        columns={columns}
        dataSource={data}
        loading={loading}
      />

      {/* Modal chi tiết vật tư */}
      <MedicalSupplyDetailModal
        supplyId={selectedId}
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />

      {/* Modal lịch sử giao dịch */}
      <Modal
        title="Lịch sử giao dịch vật tư"
        open={transactionModalOpen}
        onCancel={() => setTransactionModalOpen(false)}
        footer={null}
        width={800}
      >
        <MedicalSupplyTransaction supplyId={selectedId} />
      </Modal>
    </>
  );
};

export default MedicalSupplyTableTemplate;
