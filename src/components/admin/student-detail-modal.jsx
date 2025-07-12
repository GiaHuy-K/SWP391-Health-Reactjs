import React, { useEffect, useState } from "react";
import { Col, Modal, Row, Spin, Tag } from "antd";
import { getStudentById } from "../../services/api.student";

const StudentDetailModal = ({ open, onClose, studentId }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const renderGender = (gender) => {
    switch (gender?.toLowerCase()) {
      case "nam":
        return <Tag color="blue">Nam</Tag>;
      case "nữ":
        return <Tag color="magenta">Nữ</Tag>;
      default:
        return <Tag>{gender}</Tag>;
    }
  };

  // Hàm để render trạng thái học sinh với màu sắc tương ứng
  const renderStatus = (status) => {
    let color;

    switch (status?.toLowerCase()) {
      case "hoạt động":
        color = "green";
        break;
      case "tốt nghiệp":
        color = "blue";
        break;
      case "chuyển trường":
        color = "orange";
        break;
      case "thôi học":
        color = "red";
        break;
      default:
        color = "default";
    }

    return <Tag color={color}>{status}</Tag>;
  };
  useEffect(() => {
    // Khi modal mở và có studentId, gọi API để lấy thông tin học sinh
    console.log("studnentId:", studentId);
    if (open && studentId) {
      setLoading(true);
      getStudentById(studentId)
        .then((data) => setStudent(data))
        .finally(() => setLoading(false));
    }
  }, [open, studentId]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Chi tiết học sinh"
    >
      {loading ? (
        <Spin />
      ) : student ? (
        <div>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <strong>Họ tên:</strong> {student.fullName}
            </Col>
            <Col span={12}>
              <strong>Giới tính:</strong> {renderGender(student.gender)}
            </Col>

            <Col span={12}>
              <strong>Ngày sinh:</strong>{" "}
              {new Date(student.dateOfBirth).toLocaleDateString("vi-VN")}
            </Col>
            <Col span={12}>
              <strong>Trạng thái:</strong> {renderStatus(student.status)}
            </Col>

            <Col span={12}>
              <strong>Khối:</strong> {student.classGroup}
            </Col>
            <Col span={12}>
              <strong>Lớp:</strong> {student.className}
            </Col>

            <Col span={12}>
              <strong>Mã mời:</strong> {student.invitationCode}
            </Col>
            <Col span={12}>
              <strong>Ngày tạo:</strong>{" "}
              {new Date(student.createdAt).toLocaleString("vi-VN")}
            </Col>

            <Col span={12}>
              <strong>Cập nhật lần cuối:</strong>{" "}
              {new Date(student.updatedAt).toLocaleString("vi-VN")}
            </Col>
          </Row>
        </div>
      ) : (
        <p>Không tìm thấy dữ liệu học sinh.</p>
      )}
    </Modal>
  );
};

export default StudentDetailModal;
