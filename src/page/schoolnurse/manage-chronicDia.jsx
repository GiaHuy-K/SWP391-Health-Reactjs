import React, { useEffect, useState } from "react";
import { getAllChronicDiseases, updateChronicDiseaseStatus } from "../../services/api.chronic";
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

  const handleApprove = async (chronicDiseaseId) => {
    try {
      await updateChronicDiseaseStatus(chronicDiseaseId, "APPROVE", "Hồ sơ hợp lệ, đã duyệt");
      message.success("Duyệt thành công!");
      // reload lại danh sách
      const res = await getAllChronicDiseases();
      setChronicList(res.content || []);
      setFilteredList(res.content || []);
    } catch (err) {
      message.error("Duyệt thất bại!");
    }
  };
  const handleReject = async (chronicDiseaseId) => {
    try {
      await updateChronicDiseaseStatus(chronicDiseaseId, "REJECTED", "Thiếu thông tin cần thiết");
      message.success("Từ chối thành công!");
      // reload lại danh sách
      const res = await getAllChronicDiseases();
      setChronicList(res.content || []);
      setFilteredList(res.content || []);
    } catch (err) {
      message.error("Từ chối thất bại!");
    }
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
      <ChronicDiseaseTableTemplate
        data={filteredList}
        loading={loading}
        renderAction={record => {
          console.log('Chronic status:', record.status);
          const status = (record.status || '').toLowerCase();
          const isPending = !['approved', 'chấp nhận', 'đã duyệt', 'rejected', 'từ chối'].includes(status);
          return isPending ? (
            <>
              <Button type="link" style={{ color: "#52c41a" }} onClick={e => { e.stopPropagation(); handleApprove(record.id); }}>Duyệt</Button>
              <Button type="link" style={{ color: "#ff4d4f" }} onClick={e => { e.stopPropagation(); handleReject(record.id); }}>Từ chối</Button>
            </>
          ) : null;
        }}
      />
    </div>
  );
};

export default ManageChronicDia;
