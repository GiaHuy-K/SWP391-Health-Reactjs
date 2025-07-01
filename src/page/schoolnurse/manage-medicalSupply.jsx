import React, { useEffect, useState } from "react";
import { getMedicalSupplies } from "../../services/api.medicalSupply";
import MedicalSupplyTableTemplate from "../../components/templates/medicalSupplyTableTemplate";
import { toast } from "react-toastify";

function ManageMedicalSupply() {
  const [medicalList, setMedicalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); //  Trạng thái lọc

  const fetchSupply = async () => {
    setLoading(true);
    try {
      const response = await getMedicalSupplies({
        status, //  gửi filter vào BE
        sort: "name,ASC",
      });
      setMedicalList(response.content || []);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupply();
  }, [status]); //  load lại khi đổi trạng thái

  return (
    <MedicalSupplyTableTemplate
      data={medicalList}
      loading={loading}
      permissions={{
        canView: true,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canAdjustStock: false,
      }}
      onStatusFilterChange={setStatus} //  truyền hàm để nhận filter từ table
    />
  );
}

export default ManageMedicalSupply;
