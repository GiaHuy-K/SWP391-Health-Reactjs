import dayjs from 'dayjs';

/**
 * Validate date based on student's birth date
 * @param {string|Date} date - Date to validate
 * @param {string|Date} studentBirthDate - Student's birth date
 * @returns {object} - Validation result with isValid and error message
 */
export const validateDateAgainstBirthDate = (date, studentBirthDate) => {
  if (!date) {
    return {
      isValid: false,
      error: "Ngày là bắt buộc"
    };
  }

  if (!studentBirthDate) {
    return {
      isValid: false,
      error: "Không tìm thấy ngày sinh của học sinh hoặc định dạng ngày không hợp lệ"
    };
  }

  const inputDate = dayjs(date);
  const birthDate = dayjs(studentBirthDate);
  const today = dayjs();

  // Kiểm tra ngày không được trước ngày sinh
  if (inputDate.isBefore(birthDate)) {
    return {
      isValid: false,
      error: "Ngày không được trước ngày sinh của học sinh"
    };
  }

  // Kiểm tra ngày không được trong tương lai
  if (inputDate.isAfter(today)) {
    return {
      isValid: false,
      error: "Ngày không được trong tương lai"
    };
  }

  return {
    isValid: true,
    error: null
  };
};

/**
 * Create disabled date function for Ant Design DatePicker
 * @param {string|Date} studentBirthDate - Student's birth date
 * @returns {function} - Function to pass to disabledDate prop
 */
export const createDisabledDateFunction = (studentBirthDate) => {
  return (current) => {
    if (!current) return false;
    
    const birthDate = dayjs(studentBirthDate);
    const today = dayjs();
    
    // Disable dates before birth date
    if (current.isBefore(birthDate, 'day')) {
      return true;
    }
    
    // Disable dates in the future
    if (current.isAfter(today, 'day')) {
      return true;
    }
    
    return false;
  };
};

/**
 * Validate vaccination date
 * @param {string|Date} vaccinationDate - Vaccination date
 * @param {string|Date} studentBirthDate - Student's birth date
 * @returns {object} - Validation result
 */
export const validateVaccinationDate = (vaccinationDate, studentBirthDate) => {
  return validateDateAgainstBirthDate(vaccinationDate, studentBirthDate);
};

/**
 * Validate diagnosis date
 * @param {string|Date} diagnosisDate - Diagnosis date
 * @param {string|Date} studentBirthDate - Student's birth date
 * @returns {object} - Validation result
 */
export const validateDiagnosisDate = (diagnosisDate, studentBirthDate) => {
  return validateDateAgainstBirthDate(diagnosisDate, studentBirthDate);
};

/**
 * Get student birth date from student data
 * @param {object} student - Student object
 * @returns {string|null} - Birth date in YYYY-MM-DD format or null
 */
export const getStudentBirthDate = (student) => {
  if (!student) return null;
  
  // Handle different date formats
  if (student.dateOfBirth && student.dateOfBirth !== 'null' && student.dateOfBirth !== 'undefined') {
    try {
      // Try to parse the date with dayjs
      const parsedDate = dayjs(student.dateOfBirth);
      
      // Check if the parsed date is valid
      if (parsedDate.isValid()) {
        return parsedDate.format('YYYY-MM-DD');
      } else {
        console.error('Invalid date format:', student.dateOfBirth);
        return null;
      }
    } catch (error) {
      console.error('Error parsing student birth date:', error);
      return null;
    }
  }
  
  return null;
}; 