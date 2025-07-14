import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const ManageChronic = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <Result
        status="info"
        title="Chức năng đã được chuyển"
        subTitle="Quản lý bệnh mãn tính đã được chuyển sang vai trò Y tá (Nurse). Vui lòng liên hệ với Y tá để thực hiện các thao tác liên quan đến bệnh mãn tính."
        extra={[
          <Button type="primary" key="nurse" onClick={() => navigate("/dashboardNurse/student-chronic-disease")}>
            Chuyển đến trang Y tá
          </Button>,
          <Button key="back" onClick={() => navigate("/dashboardManager")}>
            Quay lại Dashboard
          </Button>,
        ]}
      />
    </div>
  );
};

export default ManageChronic;
