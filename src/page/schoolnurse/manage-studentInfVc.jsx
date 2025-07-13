import React, { useEffect, useState } from "react";
import { getAllVaccinations, updateVaccinationStatus } from "../../services/api.vaccine";
import { message, Input, Button, Space, Modal, Input as AntInput } from "antd";
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

  const handleApprove = async (record) => {
    Modal.confirm({
      title: "Xác nhận duyệt tiêm chủng",
      content: `Bạn chắc chắn muốn duyệt bản ghi tiêm chủng cho học sinh ${record.studentFullName}?`,
      okText: "Duyệt",
      cancelText: "Huỷ",
      onOk: async () => {
        await updateVaccinationStatus(record.studentVaccinationId, "Chấp nhận", "");
        window.location.reload(); // reload trang sau khi duyệt
      },
    });
  };
  const handleReject = (record) => {
    let reason = "";
    Modal.confirm({
      title: "Từ chối bản ghi tiêm chủng",
      content: (
        <div>
          <div>Nhập lý do từ chối:</div>
          <AntInput.TextArea onChange={e => reason = e.target.value} placeholder="Lý do từ chối" />
        </div>
      ),
      okText: "Từ chối",
      cancelText: "Huỷ",
      onOk: async () => {
        if (!reason.trim()) {
          Modal.error({ title: "Vui lòng nhập lý do từ chối!" });
          throw new Error("Lý do từ chối rỗng");
        }
        await updateVaccinationStatus(record.studentVaccinationId, "Từ chối", reason);
        window.location.reload(); // reload trang sau khi từ chối
      },
    });
  };
  const renderAction = (record) => {
    if (record.status === "Chờ xử lý" || record.status === "PENDING") {
      return (
        <>
          <Button type="primary" size="small" onClick={e => { e.stopPropagation(); handleApprove(record); }} style={{ marginRight: 8 }}>
            Duyệt
          </Button>
          <Button danger size="small" onClick={e => { e.stopPropagation(); handleReject(record); }}>
            Từ chối
          </Button>
        </>
      );
    }
    return null;
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
      <StudentVaccinationTableTemplate data={filteredList} loading={loading} renderAction={renderAction} />
    </div>
  );
};

export default ManageStudentInfVc;