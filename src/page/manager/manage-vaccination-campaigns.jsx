import React, { useState } from "react";
import { Modal, Descriptions, Button, Space, message, Tabs } from "antd";
import VaccinationCampaignList from "../../components/vaccination/VaccinationCampaignList";
import VaccinationCampaignCreateForm from "../../components/vaccination/VaccinationCampaignCreateForm";
import { startVaccinationCampaign, completeVaccinationCampaign, prepareVaccinationCampaign } from "../../services/api.vaccination";
import dayjs from "dayjs";

const ManageVaccinationCampaigns = () => {
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  // Đợi tiến trình chuyển đổi trạng thái
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
    setEditCampaign(campaign);
    setEditModalOpen(true);
  };

  // Handle update success
  const handleUpdateSuccess = () => {
    setReloadKey(prev => prev + 1);
    message.success("Cập nhật chiến dịch thành công!");
  };

  // Handle start campaign
  const handleStartCampaign = async (campaign) => {
    try {
      await startVaccinationCampaign(campaign.campaignId);
      message.success("Đã chuyển sang trạng thái Đang diễn ra!");
      setDetailModalVisible(false); // Đóng modal chi tiết
      setReloadKey(prev => prev + 1); // Reload lại danh sách
    } catch (err) {
      message.error(err?.response?.data?.message || "Chuyển trạng thái thất bại!");
    }
  };

  // Handle complete campaign
  const handleCompleteCampaign = async (campaign) => {
    try {
      await completeVaccinationCampaign(campaign.campaignId);
      message.success("Chiến dịch đã được hoàn thành!");
      setDetailModalVisible(false);
      setReloadKey(prev => prev + 1);
    } catch (err) {
      message.error(err?.response?.data?.message || "Hoàn thành chiến dịch thất bại!");
    }
  };

  // Handle chuyển sang Đang chuẩn bị
  const handlePrepareCampaign = async (campaign) => {
    try {
      await prepareVaccinationCampaign(campaign.campaignId);
      message.success("Đã chuyển sang trạng thái Đang chuẩn bị!");
      setDetailModalVisible(false);
      setReloadKey(prev => prev + 1);
    } catch (err) {
      message.error(err?.response?.data?.message || "Chuyển trạng thái thất bại!");
    }
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

      {/* Modal chỉnh sửa chiến dịch */}
      <VaccinationCampaignCreateForm
        open={editModalOpen}
        onClose={() => { setEditModalOpen(false); setEditCampaign(null); }}
        isEdit={true}
        initialValues={editCampaign}
        onUpdate={handleUpdateSuccess}
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
          selectedCampaign?.status === "Đã lên lịch" && (
            <Button
              key="prepare"
              type="primary"
              onClick={() => handlePrepareCampaign(selectedCampaign)}
            >
              Chuyển sang Đang chuẩn bị
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
            <Descriptions.Item label="Mô tả" span={2}>
              {selectedCampaign.description || "Không có mô tả"}
            </Descriptions.Item>
            <Descriptions.Item label="Tên vaccine">
              {selectedCampaign.vaccineName}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <span style={{ 
                color: selectedCampaign.status === "Đã hoàn thành" ? "green" : 
                       selectedCampaign.status === "Đang diễn ra" ? "blue" :
                       selectedCampaign.status === "Đang chuẩn bị" ? "orange" :
                       selectedCampaign.status === "Đã lên lịch" ? "blue" : "gray"
              }}>
                {selectedCampaign.status}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Khối lớp">
              {selectedCampaign.targetClassGroup || "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tiêm chủng">
              {selectedCampaign.vaccinationDate ? dayjs(selectedCampaign.vaccinationDate).format("DD/MM/YYYY") : "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Hạn chót gửi phiếu đồng ý">
              {selectedCampaign.consentDeadline ? dayjs(selectedCampaign.consentDeadline).format("DD/MM/YYYY") : "Hệ thống tự động tạo"}
            </Descriptions.Item>
            <Descriptions.Item label="Người tổ chức">
              {selectedCampaign.organizedByUserName || "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Nhà cung cấp y tế">
              {selectedCampaign.healthcareProviderName || "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Liên hệ nhà cung cấp">
              {selectedCampaign.healthcareProviderContact || "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Số lượng học sinh">
              {selectedCampaign.totalStudents || 0} học sinh
            </Descriptions.Item>
            <Descriptions.Item label="Đã đồng ý">
              {selectedCampaign.approvedConsents || 0} học sinh
            </Descriptions.Item>
            <Descriptions.Item label="Từ chối">
              {selectedCampaign.declinedConsents || 0} học sinh
            </Descriptions.Item>
            <Descriptions.Item label="Chưa phản hồi">
              {(selectedCampaign.totalStudents || 0) - (selectedCampaign.approvedConsents || 0) - (selectedCampaign.declinedConsents || 0)} học sinh
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {selectedCampaign.createdAt ? dayjs(selectedCampaign.createdAt).format("DD/MM/YYYY HH:mm") : "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật gần nhất">
              {selectedCampaign.updatedAt ? dayjs(selectedCampaign.updatedAt).format("DD/MM/YYYY HH:mm") : "Chưa có"}
            </Descriptions.Item>
            {selectedCampaign.notes && (
              <Descriptions.Item label="Ghi chú" span={2}>
                {selectedCampaign.notes}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ManageVaccinationCampaigns; 