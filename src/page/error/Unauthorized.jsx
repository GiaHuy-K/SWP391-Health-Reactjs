
import React from "react";
import { Link } from "react-router-dom";
// Trang hiển thị khi người dùng không có quyền truy cập vào một trang nào đó

const Unauthorized = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>🚫 Không có quyền truy cập</h1>
      <p>Bạn không có quyền truy cập vào trang này.</p>
      <Link to="/">Quay lại trang chủ</Link>
    </div>
  );
};

export default Unauthorized;
