import React from "react";
import DashboardTemplate from "../../components/templates/dashboardTemplate";

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

function ManageParent() {
  return (
    <div>
      <DashboardTemplate
        columns={columns}
        uri={"admin/users/parents"}
      ></DashboardTemplate>
    </div>
  );
}

export default ManageParent;
