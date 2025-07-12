import React, { useEffect, useState } from "react";
import { Card, List, Tag } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { getMedicalSupplies } from "../../services/api.medicalSupply";
import dayjs from "dayjs";

const DashboardExpiringSuppliesCard = () => {
  const [supplies, setSupplies] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMedicalSupplies();
        const today = dayjs();
        const soon = today.add(60, "day"); // vật tư hết hạn trong 60 ngày tới

        const expiring = data.content.filter((item) =>
          item.expiredDate && dayjs(item.expiredDate).isBefore(soon)
        );

        setSupplies(expiring);
      } catch {
        setSupplies([]);
      }
    };
    fetch();
  }, []);

  return (
    <Card
      title="Vật tư sắp hết hạn"
      extra={<ClockCircleOutlined style={{ color: "#faad14" }} />}
    >
      <List
        dataSource={supplies}
        locale={{ emptyText: "Không có vật tư nào sắp hết hạn" }}
        renderItem={(item) => (
          <List.Item>
            <div style={{ flex: 1 }}>{item.name}</div>
            <Tag color="volcano">
              Hết hạn: {dayjs(item.expiredDate).format("DD/MM/YYYY")}
            </Tag>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default DashboardExpiringSuppliesCard;
