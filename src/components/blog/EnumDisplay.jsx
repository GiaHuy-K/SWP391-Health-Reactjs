import React from "react";

export const CategoryTag = ({ category, showIcon = true }) => {
  console.log("CategoryTag received:", category);
  
  // Xử lý trường hợp category là string đơn giản
  if (typeof category === 'string') {
    const categoryConfig = {
      'Sức khỏe tâm thần': { color: '#1890ff', icon: '🧠' },
      'Dinh dưỡng': { color: '#52c41a', icon: '🥗' },
      'Vận động': { color: '#faad14', icon: '🏃' },
      'Vệ sinh': { color: '#722ed1', icon: '🧼' },
      'Tiêm chủng': { color: '#eb2f96', icon: '💉' },
      'Sơ cứu': { color: '#f5222d', icon: '🚑' }
    };
    
    const config = categoryConfig[category] || { color: '#888', icon: '📁' };
    
    return (
      <span style={{ color: config.color, fontWeight: 500 }}>
        {showIcon && <span style={{ marginRight: 4 }}>{config.icon}</span>}
        {category}
      </span>
    );
  }
  
  // Xử lý trường hợp category là object
  return (
  <span style={{ color: category?.color || '#888', fontWeight: 500 }}>
    {showIcon && category?.icon && <span style={{ marginRight: 4 }}>{category.icon}</span>}
      {category?.displayName || category?.value || 'Chưa phân loại'}
    </span>
  );
};

export const StatusTag = ({ status, showIcon = true }) => {
  console.log("StatusTag received:", status);
  
  // Xử lý trường hợp status là string đơn giản
  if (typeof status === 'string') {
    const statusConfig = {
      'Công khai': { color: '#52c41a', icon: '✅' },
      'Riêng tư': { color: '#faad14', icon: '🔒' },
      'Đã xuất bản': { color: '#52c41a', icon: '✅' },
      'Bản nháp': { color: '#faad14', icon: '📝' },
      'PUBLIC': { color: '#52c41a', icon: '✅' },
      'PRIVATE': { color: '#faad14', icon: '🔒' },
      'DRAFT': { color: '#faad14', icon: '📝' }
    };
    
    const config = statusConfig[status] || { color: '#888', icon: '❓' };
    
    return (
      <span style={{ color: config.color, fontWeight: 500 }}>
        {showIcon && <span style={{ marginRight: 4 }}>{config.icon}</span>}
        {status}
  </span>
);
  }

  // Xử lý trường hợp status là object
  return (
  <span style={{ color: status?.color || '#888', fontWeight: 500 }}>
    {showIcon && status?.icon && <span style={{ marginRight: 4 }}>{status.icon}</span>}
    {status?.displayName || status?.value || 'Trạng thái'}
  </span>
); 
}; 