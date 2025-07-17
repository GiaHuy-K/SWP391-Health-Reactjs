import React from 'react';
import dayjs from 'dayjs';

/**
 * Component hiển thị thông tin học sinh một cách nhất quán
 * @param {object} student - Thông tin học sinh
 * @param {string} type - Loại thông tin cần hiển thị ('vaccination' | 'diagnosis')
 * @param {boolean} showBirthDate - Có hiển thị ngày sinh không
 */
const StudentInfoDisplay = ({ student, type = 'vaccination', showBirthDate = true }) => {
  if (!student) return null;

  const getTypeInfo = () => {
    switch (type) {
      case 'vaccination':
        return {
          title: 'Ngày tiêm chủng',
          icon: '💉',
          description: 'Có thể chọn từ ngày sinh đến ngày hiện tại'
        };
      case 'diagnosis':
        return {
          title: 'Ngày chẩn đoán',
          icon: '🏥',
          description: 'Có thể chọn từ ngày sinh đến ngày hiện tại (không bắt buộc)'
        };
      default:
        return {
          title: 'Ngày',
          icon: '📅',
          description: 'Có thể chọn từ ngày sinh đến ngày hiện tại'
        };
    }
  };

  const typeInfo = getTypeInfo();
  const birthDate = student.dateOfBirth ? dayjs(student.dateOfBirth).format('DD/MM/YYYY') : 'Chưa có';

  return (
    <div style={{ 
      backgroundColor: '#f6f8fa', 
      padding: '12px', 
      borderRadius: '6px', 
      marginBottom: '12px',
      border: '1px solid #e1e4e8'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '16px', marginRight: '8px' }}>{typeInfo.icon}</span>
        <strong style={{ fontSize: '14px' }}>{typeInfo.title}</strong>
      </div>
      
      <div style={{ fontSize: '12px', color: '#586069', lineHeight: '1.4' }}>
        <div><strong>Học sinh:</strong> {student.fullName}</div>
        {showBirthDate && (
          <div><strong>Ngày sinh:</strong> {birthDate}</div>
        )}
        <div style={{ marginTop: '4px', color: '#1890ff' }}>
          {typeInfo.description}
        </div>
      </div>
    </div>
  );
};

export default StudentInfoDisplay; 