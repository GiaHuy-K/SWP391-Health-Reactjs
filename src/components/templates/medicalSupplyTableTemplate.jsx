import React, { useState } from "react";
import { Table, Button, Tag, Space, Popconfirm } from "antd";
import MedicalSupplyDrawer from "../medicalSupply/medicalSupplyDrawer";
import EditMedicalSupplyModal from "../medicalSupply/medicalSupplyEditModal";
import AdjustStockModal from "../medicalSupply/medical-AdjustStockModal";

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
  pagination = {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10"],
    onChange: () => {},
  },
  onStatusFilterChange,
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
      filters: [
        { text: "Sẵn có", value: "SẴN CÓ" },
        { text: "Hết hàng", value: "HẾT HÀNG" },
        { text: "Hết hạn", value: "HẾT HẠN" },
        { text: "Đã loại bỏ ra khỏi kho", value: "Đã loại bỏ ra khỏi kho" },
      ],
      filterMultiple: false,
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
          case "đã loại bỏ ra khỏi kho":
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
            <Popconfirm
              title="Xác nhận ngưng sử dụng?"
              description="Bạn có chắc chắn muốn ngưng sử dụng vật tư này không?"
              okText="Đồng ý"
              cancelText="Huỷ"
              onConfirm={() => onDelete?.(record.supplyId)}
              onCancel={(e) => e.stopPropagation()}
            >
              <Button
                type="primary"
                size="small"
                danger
                onClick={(e) => e.stopPropagation()}
              >
                Ngưng sử dụng
              </Button>
            </Popconfirm>
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
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: pagination.showSizeChanger,
          pageSizeOptions: pagination.pageSizeOptions,
        }}
        onRow={(record) => ({
          onClick: () => handleView(record.supplyId),
        })}
        onChange={(paginationInfo, filters) => {
          const statusValue = filters.status?.[0] || null;
          onStatusFilterChange?.(statusValue);
          pagination.onChange?.(
            paginationInfo.current,
            paginationInfo.pageSize
          );
        }}
      />

      {/* Drawer chi tiết */}
      <MedicalSupplyDrawer
        supplyId={selectedId}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Modal chỉnh sửa */}
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

      {/* Modal điều chỉnh tồn kho */}
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
