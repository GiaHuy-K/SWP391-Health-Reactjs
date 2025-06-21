import React, { useState } from "react";
import { Table, Button, Tag } from "antd";
import MedicalSupplyDrawer from "../medicalSupply/medicalSupplyDrawer";

const MedicalSupplyTableTemplate = ({
  data,
  loading,
  onDelete,
  canDelete = false,
  canView = true,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleView = (id) => {
    setSelectedId(id);
    setDrawerOpen(true);
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
            <Button type="link" onClick={() => handleView(record.supplyId)}>
              Xem
            </Button>
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

      <MedicalSupplyDrawer
        supplyId={selectedId}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default MedicalSupplyTableTemplate;
