// components/vaccination/AtSchool/VaccinationMonitoringModal.jsx
import React from "react";
import { Modal, Table, Spin, Tag, Typography, Tooltip } from "antd";
import dayjs from "dayjs";

function VaccinationMonitoringModal({ open, loading, data, onClose }) {
  const columns = [
    {
      title: "Thời gian",
      dataIndex: "monitoringTime",
      key: "monitoringTime",
      render: (value) => dayjs(value).format("HH:mm DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) =>
        record.hasSideEffects ? (
          <Tag color="red">Có phản ứng</Tag>
        ) : (
          <Tag color="green">Bình thường</Tag>
        ),
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Người theo dõi",
      dataIndex: "recordedByUserName",
      key: "recordedByUserName",
      render: (text, record) => (
        <Tooltip
          title={
            <>
              <div>Tạo: {dayjs(record.createdAt).format("HH:mm DD/MM/YYYY")}</div>
              <div>Cập nhật: {dayjs(record.updatedAt).format("HH:mm DD/MM/YYYY")}</div>
            </>
          }
        >
          <Typography.Text underline>{text}</Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Chi tiết",
      key: "details",
      render: (_, record) => {
        const temp = record.temperature
          ? `🌡 ${record.temperature}°C`
          : "Không đo";
        const sideEffect = record.hasSideEffects
          ? `⚠️ Có phản ứng: ${record.sideEffectsDescription || "Không rõ"}`
          : "✅ Không phản ứng phụ";
        const actions = record.actionsTaken
          ? `🛠 Đã xử lý: ${record.actionsTaken}`
          : null;

        return (
          <Typography.Text style={{ whiteSpace: "pre-line" }}>
            {temp}
            {"\n"}
            {sideEffect}
            {actions ? `\n${actions}` : ""}
          </Typography.Text>
        );
      },
    },
  ];

  return (
    <Modal
      open={open}
      title="Theo dõi sau tiêm"
      footer={null}
      onCancel={onClose}
      width={700}
    >
      <Spin spinning={loading}>
        <Table
          rowKey="monitoringId"
          dataSource={Array.isArray(data) ? data : data ? [data] : []}
          columns={columns}
          pagination={false}
        />
      </Spin>
    </Modal>
  );
}

export default VaccinationMonitoringModal;
