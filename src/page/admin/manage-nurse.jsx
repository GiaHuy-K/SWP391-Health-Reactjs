import React from "react";
import DashboardTemplate from "../../components/templates/dashboardTemplate";

function ManageNurse() {
  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
  ];

  return (
    <div>
      {/* Sử dụng DashboardTemplate để hiển thị bảng quản lý y tá */}
      {/* Bảng này sẽ hiển thị danh sách các y tá với các cột đã định nghĩa */}
      <DashboardTemplate
        columns={columns}
        uri={"admin/users/medical-staff"}
      ></DashboardTemplate>
    </div>
  );
}

export default ManageNurse;
