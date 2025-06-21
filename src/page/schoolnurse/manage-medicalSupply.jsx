import React, { useEffect, useState } from "react";
import {
  getMedicalSupplies,
  deleteMedicalSupply,
} from "../../services/api.medicalSupply";
import MedicalSupplyTableTemplate from "../../components/templates/medicalSupplyTableTemplate";
import { toast } from "react-toastify";

function ManageMedicalSupply({ role }) {
  const [medicalList, setMedicalList] = useState([]);
  const [loading, setLoading] = useState(false);

  const canDelete = role === "StaffManager";
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
    await deleteMedicalSupply(id);
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
