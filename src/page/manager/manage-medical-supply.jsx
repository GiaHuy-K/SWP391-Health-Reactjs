import React, { useEffect, useState } from "react";
import {
  getMedicalSupplies,
  hardDeleteMedicalSupply,
} from "../../services/api.medicalSupply";
import MedicalSupplyTableTemplate from "../../components/templates/medicalSupplyTableTemplate";
import { toast } from "react-toastify";

function ManageMedicalSupplyM() {
    const [medicalList, setMedicalList] = useState([]);
    const [loading, setLoading] = useState(false);

    const role = localStorage.getItem("role");
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
      await hardDeleteMedicalSupply(id);
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

export default ManageMedicalSupplyM;