import React, { useEffect, useState } from "react";
import { getMedicalSupplies } from "../../services/api.medicalSupply";
import MedicalSupplyTableTemplate from "../../components/templates/medicalSupplyTableTemplate";
import { toast } from "react-toastify";

function ManageMedicalSupply() {
  const [medicalList, setMedicalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const fetchSupply = async () => {
    setLoading(true);
    try {
      const response = await getMedicalSupplies({
        status,
        sort: "name,ASC",
        page,
        size,
      });
      setMedicalList(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.log(error);
      toast.error("Lỗi API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupply();
  }, [status, page, size]);

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
      onStatusFilterChange={(newStatus) => {
        setPage(0); // reset về trang đầu khi đổi filter
        setStatus(newStatus);
      }}
      pagination={{
        current: page + 1, // Ant Design pagination starts from 1
        pageSize: size,
        total: totalElements,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10"],
        onChange: (newPage, newSize) => {
          setPage(newPage - 1); 
          setSize(newSize);
        },
      }}
    />
  );
}

export default ManageMedicalSupply;
