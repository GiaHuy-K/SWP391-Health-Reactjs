import React, { useState } from "react";
import { Modal, Descriptions, Button, Space, message, Tabs } from "antd";
import VaccinationCampaignList from "../../components/vaccination/VaccinationCampaignList";
import VaccinationTest from "../../components/vaccination/VaccinationTest";
import VaccinationCampaignCreateForm from "../../components/vaccination/VaccinationCampaignCreateForm";

const ManageVaccinationCampaigns = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Handle view campaign detail
  const handleViewDetail = (campaign) => {
    setSelectedCampaign(campaign);
    setDetailModalVisible(true);
  };

  // Handle create new campaign
  const handleCreateNew = () => {
    setCreateModalOpen(true);
  };

  // Handle after create success
  const handleCreateSuccess = () => {
    setReloadKey(prev => prev + 1);
    message.success("Tạo chiến dịch thành công!");
  };

  // Handle edit campaign
  const handleEdit = (campaign) => {
    message.info("Tính năng chỉnh sửa chiến dịch sẽ được implement sau");
  };

  // Handle start campaign
  const handleStartCampaign = (campaign) => {
    message.info("Tính năng bắt đầu chiến dịch sẽ được implement sau");
  };

  // Handle complete campaign
  const handleCompleteCampaign = (campaign) => {
    message.info("Tính năng hoàn thành chiến dịch sẽ được implement sau");
  };

  const items = [
    {
      key: "list",
      label: "Danh sách chiến dịch",
      children: (
        <VaccinationCampaignList
          key={reloadKey}
          onViewDetail={handleViewDetail}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
        />
      ),
    },
    {
      key: "test",
      label: "Test API",
      children: <VaccinationTest />,
    },
  ];

  return (
    <div>
      <Tabs items={items} />

      {/* Modal tạo mới chiến dịch */}
      <VaccinationCampaignCreateForm
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Campaign Detail Modal */}
      <Modal
        title="Chi tiết chiến dịch tiêm chủng"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedCampaign?.status === "Đang chuẩn bị" && (
            <Button
              key="start"
              type="primary"
              onClick={() => handleStartCampaign(selectedCampaign)}
            >
              Bắt đầu chiến dịch
            </Button>
          ),
          selectedCampaign?.status === "Đang diễn ra" && (
            <Button
              key="complete"
              type="primary"
              onClick={() => handleCompleteCampaign(selectedCampaign)}
            >
              Hoàn thành chiến dịch
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedCampaign && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Tên chiến dịch" span={2}>
              {selectedCampaign.campaignName}
            </Descriptions.Item>
            <Descriptions.Item label="Tên vaccine">
              {selectedCampaign.vaccineName}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <span style={{ 
                color: selectedCampaign.status === "Đã hoàn thành" ? "green" : 
                       selectedCampaign.status === "Đang diễn ra" ? "blue" :
                       selectedCampaign.status === "Đang chuẩn bị" ? "orange" : "gray"
              }}>
                {selectedCampaign.status}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Nhóm lớp">
              {selectedCampaign.classGroup}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày bắt đầu">
              {new Date(selectedCampaign.startDate).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
            {selectedCampaign.endDate && (
              <Descriptions.Item label="Ngày kết thúc">
                {new Date(selectedCampaign.endDate).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Người tổ chức">
              {selectedCampaign.organizedByUserName}
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng học sinh">
              {selectedCampaign.totalStudents || 0} học sinh
            </Descriptions.Item>
            {selectedCampaign.description && (
              <Descriptions.Item label="Mô tả" span={2}>
                {selectedCampaign.description}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Ngày tạo">
              {new Date(selectedCampaign.createdAt).toLocaleString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật gần nhất">
              {new Date(selectedCampaign.lastUpdatedAt).toLocaleString("vi-VN")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ManageVaccinationCampaigns; 