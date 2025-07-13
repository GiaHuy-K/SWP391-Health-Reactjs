import React, { useEffect, useState } from "react";
import { Modal, Descriptions, List, Divider, Spin, Table } from "antd";
import dayjs from "dayjs";
import { getHealthIncidentById } from "../../services/api.healthIncident"; // giả sử có API này

const HealthIncidentDetailModal = ({ open, onClose, incidentId }) => {
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && incidentId) {
      setLoading(true);
      getHealthIncidentById(incidentId)
        .then((res) => setIncident(res))
        .catch((err) => console.error("Lỗi lấy chi tiết:", err))
        .finally(() => setLoading(false));
    }
  }, [open, incidentId]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Chi tiết sự cố sức khỏe"
      destroyOnHidden
    >
      {loading || !incident ? (
        <Spin />
      ) : (
        <>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Học sinh">
              {incident.studentName} ({incident.studentClass})
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian sự cố">
              {dayjs(incident.incidentDateTime).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Loại sự cố">
              {incident.incidentType}
            </Descriptions.Item>
            <Descriptions.Item label="Mô tả">
              {incident.description}
            </Descriptions.Item>
            <Descriptions.Item label="Hành động xử lý">
              {incident.actionTaken}
            </Descriptions.Item>
            <Descriptions.Item label="Địa điểm">
              {incident.location}
            </Descriptions.Item>
            <Descriptions.Item label="Người ghi nhận">
              {incident.recordedByUserName}
            </Descriptions.Item>
          </Descriptions>

          {incident.supplyUsages?.length > 0 && (
            <>
              <Divider>Vật tư y tế đã sử dụng</Divider>
              <Table
                columns={[
                  {
                    title: "Tên vật tư",
                    dataIndex: "supplyName",
                    key: "supplyName",
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "quantityUsed",
                    key: "quantityUsed",
                  },
                  { title: "Đơn vị", dataIndex: "unit", key: "unit" },
                  { title: "Ghi chú", dataIndex: "note", key: "note" },
                ]}
                dataSource={incident.supplyUsages.map((item, i) => ({
                  key: i,
                  ...item,
                }))}
                pagination={false}
                size="small"
                bordered
              />
            </>
          )}
        </>
      )}
    </Modal>
  );
};

export default HealthIncidentDetailModal;
