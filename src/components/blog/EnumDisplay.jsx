import React from "react";

export const CategoryTag = ({ category, showIcon = true }) => (
  <span style={{ color: category?.color || '#888', fontWeight: 500 }}>
    {showIcon && category?.icon && <span style={{ marginRight: 4 }}>{category.icon}</span>}
    {category?.displayName || category?.value || 'Danh mục'}
  </span>
);

export const StatusTag = ({ status, showIcon = true }) => (
  <span style={{ color: status?.color || '#888', fontWeight: 500 }}>
    {showIcon && status?.icon && <span style={{ marginRight: 4 }}>{status.icon}</span>}
    {status?.displayName || status?.value || 'Trạng thái'}
  </span>
); 