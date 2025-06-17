// import React, { useEffect, useState } from "react";
// import api from "../../config/axios";
import DashboardTemplate from "../../components/templates/dashboardTemplate";
//"StaffManager"
function ManageStaff() {
  // // tao mang
  // const [staffs, setStaffs] = useState([]);

  // //CRUD
  // const fetchStaff = async () => {
  //   const data = await api.get("admin/users/staff-managers");
  //   setStaffs(data);
  //   console.log(data);
  // };
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
  // //get staff
  // useEffect(() => {
  //   fetchStaff();
  // }, []);

  return (
    <div>
      <DashboardTemplate
        columns={columns}
        uri={"admin/users/staff-managers"}
      ></DashboardTemplate>
    </div>
  );
}

export default ManageStaff;
