import React, { useEffect, useState } from "react";
import { Card, List, Tag } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { getMedicalSupplies } from "../../services/api.medicalSupply";

const DashboardLowStockCard = () => {
  const [supplies, setSupplies] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMedicalSupplies();
        console.log(data);
        const low = data.content.filter(item => item.currentStock < 10 && item.currentStock > 0); // chỉnh ngưỡng tùy ý
        setSupplies(low);
      } catch {
        setSupplies([]);
      }
    };
    fetch();
  }, []);

  return (
    <Card
      title="Vật tư sắp hết hàng"
      extra={<ExclamationCircleOutlined style={{ color: "#faad14" }} />}
    >
      <List
        dataSource={supplies}
        locale={{ emptyText: "Không có vật tư nào sắp hết" }}
        renderItem={(item) => (
          <List.Item>
            <div style={{ flex: 1 }}>{item.name}</div>
            <Tag color="red">Còn lại: {item.currentStock}</Tag>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default DashboardLowStockCard;
