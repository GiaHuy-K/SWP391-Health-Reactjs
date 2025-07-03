import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";

import api from "../../config/axios";
import dayjs from "dayjs";
import { Card, Spin, Select } from "antd";

const { Option } = Select;

const HealthIncidentLineChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const today = dayjs();
        let startDate, format;

        if (range === "7d") {
          startDate = today.subtract(6, "day");
          format = "YYYY-MM-DD";
        } else if (range === "30d") {
          startDate = today.subtract(29, "day");
          format = "YYYY-MM-DD";
        } else if (range === "12m") {
          startDate = today.subtract(11, "month");
          format = "YYYY-MM";
        }

        const res = await api.get("/health-incidents");
        const incidents = res.data.content || [];

        const grouped = {};

        const diff =
          range === "12m"
            ? today.diff(startDate, "month")
            : today.diff(startDate, "day");

        for (let i = 0; i <= diff; i++) {
          const dateKey =
            range === "12m"
              ? startDate.add(i, "month").format(format)
              : startDate.add(i, "day").format(format);
          grouped[dateKey] = 0;
        }

        incidents.forEach((incident) => {
          const date = dayjs(incident.incidentDateTime).format(format);
          if (grouped[date] !== undefined) {
            grouped[date]++;
          }
        });

        const chartData = Object.entries(grouped).map(([date, count]) => ({
          date,
          count,
        }));

        setData(chartData);
      } catch (err) {
        console.error("Lỗi khi tải biểu đồ sự cố y tế:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  const formatLabel = (value) => {
    if (range === "12m") {
      return dayjs(value).format("MM-YYYY"); // Tháng-Năm
    }
    return dayjs(value).format("DD-MM-YYYY"); // Ngày-Tháng-Năm
  };

  return (
    <Card
      title="Biểu đồ sự cố y tế"
      extra={
        <Select value={range} onChange={setRange} style={{ width: 180 }}>
          <Option value="7d">7 ngày gần đây</Option>
          <Option value="30d">30 ngày gần đây</Option>
          <Option value="12m">12 tháng gần đây</Option>
        </Select>
      }
    >
      {loading ? (
        <Spin />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatLabel}
              tick={{ fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12 }}
              padding={{ top: 10, bottom: 10 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #ddd",
              }}
              formatter={(value) => [`${value} sự cố`, "Số lượng"]}
              labelFormatter={(label) =>
                range === "12m"
                  ? `Tháng ${dayjs(label).format("MM-YYYY")}`
                  : `Ngày ${dayjs(label).format("DD-MM-YYYY")}`
              }
            />
            {/*  Gradient Background */}
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1890ff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#1890ff" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/*  Line + Area smooth */}
            <Line
              type="monotone"
              dataKey="count"
              stroke="#1890ff" // Màu đường line
              strokeWidth={2}
              dot={{ r: 4 }} // Chấm tròn
              activeDot={{ r: 6 }} // Hover chấm to hơn
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="none"
              fill="url(#colorUv)" //  Bóng nền dùng gradient trên
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default HealthIncidentLineChart;
