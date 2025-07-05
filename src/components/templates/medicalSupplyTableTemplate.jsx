import React, { useState } from "react";
import { Table, Button, Tag, Space, Popconfirm } from "antd";
import MedicalSupplyDrawer from "../medicalSupply/medicalSupplyDrawer";
import EditMedicalSupplyModal from "../medicalSupply/medicalSupplyEditModal";
import AdjustStockModal from "../medicalSupply/medical-adjustStockModal";

const MedicalSupplyTableTemplate = ({
  data,
  loading,
  onDelete,
  onCreateClick,
  onReload, 
  // Permissions lúc đầu luôn là view true, còn lại là false
  // nếu có quyền thì sẽ hiện nút tương ứng
  permissions = {
    canView: true,
    canCreate: false,
    canDelete: false,
    canEdit: false,
    canAdjustStock: false,
  },
  onAdjust,
  pagination = {
    showSizeChanger: true,
    pageSizeOptions: ["5", "10"],
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
        { text: "Không còn sử dụng", value: "KHÔNG CÒN SỬ DỤNG" },
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
          showSizeChanger: true,
          pageSizeOptions: ["5", "10"],
          defaultPageSize: 10,
          ...pagination,
        }}
        onRow={(record) => ({
          onClick: () => handleView(record.supplyId),
        })}
        onChange={(pagination, filters) => {
          const statusValue = filters.status?.[0] || null;
          onStatusFilterChange?.(statusValue); //  Gửi sự kiện lên để lọc
          pagination.onChange?.(pagination.current, pagination.pageSize); // giữ phân trang nếu có custom sau này 
        }}
      />
      {/* Drawer coi chi tiết vật tư y tế */}
      <MedicalSupplyDrawer
        supplyId={selectedId}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      {/* Modal chỉnh sửa vật tư y tế */}
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
