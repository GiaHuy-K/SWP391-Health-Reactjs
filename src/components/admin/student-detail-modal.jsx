import React, { useEffect, useState } from "react";
import { Modal, Spin, Tag } from "antd";
import { getStudentById } from "../../services/api.student";

const StudentDetailModal = ({ open, onClose, studentId }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

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
          <p>
            <strong>Họ tên:</strong> {student.fullName}
          </p>
          <p>
            <strong>Ngày sinh:</strong> {student.dateOfBirth}
          </p>
          <p>
            <strong>Giới tính:</strong> {student.gender}
          </p>
          <p>
            <strong>Lớp:</strong> {student.className}
          </p>
          <p>
            <strong>Trạng thái:</strong> {renderStatus(student.status)}
          </p>
          <p>
            <strong>Mã mời:</strong> {student.invitationCode}
          </p>
        </div>
      ) : (
        <p>Không tìm thấy dữ liệu học sinh.</p>
      )}
    </Modal>
  );
};

export default StudentDetailModal;
