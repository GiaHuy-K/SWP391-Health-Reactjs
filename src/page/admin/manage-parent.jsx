import React from "react";
import DashboardTemplate from "../../components/templates/dashboardTemplate";
import { Space, Table, Tag } from "antd";
//"Parent"
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
