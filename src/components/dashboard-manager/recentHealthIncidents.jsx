import React, { useEffect, useState } from "react";
import { Card, List, Typography, Spin } from "antd";
import { getHealthIncidents } from "../../services/api.healthIncident"; 
import dayjs from "dayjs";

const RecentHealthIncidents = () => {
  const [loading, setLoading] = useState(true);
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const fetchRecentIncidents = async () => {
      setLoading(true);
      try {
        const res = await getHealthIncidents({
          page: 0,
          size: 5,
          sort: "incidentDateTime,DESC",
        });
        setIncidents(res.content || []);
        console.log(res.content);
      } catch (error) {
        console.error("Lỗi tải sự cố:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentIncidents();
  }, []);

  return (
    <Card title="🩺 Sự cố y tế gần đây" variant={false}>
      {loading ? (
        <Spin />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={incidents}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Typography.Text strong>
                    {item.studentName || "Không rõ"} ({item.studentClass || "?"})
                  </Typography.Text>
                }
                description={
                  <>
                    <div> <strong>Loại:</strong> {item.incidentType}</div>
                    <div> <strong>Thời gian:</strong> {dayjs(item.incidentDateTime).format("HH:mm DD/MM/YYYY")}</div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default RecentHealthIncidents;
