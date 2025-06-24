import React, { useEffect, useState } from "react";
import {
  getMedicalSupplies,
} from "../../services/api.medicalSupply";
import MedicalSupplyTableTemplate from "../../components/templates/medicalSupplyTableTemplate";
import { toast } from "react-toastify";

function ManageMedicalSupply() {
  const [medicalList, setMedicalList] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <MedicalSupplyTableTemplate
      data={medicalList}
      loading={loading}
    />
  );
}

export default ManageMedicalSupply;
