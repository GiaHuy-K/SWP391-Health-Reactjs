import React, { useState, useEffect } from "react";
import { Card, Button, Space, Typography, Alert, Spin } from "antd";
import { getVaccinationCampaigns } from "../../services/api.vaccination";

const { Title, Text } = Typography;

const VaccinationTest = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getVaccinationCampaigns({
        page: 0,
        size: 5,
        sort: "createdAt,ASC"
      });
      setData(result);
      console.log("API Response:", result);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto test khi component mount
    testAPI();
  }, []);

  return (
    <Card title="Test Vaccination API" style={{ margin: 16 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button 
          type="primary" 
          onClick={testAPI} 
          loading={loading}
        >
          Test API
        </Button>

        {loading && (
          <div style={{ textAlign: "center", padding: 20 }}>
            <Spin size="large" />
            <div style={{ marginTop: 10 }}>Đang tải dữ liệu...</div>
          </div>
        )}

        {error && (
          <Alert
            message="Lỗi API"
            description={error}
            type="error"
            showIcon
          />
        )}

        {data && !loading && (
          <Card size="small" title="Kết quả API">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>Total Elements: {data.totalElements}</Text>
              <Text strong>Total Pages: {data.totalPages}</Text>
              <Text strong>Current Page: {data.number + 1}</Text>
              <Text strong>Page Size: {data.size}</Text>
              
              {data.content && data.content.length > 0 ? (
                <div>
                  <Text strong>Campaigns ({data.content.length}):</Text>
                  {data.content.map((campaign, index) => (
                    <Card 
                      key={campaign.campaignId || index} 
                      size="small" 
                      style={{ marginTop: 8 }}
                    >
                      <Text strong>{campaign.campaignName}</Text>
                      <br />
                      <Text type="secondary">Vaccine: {campaign.vaccineName}</Text>
                      <br />
                      <Text type="secondary">Status: {campaign.status}</Text>
                      <br />
                      <Text type="secondary">Class Group: {campaign.classGroup}</Text>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert
                  message="Không có dữ liệu"
                  description="Không tìm thấy chiến dịch tiêm chủng nào"
                  type="info"
                  showIcon
                />
              )}
            </Space>
          </Card>
        )}
      </Space>
    </Card>
  );
};

export default VaccinationTest; 