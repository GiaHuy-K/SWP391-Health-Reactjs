import React, { useEffect, useState } from "react";
import {
  getMedicalSupplies,
  softDeleteMedicalSupply,
} from "../../services/api.medicalSupply";
import MedicalSupplyTableTemplate from "../../components/templates/medicalSupplyTableTemplate";
import { toast } from "react-toastify";

function ManageMedicalSupply({ role }) {
  const [medicalList, setMedicalList] = useState([]);
  const [loading, setLoading] = useState(false);

  const canDelete = role === "Quản lý Nhân sự/Nhân viên";
  const canView = true;

  const fetchSupply = async () => {
    setLoading(true);
    try {
      const response = await getMedicalSupplies();
      setMedicalList(response);
    } catch (error) {
        console.log(error);
      toast.error("Lỗi API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupply();
  }, []);

  const handleDelete = async (id) => {
    await softDeleteMedicalSupply(id);
    fetchSupply();
  };

  return (
    <MedicalSupplyTableTemplate
      data={medicalList}
      loading={loading}
      onDelete={handleDelete}
      canDelete={canDelete}
      canView={canView}
    />
  );
}

export default ManageMedicalSupply;
