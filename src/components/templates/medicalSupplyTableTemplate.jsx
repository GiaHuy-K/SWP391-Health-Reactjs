import React, { useState } from "react";
import { Table, Button, Tag, Space } from "antd";
import MedicalSupplyDrawer from "../medicalSupply/medicalSupplyDrawer";

const MedicalSupplyTableTemplate = ({
  data,
  loading,
  onDelete,
  onCreateClick,
  permissions = {
    canView: true,
    canCreate: false,
    canDelete: false,
    canEdit: false,
    canAdjustStock: false,
  },
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
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Sẵn có" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          {permissions.canView && (
            <Button type="link" onClick={() => handleView(record.supplyId)}>
              Xem
            </Button>
          )}
          {permissions.canEdit && (
            <Button
              type="primary"
              size="small"
              onClick={() => console.log("Sửa", record.supplyId)}
            >
              Sửa
            </Button>
          )}
          {permissions.canAdjustStock && (
            <Button
              type="primary"
              size="small"
              onClick={() => console.log("Điều chỉnh", record.supplyId)}
            >
              Điều chỉnh
            </Button>
          )}
          {permissions.canDelete && (
            <Button
              type="primary"
              size="small"
              danger
              onClick={() => onDelete?.(record.supplyId)}
            >
              Xóa
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {permissions.canCreate && (
        <Button
          type="primary"
          style={{ marginBottom: 16 }}
          onClick={onCreateClick}
        >
          Tạo mới vật tư
        </Button>
      )}

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
    </div>
  );
};

export default MedicalSupplyTableTemplate;
