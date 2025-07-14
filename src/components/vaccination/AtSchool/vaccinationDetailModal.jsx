import React from "react";
import { Modal, Descriptions, Spin, Tag } from "antd";

function VaccinationDetailModal({ open, loading, detail, onClose }) {
  const renderStatusTag = (status) => {
    const normalized = status?.toLowerCase();
    if (["đã lên lịch", "scheduled"].includes(normalized))
      return <Tag color="blue">Đã lên lịch</Tag>;
    if (["đã hoàn thành", "completed"].includes(normalized))
      return <Tag color="green">Đã hoàn thành</Tag>;
    if (["vắng mặt", "absent"].includes(normalized))
      return <Tag color="red">Vắng mặt</Tag>;
    if (["từ chối", "declined"].includes(normalized))
      return <Tag color="orange">Từ chối</Tag>;
    return <Tag>{status}</Tag>;
  };

  return (
    <Modal
      open={open}
      title="Chi tiết bản ghi tiêm chủng"
      footer={null}
      onCancel={onClose}
    >
      <Spin spinning={loading}>
        {detail ? (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Học sinh">
              {detail.studentName}
            </Descriptions.Item>
            <Descriptions.Item label="Lớp">
              {detail.studentClass}
            </Descriptions.Item>
            <Descriptions.Item label="Chiến dịch">
              {detail.campaignName}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tiêm">
              {detail.vaccinationDate}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {renderStatusTag(detail.status)}
            </Descriptions.Item>
            <Descriptions.Item label="Người tiêm">
              {detail.administeredByUserName}
            </Descriptions.Item>
            <Descriptions.Item label="Ghi chú">
              {detail.notes || "Không có"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Không tìm thấy bản ghi.</p>
        )}
      </Spin>
    </Modal>
  );
}

export default VaccinationDetailModal;
