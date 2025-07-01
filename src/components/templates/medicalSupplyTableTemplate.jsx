import React, { useState } from "react";
import { Table, Button, Tag, Space } from "antd";
import MedicalSupplyDrawer from "../medicalSupply/medicalSupplyDrawer";
import EditMedicalSupplyModal from "../medicalSupply/medicalSupplyEditModal";
import AdjustStockModal from "../medicalSupply/medical-adjustStockModal";

const MedicalSupplyTableTemplate = ({
  data,
  loading,
  onDelete,
  onCreateClick,
  onReload,
  permissions = {
    canView: true,
    canCreate: false,
    canDelete: false,
    canEdit: false,
    canAdjustStock: false,
  },
  onAdjust,
}) => {
  const [selectedId, setSelectedId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [editingSupply, setEditingSupply] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustingSupply, setAdjustingSupply] = useState(null);

  const handleView = (id) => {
    setSelectedId(id);
    setDrawerOpen(true);
  };

  const handleAdjustClick = (record) => {
    setAdjustingSupply(record);
    setAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (data) => {
    try {
      await onAdjust?.(adjustingSupply.supplyId, data);
      setAdjustModalOpen(false);
      setAdjustingSupply(null);
    } catch (error) {
      console.error("Lỗi điều chỉnh tồn kho:", error);
    }
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
      render: (status) => {
        let color = "default";
        switch (status.toLowerCase()) {
          case "sẵn có":
            color = "green";
            break;
          case "hết hàng":
            color = "orange";
            break;
          case "hết hạn":
            color = "volcano";
            break;
          case "không còn sử dụng":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  if (
    permissions.canEdit ||
    permissions.canAdjustStock ||
    permissions.canDelete
  ) {
    columns.push({
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          {permissions.canEdit && (
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setEditingSupply(record);
                setEditModalOpen(true);
              }}
            >
              Cập nhật
            </Button>
          )}
          {permissions.canAdjustStock && (
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleAdjustClick(record);
              }}
            >
              Điều chỉnh
            </Button>
          )}
          {permissions.canDelete && (
            <Button
              type="primary"
              size="small"
              danger
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(record.supplyId);
              }}
            >
              Ngưng sử dụng
            </Button>
          )}
        </Space>
      ),
    });
  }

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
        onRow={(record) => ({
          onClick: () => handleView(record.supplyId),
        })}
      />

      <MedicalSupplyDrawer
        supplyId={selectedId}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <EditMedicalSupplyModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        supply={editingSupply}
        onSuccess={() => {
          setEditModalOpen(false);
          setEditingSupply(null);
          onReload?.();
        }}
      />

      <AdjustStockModal
        open={adjustModalOpen}
        onClose={() => setAdjustModalOpen(false)}
        onSubmit={handleAdjustSubmit}
        supplyName={adjustingSupply?.name}
      />
    </div>
  );
};

export default MedicalSupplyTableTemplate;
