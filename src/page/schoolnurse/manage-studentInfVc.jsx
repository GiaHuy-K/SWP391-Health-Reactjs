import React, { useEffect, useState } from "react";
import { getAllVaccinations } from "../../services/api.vaccine";
import { message, Input, Button, Space } from "antd";
import StudentVaccinationTableTemplate from "../../components/templates/studentVaccinationTableTemplate";

const ManageStudentInfVc = () => {
  const [vaccinationList, setVaccinationList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    console.log("Khởi tạo trang quản lý tiêm chủng học sinh (Y tá)");
    const fetchVaccinationList = async () => {
      setLoading(true);
      try {
        const res = await getAllVaccinations();
        setVaccinationList(res.content || []);
        setFilteredList(res.content || []);
        console.log("Lấy danh sách tiêm chủng thành công:", res.content?.length || 0);
      } catch (err) {
        message.error("Lỗi khi lấy dữ liệu tiêm chủng!");
        console.error("Lỗi khi lấy danh sách tiêm chủng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVaccinationList();
    return () => {
      console.log("Rời khỏi trang quản lý tiêm chủng học sinh (Y tá)");
    };
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredList(vaccinationList);
      return;
    }
    const keyword = search.trim().toLowerCase();
    setFilteredList(
      vaccinationList.filter(item =>
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
      <StudentVaccinationTableTemplate data={filteredList} loading={loading} />
    </div>
  );
};

export default ManageStudentInfVc;