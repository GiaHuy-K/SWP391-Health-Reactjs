import React, { useState } from "react";
import { Table, Modal } from "antd";

function StudentVaccinationTableTemplate({ data, loading }) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState(null);

  const columns = [
    { title: "Tên học sinh", dataIndex: "studentFullName", key: "studentFullName" },
    { title: "Lớp", dataIndex: "studentClassName", key: "studentClassName" },
    { title: "Tên vắc xin", dataIndex: "vaccineName", key: "vaccineName" },
    { title: "Ngày tiêm", dataIndex: "vaccinationDate", key: "vaccinationDate" },
    { title: "Nơi tiêm", dataIndex: "provider", key: "provider" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
  ];

  const handleRowClick = (record) => {
    setSelectedVaccination(record);
    setDrawerVisible(true);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={record => record.studentVaccinationId || record.id}
        loading={loading}
        pagination={{ pageSize: 800 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" }
        })}
      />
      <Modal
        title="Chi tiết tiêm chủng"
        open={drawerVisible}  
        onCancel={() => setDrawerVisible(false)}
        onOk={() => setDrawerVisible(false)}
        width={800}
      >
        {selectedVaccination && (
          <div>
            <p><b>Tên học sinh:</b> {selectedVaccination.studentFullName}</p>
            <p><b>Lớp:</b> {selectedVaccination.studentClassName}</p>
            <p><b>Tên vắc xin:</b> {selectedVaccination.vaccineName}</p>
            <p><b>Ngày tiêm:</b> {selectedVaccination.vaccinationDate}</p>
            <p><b>Nơi tiêm:</b> {selectedVaccination.provider}</p>
            <p><b>Trạng thái:</b> {selectedVaccination.status}</p>
          </div>
        )}
      </Modal>
    </>
  );
}

export default StudentVaccinationTableTemplate; 