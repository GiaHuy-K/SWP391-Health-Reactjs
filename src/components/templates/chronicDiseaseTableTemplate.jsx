import React, { useState } from "react";
import { Table, Modal, Tag } from "antd";

function ChronicDiseaseTableTemplate({ data, loading, renderAction }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChronic, setSelectedChronic] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
      case "Chấp nhận":
        return "green";
      case "REJECTED":
      case "Từ chối":
        return "red";
      case "PENDING":
      case "Chờ xử lý":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
      case "Chấp nhận":
        return "Đã duyệt";
      case "REJECTED":
      case "Từ chối":
        return "Từ chối";
      case "PENDING":
      case "Chờ xử lý":
        return "Chờ duyệt";
      default:
        return status;
    }
  };

  const columns = [
    { 
      title: "Tên học sinh", 
      dataIndex: "studentFullName", 
      key: "studentFullName",
      width: 150
    },
    { 
      title: "Lớp", 
      dataIndex: "studentClassName", 
      key: "studentClassName",
      width: 100
    },
    { 
      title: "Tên bệnh", 
      dataIndex: "diseaseName", 
      key: "diseaseName",
      width: 150
    },
    { 
      title: "Ngày chẩn đoán", 
      dataIndex: "diagnosedDate", 
      key: "diagnosedDate",
      width: 120,
      render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : '-'
    },
    { 
      title: "Bác sĩ chẩn đoán", 
      dataIndex: "diagnosingDoctor", 
      key: "diagnosingDoctor",
      width: 150
    },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      key: "status",
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      )
    },
  ];
  if (typeof renderAction === 'function') {
    columns.push({
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_, record) => renderAction(record)
    });
  }

  const handleRowClick = (record) => {
    setSelectedChronic(record);
    setModalVisible(true);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={record => record.id}
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} bản ghi`
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" }
        })}
        scroll={{ x: 800 }}
      />
      
      <Modal
        title="Chi tiết bệnh mãn tính"
        open={modalVisible}  
        onCancel={() => setModalVisible(false)}
        onOk={() => setModalVisible(false)}
        width={700}
        footer={[
          <button 
            key="close" 
            onClick={() => setModalVisible(false)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Đóng
          </button>
        ]}
      >
        {selectedChronic && (
          <div style={{ lineHeight: '2' }}>
            <div style={{ marginBottom: '16px' }}>
              <strong>Thông tin học sinh:</strong>
              <p><b>Tên học sinh:</b> {selectedChronic.studentFullName}</p>
              <p><b>Lớp:</b> {selectedChronic.studentClassName}</p>
              <p><b>Mã học sinh:</b> {selectedChronic.studentId}</p>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <strong>Thông tin bệnh:</strong>
              <p><b>Tên bệnh:</b> {selectedChronic.diseaseName}</p>
              <p><b>Ngày chẩn đoán:</b> {selectedChronic.diagnosedDate ? new Date(selectedChronic.diagnosedDate).toLocaleDateString('vi-VN') : 'Chưa có'}</p>
              <p><b>Bác sĩ chẩn đoán:</b> {selectedChronic.diagnosingDoctor || 'Chưa có'}</p>
              <p><b>Trạng thái:</b> 
                <Tag color={getStatusColor(selectedChronic.status)} style={{ marginLeft: '8px' }}>
                  {getStatusText(selectedChronic.status)}
                </Tag>
              </p>
            </div>
            
            {selectedChronic.notes && (
              <div style={{ marginBottom: '16px' }}>
                <strong>Ghi chú:</strong>
                <p style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '12px', 
                  borderRadius: '6px',
                  marginTop: '8px'
                }}>
                  {selectedChronic.notes}
                </p>
              </div>
            )}
            
            {selectedChronic.approverNotes && (
              <div>
                <strong>Ghi chú duyệt:</strong>
                <p style={{ 
                  backgroundColor: '#fff7e6', 
                  padding: '12px', 
                  borderRadius: '6px',
                  marginTop: '8px',
                  border: '1px solid #ffd591'
                }}>
                  {selectedChronic.approverNotes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}

export default ChronicDiseaseTableTemplate; 