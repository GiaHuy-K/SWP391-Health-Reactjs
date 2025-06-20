import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import { getStudentById } from "../../services/api.student";

const StudentDetailModal = ({ open, onClose, studentId }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
          <p><strong>Mã học sinh:</strong> {student.studentCode}</p>
          <p><strong>Họ tên:</strong> {student.fullName}</p>
          <p><strong>Ngày sinh:</strong> {student.dateOfBirth}</p>
          <p><strong>Giới tính:</strong> {student.gender}</p>
          <p><strong>Lớp:</strong> {student.className}</p>
          <p><strong>Địa chỉ:</strong> {student.address}</p>
          <p><strong>Trạng thái:</strong> {student.isActive ? "Đang hoạt động" : "Vô hiệu hóa"}</p>
          <p><strong>Mã mời:</strong> {student.invitationCode}</p>
        </div>
      ) : (
        <p>Không tìm thấy dữ liệu học sinh.</p>
      )}
    </Modal>
  );
};

export default StudentDetailModal;
