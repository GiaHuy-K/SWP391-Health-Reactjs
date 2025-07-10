import React, { useEffect, useState } from "react";
import { getAllChronicDiseases } from "../../services/api.chronic";
import { message, Input, Button, Space } from "antd";
import ChronicDiseaseTableTemplate from "../../components/templates/chronicDiseaseTableTemplate";

const ManageChronicDia = () => {
  const [chronicList, setChronicList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    console.log("Khởi tạo trang quản lý bệnh mãn tính học sinh (Y tá)");
    const fetchChronicList = async () => {
      setLoading(true);
      try {
        const res = await getAllChronicDiseases();
        setChronicList(res.content || []);
        setFilteredList(res.content || []);
        console.log("Lấy danh sách bệnh mãn tính thành công:", res.content?.length || 0);
      } catch (err) {
        message.error("Lỗi khi lấy dữ liệu bệnh mãn tính!");
        console.error("Lỗi khi lấy danh sách bệnh mãn tính:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChronicList();
    return () => {
      console.log("Rời khỏi trang quản lý bệnh mãn tính học sinh (Y tá)");
    };
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredList(chronicList);
      return;
    }
    const keyword = search.trim().toLowerCase();
    setFilteredList(
      chronicList.filter(item =>
        item.studentFullName && item.studentFullName.toLowerCase().includes(keyword)
      )
    );
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm tên học sinh"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onPressEnter={handleSearch}
          allowClear
          style={{ width: 240 }}
        />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
      </Space>
      <ChronicDiseaseTableTemplate data={filteredList} loading={loading} />
    </div>
  );
};

export default ManageChronicDia;
