import React, { useEffect, useState } from "react";
import { getAllVaccinations } from "../../services/api.vaccine";
import { message } from "antd";
import StudentVaccinationTableTemplate from "../../components/templates/StudentVaccinationTableTemplate";

function ManageStudentInfVc() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVaccinations = async () => {
      setLoading(true);
      try {
        const res = await getAllVaccinations();
        setData(res.content || []);
      } catch (err) {
        message.error("Lỗi khi lấy dữ liệu tiêm chủng!");
      } finally {
        setLoading(false);
      }
    };
    fetchVaccinations();
  }, []);

  return (
    <StudentVaccinationTableTemplate data={data} loading={loading} />
  );
}

export default ManageStudentInfVc;