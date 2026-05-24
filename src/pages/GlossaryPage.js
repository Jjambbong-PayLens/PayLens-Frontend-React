import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function GlossaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('전체');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const { t } = useTranslation();
  const mockTerms = [
    { 
        id: 1, 
        category: '급여', 
        term: '최저임금', 
        en: 'Minimum Wage', 
        vi: 'Lương tối thiểu', 
        defKey: 'GlossaryPage_def_1', 
        exKey: 'GlossaryPage_ex_1' 
    },
    { 
        id: 2, 
        category: '급여', 
        term: '기본급', 
        en: 'Base Salary', 
        vi: 'Lương cơ bản', 
        defKey: 'GlossaryPage_def_2', 
        exKey: 'GlossaryPage_ex_2' 
    },
    { 
        id: 3, 
        category: '급여', 
        term: '통상임금', 
        en: 'Ordinary Wage', 
        vi: 'Lương thông thường', 
        defKey: 'GlossaryPage_def_3', 
        exKey: 'GlossaryPage_ex_3' 
    },
    { 
        id: 4, 
        category: '급여', 
        term: '월급제', 
        en: 'Monthly Wage System', 
        vi: 'Chế độ lương tháng', 
        defKey: 'GlossaryPage_def_4', 
        exKey: 'GlossaryPage_ex_4' 
    },
    { 
        id: 5, 
        category: '급여', 
        term: '시급제', 
        en: 'Hourly Wage System', 
        vi: 'Chế độ lương giờ', 
        defKey: 'GlossaryPage_def_5', 
        exKey: 'GlossaryPage_ex_5' 
    },
    { 
        id: 6, 
        category: '급여', 
        term: '일급제', 
        en: 'Daily Wage System', 
        vi: 'Chế độ lương ngày', 
        defKey: 'GlossaryPage_def_6', 
        exKey: 'GlossaryPage_ex_6' 
    },
    { 
        id: 7, 
        category: '급여', 
        term: '주급제', 
        en: 'Weekly Wage System', 
        vi: 'Chế độ lương tuần', 
        defKey: 'GlossaryPage_def_7', 
        exKey: 'GlossaryPage_ex_7' 
    },
    { 
        id: 8, 
        category: '급여', 
        term: '고정급', 
        en: 'Fixed Salary', 
        vi: 'Lương cố định', 
        defKey: 'GlossaryPage_def_8', 
        exKey: 'GlossaryPage_ex_8' 
    },
    { 
        id: 9, 
        category: '급여', 
        term: '변동급', 
        en: 'Variable Salary', 
        vi: 'Lương biến đổi', 
        defKey: 'GlossaryPage_def_9', 
        exKey: 'GlossaryPage_ex_9' 
    },
    { 
        id: 10, 
        category: '급여', 
        term: '월정액급여', 
        en: 'Fixed Monthly Allowance', 
        vi: 'Lương cố định hàng tháng', 
        defKey: 'GlossaryPage_def_10', 
        exKey: 'GlossaryPage_ex_10' 
    },
    { 
        id: 11, 
        category: '급여', 
        term: '총급여액', 
        en: 'Total Gross Salary', 
        vi: 'Tổng thu nhập', 
        defKey: 'GlossaryPage_def_11', 
        exKey: 'GlossaryPage_ex_11' 
    },
    { 
        id: 12, 
        category: '급여', 
        term: '실수령액', 
        en: 'Net Take-home Pay', 
        vi: 'Lương thực lĩnh', 
        defKey: 'GlossaryPage_def_12', 
        exKey: 'GlossaryPage_ex_12' 
    },
    { 
        id: 13, 
        category: '급여', 
        term: '세전급여', 
        en: 'Pre-tax Salary', 
        vi: 'Lương trước thuế', 
        defKey: 'GlossaryPage_def_13', 
        exKey: 'GlossaryPage_ex_13' 
    },
    { 
        id: 14, 
        category: '급여', 
        term: '세후급여', 
        en: 'Post-tax Salary', 
        vi: 'Lương sau thuế', 
        defKey: 'GlossaryPage_def_14', 
        exKey: 'GlossaryPage_ex_14' 
    },
    { 
        id: 15, 
        category: '급여', 
        term: '임금', 
        en: 'Wage', 
        vi: 'Tiền lương', 
        defKey: 'GlossaryPage_def_15', 
        exKey: 'GlossaryPage_ex_15' 
    },
    { 
        id: 16, 
        category: '급여', 
        term: '급여', 
        en: 'Salary', 
        vi: 'Lương', 
        defKey: 'GlossaryPage_def_16', 
        exKey: 'GlossaryPage_ex_16' 
    },
    { 
        id: 17, 
        category: '급여', 
        term: '보수', 
        en: 'Remuneration', 
        vi: 'Thù lao', 
        defKey: 'GlossaryPage_def_17', 
        exKey: 'GlossaryPage_ex_17' 
    },
    { 
        id: 18, 
        category: '급여', 
        term: '임금총액', 
        en: 'Total Wages', 
        vi: 'Tổng tiền lương', 
        defKey: 'GlossaryPage_def_18', 
        exKey: 'GlossaryPage_ex_18' 
    },
    { 
        id: 19, 
        category: '급여', 
        term: '지급액', 
        en: 'Payment Amount', 
        vi: 'Số tiền chi trả', 
        defKey: 'GlossaryPage_def_19', 
        exKey: 'GlossaryPage_ex_19' 
    },
    { 
        id: 20, 
        category: '급여', 
        term: '공제액', 
        en: 'Deduction Amount', 
        vi: 'Số tiền khấu trừ', 
        defKey: 'GlossaryPage_def_20', 
        exKey: 'GlossaryPage_ex_20' 
    },
    { 
        id: 21, 
        category: '급여', 
        term: '연장근로수당', 
        en: 'Overtime Allowance', 
        vi: 'Phụ cấp làm thêm giờ', 
        defKey: 'GlossaryPage_def_21', 
        exKey: 'GlossaryPage_ex_21' 
    },
    { 
        id: 22, 
        category: '급여', 
        term: '야간근로수당', 
        en: 'Night Shift Allowance', 
        vi: 'Phụ cấp làm đêm', 
        defKey: 'GlossaryPage_def_22', 
        exKey: 'GlossaryPage_ex_22' 
    },
    { 
        id: 23, 
        category: '급여', 
        term: '휴일근로수당', 
        en: 'Holiday Work Allowance', 
        vi: 'Phụ cấp làm ngày lễ', 
        defKey: 'GlossaryPage_def_23', 
        exKey: 'GlossaryPage_ex_23' 
    },
    { 
        id: 24, 
        category: '급여', 
        term: '주휴수당', 
        en: 'Weekly Holiday Allowance', 
        vi: 'Phụ cấp nghỉ hàng tuần', 
        defKey: 'GlossaryPage_def_24', 
        exKey: 'GlossaryPage_ex_24' 
    },
    { 
        id: 25, 
        category: '급여', 
        term: '연차수당', 
        en: 'Annual Leave Allowance', 
        vi: 'Phụ cấp nghỉ năm', 
        defKey: 'GlossaryPage_def_25', 
        exKey: 'GlossaryPage_ex_25' 
    },
    { 
        id: 26, 
        category: '급여', 
        term: '직무수당', 
        en: 'Job Duty Allowance', 
        vi: 'Phụ cấp chức', 
        defKey: 'GlossaryPage_def_26', 
        exKey: 'GlossaryPage_ex_26' 
    },
    { 
        id: 27, 
        category: '급여', 
        term: '직책수당', 
        en: 'Position Allowance', 
        vi: 'Phụ cấp chức vụ', 
        defKey: 'GlossaryPage_def_27', 
        exKey: 'GlossaryPage_ex_27' 
    },
    { 
        id: 28, 
        category: '급여', 
        term: '자격수당', 
        en: 'Qualification Allowance', 
        vi: 'Phụ cấp bằng cấp', 
        defKey: 'GlossaryPage_def_28', 
        exKey: 'GlossaryPage_ex_28' 
    },
    { 
        id: 29, 
        category: '급여', 
        term: '기술수당', 
        en: 'Technical Skill Allowance', 
        vi: 'Phụ cấp kỹ thuật', 
        defKey: 'GlossaryPage_def_29', 
        exKey: 'GlossaryPage_ex_29' 
    },
    { 
        id: 30, 
        category: '급여', 
        term: '위험수당', 
        en: 'Hazardous Work Allowance', 
        vi: 'Phụ cấp nguy hiểm', 
        defKey: 'GlossaryPage_def_30', 
        exKey: 'GlossaryPage_ex_30' 
    },
    { 
        id: 31, 
        category: '급여', 
        term: '교통비', 
        en: 'Transportation Expenses', 
        vi: 'Chi phí đi lại', 
        defKey: 'GlossaryPage_def_31', 
        exKey: 'GlossaryPage_ex_31' 
    },
    { 
        id: 32, 
        category: '급여', 
        term: '식대', 
        en: 'Meal Allowance', 
        vi: 'Tiền ăn', 
        defKey: 'GlossaryPage_def_32', 
        exKey: 'GlossaryPage_ex_32' 
    },
    { 
        id: 33, 
        category: '급여', 
        term: '근속수당', 
        en: 'Continuous Service Allowance', 
        vi: 'Phụ cấp thâm niên', 
        defKey: 'GlossaryPage_def_33', 
        exKey: 'GlossaryPage_ex_33' 
    },
    { 
        id: 34, 
        category: '급여', 
        term: '가족수당', 
        en: 'Family Allowance', 
        vi: 'Phụ cấp gia đình', 
        defKey: 'GlossaryPage_def_34', 
        exKey: 'GlossaryPage_ex_34' 
    },
    { 
        id: 35, 
        category: '급여', 
        term: '상여금', 
        en: 'Bonus', 
        vi: 'Tiền thưởng', 
        defKey: 'GlossaryPage_def_35', 
        exKey: 'GlossaryPage_ex_35' 
    },
    { 
        id: 36, 
        category: '급여', 
        term: '성과급', 
        en: 'Performance Incentives', 
        vi: 'Lương năng suất', 
        defKey: 'GlossaryPage_def_36', 
        exKey: 'GlossaryPage_ex_36' 
    },
    { 
        id: 37, 
        category: '급여', 
        term: '수당', 
        en: 'Allowance', 
        vi: 'Phụ cấp', 
        defKey: 'GlossaryPage_def_37', 
        exKey: 'GlossaryPage_ex_37' 
    },
    { 
        id: 38, 
        category: '급여', 
        term: '가산수당', 
        en: 'Additional Premium Allowance', 
        vi: 'Phụ cấp', 
        defKey: 'GlossaryPage_def_38', 
        exKey: 'GlossaryPage_ex_38' 
    },
    { 
        id: 39, 
        category: '급여', 
        term: '고정수당', 
        en: 'Regular Fixed Allowance', 
        vi: 'Phụ cấp cố định', 
        defKey: 'GlossaryPage_def_39', 
        exKey: 'GlossaryPage_ex_39' 
    },
    { 
        id: 40, 
        category: '급여', 
        term: '비고정수당', 
        en: 'Non-regular Allowance', 
        vi: 'Phụ cấp không cố định', 
        defKey: 'GlossaryPage_def_40', 
        exKey: 'GlossaryPage_ex_40' 
    },
    { 
        id: 41, 
        category: '근로', 
        term: '소정근로시간', 
        en: 'Contracted Work Hours', 
        vi: 'Thời gian làm việc', 
        defKey: 'GlossaryPage_def_41', 
        exKey: 'GlossaryPage_ex_41' 
    },
    { 
        id: 42, 
        category: '근로', 
        term: '법정근로시간', 
        en: 'Statutory Legal Work Hours', 
        vi: 'Thời gian làm việc pháp định', 
        defKey: 'GlossaryPage_def_42', 
        exKey: 'GlossaryPage_ex_42' 
    },
    { 
        id: 43, 
        category: '근로', 
        term: '연장근로', 
        en: 'Overtime Work', 
        vi: 'Làm thêm giờ', 
        defKey: 'GlossaryPage_def_43', 
        exKey: 'GlossaryPage_ex_43' 
    },
    { 
        id: 44, 
        category: '근로', 
        term: '야간근로', 
        en: 'Night Shift Work', 
        vi: 'Làm việc ban đêm', 
        defKey: 'GlossaryPage_def_44', 
        exKey: 'GlossaryPage_ex_44' 
    },
    { 
        id: 45, 
        category: '근로', 
        term: '휴일근로', 
        en: 'Holiday Work', 
        vi: 'Làm việc ngày nghỉ', 
        defKey: 'GlossaryPage_def_45', 
        exKey: 'GlossaryPage_ex_45' 
    },
    { 
        id: 46, 
        category: '근로', 
        term: '교대근무', 
        en: 'Shift Work', 
        vi: 'Làm việc theo ca', 
        defKey: 'GlossaryPage_def_46', 
        exKey: 'GlossaryPage_ex_46' 
    },
    { 
        id: 47, 
        category: '근로', 
        term: '탄력근로', 
        en: 'Flexible Work Hours', 
        vi: 'Làm việc linh hoạt', 
        defKey: 'GlossaryPage_def_47', 
        exKey: 'GlossaryPage_ex_47' 
    },
    { 
        id: 48, 
        category: '근로', 
        term: '선택근로', 
        en: 'Selective Work System', 
        vi: 'Làm việc lựa chọn', 
        defKey: 'GlossaryPage_def_48', 
        exKey: 'GlossaryPage_ex_48' 
    },
    { 
        id: 49, 
        category: '근로', 
        term: '시차출근', 
        en: 'Staggered Commuting', 
        vi: 'Đi làm lệch giờ', 
        defKey: 'GlossaryPage_def_49', 
        exKey: 'GlossaryPage_ex_49' 
    },
    { 
        id: 50, 
        category: '근로', 
        term: '휴게시간', 
        en: 'Break Time', 
        vi: 'Thời gian nghỉ ngơi', 
        defKey: 'GlossaryPage_def_50', 
        exKey: 'GlossaryPage_ex_50' 
    },
    { 
        id: 51, 
        category: '근로', 
        term: '대기시간', 
        en: 'Waiting Time', 
        vi: 'Thời gian chờ đợi', 
        defKey: 'GlossaryPage_def_51', 
        exKey: 'GlossaryPage_ex_51' 
    },
    { 
        id: 52, 
        category: '근로', 
        term: '작업시간', 
        en: 'Operation Hours', 
        vi: 'Thời gian thao tác', 
        defKey: 'GlossaryPage_def_52', 
        exKey: 'GlossaryPage_ex_52' 
    },
    { 
        id: 53, 
        category: '근로', 
        term: '근무시간', 
        en: 'Duty Hours', 
        vi: 'Thời gian làm việc', 
        defKey: 'GlossaryPage_def_53', 
        exKey: 'GlossaryPage_ex_53' 
    },
    { 
        id: 54, 
        category: '근로', 
        term: '초과근무', 
        en: 'Overtime Hours', 
        vi: 'Làm việc quá giờ', 
        defKey: 'GlossaryPage_def_54', 
        exKey: 'GlossaryPage_ex_54' 
    },
    { 
        id: 55, 
        category: '근로', 
        term: '잔업', 
        en: 'Overtime Work', 
        vi: 'Tăng ca', 
        defKey: 'GlossaryPage_def_55', 
        exKey: 'GlossaryPage_ex_55' 
    },
    { 
        id: 56, 
        category: '근로', 
        term: '특근', 
        en: 'Special Holiday Work', 
        vi: 'Làm ngày chủ nhật', 
        defKey: 'GlossaryPage_def_56', 
        exKey: 'GlossaryPage_ex_56' 
    },
    { 
        id: 57, 
        category: '근로', 
        term: '지각', 
        en: 'Tardiness', 
        vi: 'Đi muộn', 
        defKey: 'GlossaryPage_def_57', 
        exKey: 'GlossaryPage_ex_57' 
    },
    { 
        id: 58, 
        category: '근로', 
        term: '조퇴', 
        en: 'Early Leave', 
        vi: 'Về sớm', 
        defKey: 'GlossaryPage_def_58', 
        exKey: 'GlossaryPage_ex_58' 
    },
    { 
        id: 59, 
        category: '근로', 
        term: '결근', 
        en: 'Absence', 
        vi: 'Nghỉ làm', 
        defKey: 'GlossaryPage_def_59', 
        exKey: 'GlossaryPage_ex_59' 
    },
    { 
        id: 60, 
        category: '근로', 
        term: '근태', 
        en: 'Attendance Status', 
        vi: 'Cần cù điểm', 
        defKey: 'GlossaryPage_def_60', 
        exKey: 'GlossaryPage_ex_60' 
    },
    { 
        id: 61, 
        category: '근로', 
        term: '출근부', 
        en: 'Attendance Register', 
        vi: 'Sổ chấm công', 
        defKey: 'GlossaryPage_def_61', 
        exKey: 'GlossaryPage_ex_61' 
    },
    { 
        id: 62, 
        category: '근로', 
        term: '주휴일', 
        en: 'Weekly Paid Holiday', 
        vi: 'Ngày nghỉ', 
        defKey: 'GlossaryPage_def_62', 
        exKey: 'GlossaryPage_ex_62' 
    },
    { 
        id: 63, 
        category: '근로', 
        term: '유급휴일', 
        en: 'Paid Holiday', 
        vi: 'Nghỉ lễ có lương', 
        defKey: 'GlossaryPage_def_63', 
        exKey: 'GlossaryPage_ex_63' 
    },
    { 
        id: 64, 
        category: '근로', 
        term: '무급휴일', 
        en: 'Unpaid Holiday', 
        vi: 'Nghỉ không lương', 
        defKey: 'GlossaryPage_def_64', 
        exKey: 'GlossaryPage_ex_64' 
    },
    { 
        id: 65, 
        category: '근로', 
        term: '공휴일', 
        en: 'Public Holiday', 
        vi: 'Ngày lễ công cộng', 
        defKey: 'GlossaryPage_def_65', 
        exKey: 'GlossaryPage_ex_65' 
    },
    { 
        id: 66, 
        category: '근로', 
        term: '연차유급휴가', 
        en: 'Annual Paid Leave', 
        vi: 'Nghỉ phép năm có lương', 
        defKey: 'GlossaryPage_def_66', 
        exKey: 'GlossaryPage_ex_66' 
    },
    { 
        id: 67, 
        category: '근로', 
        term: '병가', 
        en: 'Sick Leave', 
        vi: 'Nghỉ ốm', 
        defKey: 'GlossaryPage_def_67', 
        exKey: 'GlossaryPage_ex_67' 
    },
    { 
        id: 68, 
        category: '근로', 
        term: '경조휴가', 
        en: 'Congratulatory & Condolence Leave', 
        vi: 'Nghỉ hiếu hỉ', 
        defKey: 'GlossaryPage_def_68', 
        exKey: 'GlossaryPage_ex_68' 
    },
    { 
        id: 69, 
        category: '근로', 
        term: '특별휴가', 
        en: 'Special Leave', 
        vi: 'Nghỉ đặc biệt', 
        defKey: 'GlossaryPage_def_69', 
        exKey: 'GlossaryPage_ex_69' 
    },
    { 
        id: 70, 
        category: '근로', 
        term: '휴직', 
        en: 'Leave of Absence', 
        vi: 'Tạm nghỉ việc', 
        defKey: 'GlossaryPage_def_70', 
        exKey: 'GlossaryPage_ex_70' 
    },
    { 
        id: 71, 
        category: '근로', 
        term: '육아휴직', 
        en: 'Parental Leave', 
        vi: 'Nghỉ thai sản / chăm con', 
        defKey: 'GlossaryPage_def_71', 
        exKey: 'GlossaryPage_ex_71' 
    },
    { 
        id: 72, 
        category: '근로', 
        term: '무단결근', 
        en: 'Unexcused Absence', 
        vi: 'Nghỉ tự do', 
        defKey: 'GlossaryPage_def_72', 
        exKey: 'GlossaryPage_ex_72' 
    },
    { 
        id: 73, 
        category: '근로', 
        term: '대체휴무', 
        en: 'Alternative Holiday', 
        vi: 'Nghỉ bù', 
        defKey: 'GlossaryPage_def_73', 
        exKey: 'GlossaryPage_ex_73' 
    },
    { 
        id: 74, 
        category: '근로', 
        term: '보상휴가', 
        en: 'Compensatory Leave', 
        vi: 'Nghỉ', 
        defKey: 'GlossaryPage_def_74', 
        exKey: 'GlossaryPage_ex_74' 
    },
    { 
        id: 75, 
        category: '근로', 
        term: '휴가계', 
        en: 'Leave Application Form', 
        vi: 'Đơn xin nghỉ phép', 
        defKey: 'GlossaryPage_def_75', 
        exKey: 'GlossaryPage_ex_75' 
    },
    { 
        id: 76, 
        category: '근로', 
        term: '휴일대체', 
        en: 'Substitution of Holiday', 
        vi: 'Thay thế ngày nghỉ', 
        defKey: 'GlossaryPage_def_76', 
        exKey: 'GlossaryPage_ex_76' 
    },
    { 
        id: 77, 
        category: '계약', 
        term: '근로계약서', 
        en: 'Employment Contract', 
        vi: 'Hợp đồng lao động', 
        defKey: 'GlossaryPage_def_77', 
        exKey: 'GlossaryPage_ex_77' 
    },
    { 
        id: 78, 
        category: '계약', 
        term: '표준근로계약서', 
        en: 'Standard Labor Contract', 
        vi: 'Hợp đồng lao động tiêu chuẩn', 
        defKey: 'GlossaryPage_def_78', 
        exKey: 'GlossaryPage_ex_78' 
    },
    { 
        id: 79, 
        category: '계약', 
        term: '근로조건', 
        en: 'Working Conditions', 
        vi: 'Điều kiện lao động', 
        defKey: 'GlossaryPage_def_79', 
        exKey: 'GlossaryPage_ex_79' 
    },
    { 
        id: 80, 
        category: '계약', 
        term: '채용', 
        en: 'Recruitment', 
        vi: 'Tuyển dụng', 
        defKey: 'GlossaryPage_def_80', 
        exKey: 'GlossaryPage_ex_80' 
    },
    { 
        id: 81, 
        category: '계약', 
        term: '입사', 
        en: 'Joining the Company', 
        vi: 'Vào công ty', 
        defKey: 'GlossaryPage_def_81', 
        exKey: 'GlossaryPage_ex_81' 
    },
    { 
        id: 82, 
        category: '계약', 
        term: '수습', 
        en: 'Probation', 
        vi: 'Thử việc', 
        defKey: 'GlossaryPage_def_82', 
        exKey: 'GlossaryPage_ex_82' 
    },
    { 
        id: 83, 
        category: '계약', 
        term: '시용', 
        en: 'Trial Employment', 
        vi: 'Thử việc 시용', 
        defKey: 'GlossaryPage_def_83', 
        exKey: 'GlossaryPage_ex_83' 
    },
    { 
        id: 84, 
        category: '계약', 
        term: '계약기간', 
        en: 'Contract Period', 
        vi: 'Thời hạn hợp đồng', 
        defKey: 'GlossaryPage_def_84', 
        exKey: 'GlossaryPage_ex_84' 
    },
    { 
        id: 85, 
        category: '계약', 
        term: '갱신', 
        en: 'Renewal', 
        vi: 'Gia hạn', 
        defKey: 'GlossaryPage_def_85', 
        exKey: 'GlossaryPage_ex_85' 
    },
    { 
        id: 86, 
        category: '계약', 
        term: '연장계약', 
        en: 'Contract Extension', 
        vi: 'Hợp đồng gia hạn', 
        defKey: 'GlossaryPage_def_86', 
        exKey: 'GlossaryPage_ex_86' 
    },
    { 
        id: 87, 
        category: '계약', 
        term: '변경계약', 
        en: 'Contract Modification', 
        vi: 'Hợp đồng thay đổi', 
        defKey: 'GlossaryPage_def_87', 
        exKey: 'GlossaryPage_ex_87' 
    },
    { 
        id: 88, 
        category: '계약', 
        term: '업무내용', 
        en: 'Job Description', 
        vi: 'Nội dung công việc', 
        defKey: 'GlossaryPage_def_88', 
        exKey: 'GlossaryPage_ex_88' 
    },
    { 
        id: 89, 
        category: '계약', 
        term: '직무내용', 
        en: 'Task Details', 
        vi: 'Chi tiết chức vụ', 
        defKey: 'GlossaryPage_def_89', 
        exKey: 'GlossaryPage_ex_89' 
    },
    { 
        id: 90, 
        category: '계약', 
        term: '근무장소', 
        en: 'Workplace Location', 
        vi: 'Nơi làm việc', 
        defKey: 'GlossaryPage_def_90', 
        exKey: 'GlossaryPage_ex_90' 
    },
    { 
        id: 91, 
        category: '계약', 
        term: '배치전환', 
        en: 'Relocation/Reassignment', 
        vi: 'Chuyển đổi vị trí', 
        defKey: 'GlossaryPage_def_91', 
        exKey: 'GlossaryPage_ex_91' 
    },
    { 
        id: 92, 
        category: '계약', 
        term: '파견', 
        en: 'Dispatch / Secondment', 
        vi: 'Phái cử', 
        defKey: 'GlossaryPage_def_92', 
        exKey: 'GlossaryPage_ex_92' 
    },
    { 
        id: 93, 
        category: '계약', 
        term: '전근', 
        en: 'Transfer to Another Branch', 
        vi: 'Chuyển công tác', 
        defKey: 'GlossaryPage_def_93', 
        exKey: 'GlossaryPage_ex_93' 
    },
    { 
        id: 94, 
        category: '계약', 
        term: '해고', 
        en: 'Dismissal / Firing', 
        vi: 'Sa thái', 
        defKey: 'GlossaryPage_def_94', 
        exKey: 'GlossaryPage_ex_94' 
    },
    { 
        id: 95, 
        category: '계약', 
        term: '권고사직', 
        en: 'Recommended Resignation', 
        vi: 'Thôi việc theo khuyến nghị', 
        defKey: 'GlossaryPage_def_95', 
        exKey: 'GlossaryPage_ex_95' 
    },
    { 
        id: 96, 
        category: '계약', 
        term: '자진퇴사', 
        en: 'Voluntary Resignation', 
        vi: 'Tự nguyện xin thôi việc', 
        defKey: 'GlossaryPage_def_96', 
        exKey: 'GlossaryPage_ex_96' 
    },
    { 
        id: 97, 
        category: '체류', 
        term: '체류자격', 
        en: 'Visa Status', 
        vi: 'Tư cách lưu trú', 
        defKey: 'GlossaryPage_def_97', 
        exKey: 'GlossaryPage_ex_97' 
    },
    { 
        id: 98, 
        category: '체류', 
        term: '체류기간', 
        en: 'Period of Sojourn', 
        vi: 'Thời hạn lưu trú', 
        defKey: 'GlossaryPage_def_98', 
        exKey: 'GlossaryPage_ex_98' 
    },
    { 
        id: 99, 
        category: '체류', 
        term: '체류허가', 
        en: 'Stay Permission', 
        vi: 'Phép lưu trú', 
        defKey: 'GlossaryPage_def_99', 
        exKey: 'GlossaryPage_ex_99' 
    },
    { 
        id: 100, 
        category: '체류', 
        term: '취업활동', 
        en: 'Employment Activity', 
        vi: 'Hoạt động việc làm', 
        defKey: 'GlossaryPage_def_100', 
        exKey: 'GlossaryPage_ex_100' 
    },
    { 
        id: 101, 
        category: '체류', 
        term: '비전문취업', 
        en: 'Non-professional Employment (E-9)', 
        vi: 'Lao động phi chuyên môn', 
        defKey: 'GlossaryPage_def_101', 
        exKey: 'GlossaryPage_ex_101' 
    },
    { 
        id: 102, 
        category: '체류', 
        term: '고용허가제', 
        en: 'Employment Permit System (EPS)', 
        vi: 'Hệ thống cấp phép việc làm', 
        defKey: 'GlossaryPage_def_102', 
        exKey: 'GlossaryPage_ex_102' 
    },
    { 
        id: 103, 
        category: '체류', 
        term: '고용허가서', 
        en: 'Employment Permit', 
        vi: 'Giấy phép thuê lao động', 
        defKey: 'GlossaryPage_def_103', 
        exKey: 'GlossaryPage_ex_103' 
    },
    { 
        id: 104, 
        category: '체류', 
        term: '고용신고', 
        en: 'Employment Reporting', 
        vi: 'Khai báo thuê lao động', 
        defKey: 'GlossaryPage_def_104', 
        exKey: 'GlossaryPage_ex_104' 
    },
    { 
        id: 105, 
        category: '체류', 
        term: '불법고용', 
        en: 'Illegal Employment', 
        vi: 'Thuê lao động bất hợp pháp', 
        defKey: 'GlossaryPage_def_105', 
        exKey: 'GlossaryPage_ex_105' 
    },
    { 
        id: 106, 
        category: '체류', 
        term: '불법체류', 
        en: 'Illegal Stay (Undocumented)', 
        vi: 'Cư trú bất hợp pháp', 
        defKey: 'GlossaryPage_def_106', 
        exKey: 'GlossaryPage_ex_106' 
    },
    { 
        id: 107, 
        category: '체류', 
        term: '사전허가', 
        en: 'Prior Permission', 
        vi: 'Xin phép trước', 
        defKey: 'GlossaryPage_def_107', 
        exKey: 'GlossaryPage_ex_107' 
    },
    { 
        id: 108, 
        category: '체류', 
        term: '체류연장', 
        en: 'Extension of Stay', 
        vi: 'Gia hạn lưu trú', 
        defKey: 'GlossaryPage_def_108', 
        exKey: 'GlossaryPage_ex_108' 
    },
    { 
        id: 109, 
        category: '체류', 
        term: '체류변경', 
        en: 'Change of Visa Status', 
        vi: 'Thay đổi tư cách lưu trú', 
        defKey: 'GlossaryPage_def_109', 
        exKey: 'GlossaryPage_ex_109' 
    },
    { 
        id: 110, 
        category: '체류', 
        term: '출입국', 
        en: 'Immigration', 
        vi: 'Xuất nhập cảnh', 
        defKey: 'GlossaryPage_def_110', 
        exKey: 'GlossaryPage_ex_110' 
    },
    { 
        id: 111, 
        category: '체류', 
        term: '외국인등록', 
        en: 'Alien Registration', 
        vi: 'Đăng ký người nước ngoài', 
        defKey: 'GlossaryPage_def_111', 
        exKey: 'GlossaryPage_ex_111' 
    },
    { 
        id: 112, 
        category: '체류', 
        term: '등록증', 
        en: 'Registration Card (ARC)', 
        vi: 'Thẻ cư trú', 
        defKey: 'GlossaryPage_def_112', 
        exKey: 'GlossaryPage_ex_112' 
    },
    { 
        id: 113, 
        category: '체류', 
        term: '여권', 
        en: 'Passport', 
        vi: 'Hộ chiếu', 
        defKey: 'GlossaryPage_def_113', 
        exKey: 'GlossaryPage_ex_113' 
    },
    { 
        id: 114, 
        category: '체류', 
        term: '비자', 
        en: 'Visa', 
        vi: 'Thị thực / Visa', 
        defKey: 'GlossaryPage_def_114', 
        exKey: 'GlossaryPage_ex_114' 
    },
    { 
        id: 115, 
        category: '체류', 
        term: 'MOU', 
        en: 'Memorandum of Understanding', 
        vi: 'Biên bản ghi nhớ', 
        defKey: 'GlossaryPage_def_115', 
        exKey: 'GlossaryPage_ex_115' 
    },
    { 
        id: 116, 
        category: '체류', 
        term: '송출국', 
        en: 'Sending Country', 
        vi: 'Quốc gia phái cử', 
        defKey: 'GlossaryPage_def_116', 
        exKey: 'GlossaryPage_ex_116' 
    },
    { 
        id: 117, 
        category: '체류', 
        term: '도입절차', 
        en: 'Induction Procedure', 
        vi: 'Quy trình tiếp nhận', 
        defKey: 'GlossaryPage_def_117', 
        exKey: 'GlossaryPage_ex_117' 
    },
    { 
        id: 118, 
        category: '세금', 
        term: '원천징수', 
        en: 'Withholding Tax', 
        vi: 'Khấu trừ tại nguồn', 
        defKey: 'GlossaryPage_def_118', 
        exKey: 'GlossaryPage_ex_118' 
    },
    { 
        id: 119, 
        category: '세금', 
        term: '소득세', 
        en: 'Income Tax', 
        vi: 'Thuế thu nhập', 
        defKey: 'GlossaryPage_def_119', 
        exKey: 'GlossaryPage_ex_119' 
    },
    { 
        id: 120, 
        category: '세금', 
        term: '지방소득세', 
        en: 'Local Income Tax', 
        vi: 'Thu Thuế thu nhập địa phương', 
        defKey: 'GlossaryPage_def_120', 
        exKey: 'GlossaryPage_ex_120' 
    },
    { 
        id: 121, 
        category: '보험', 
        term: '4대보험', 
        en: '4 Major Social Insurances', 
        vi: '4 loại bảo hiểm lớn', 
        defKey: 'GlossaryPage_def_121', 
        exKey: 'GlossaryPage_ex_121' 
    },
    { 
        id: 122, 
        category: '보험', 
        term: '국민연금', 
        en: 'National Pension', 
        vi: 'Lương hưu quốc dân', 
        defKey: 'GlossaryPage_def_122', 
        exKey: 'GlossaryPage_ex_122' 
    },
    { 
        id: 123, 
        category: '보험', 
        term: '건강보험', 
        en: 'National Health Insurance', 
        vi: 'Bảo hiểm y tế', 
        defKey: 'GlossaryPage_def_123', 
        exKey: 'GlossaryPage_ex_123' 
    },
    { 
        id: 124, 
        category: '보험', 
        term: '장기요양보험', 
        en: 'Long-term Care Insurance', 
        vi: 'Bảo hiểm điều dưỡng dài hạn', 
        defKey: 'GlossaryPage_def_124', 
        exKey: 'GlossaryPage_ex_124' 
    },
    { 
        id: 125, 
        category: '보험', 
        term: '고용보험', 
        en: 'Employment Insurance', 
        vi: 'Bảo hiểm thất nghiệp', 
        defKey: 'GlossaryPage_def_125', 
        exKey: 'GlossaryPage_ex_125' 
    },
    { 
        id: 126, 
        category: '보험', 
        term: '산재보험', 
        en: 'Industrial Accident Insurance', 
        vi: 'Bảo hiểm tai nạn lao động', 
        defKey: 'GlossaryPage_def_126', 
        exKey: 'GlossaryPage_ex_126' 
    },
    { 
        id: 127, 
        category: '세금', 
        term: '공제', 
        en: 'Deduction', 
        vi: 'Khấu trừ', 
        defKey: 'GlossaryPage_def_127', 
        exKey: 'GlossaryPage_ex_127' 
    },
    { 
        id: 128, 
        category: '세금', 
        term: '과세', 
        en: 'Taxation', 
        vi: 'Đánh thuế', 
        defKey: 'GlossaryPage_def_128', 
        exKey: 'GlossaryPage_ex_128' 
    },
    { 
        id: 129, 
        category: '세금', 
        term: '비과세', 
        en: 'Non-taxable Income', 
        vi: 'Miễn thuế', 
        defKey: 'GlossaryPage_def_129', 
        exKey: 'GlossaryPage_ex_129' 
    },
    { 
        id: 130, 
        category: '세금', 
        term: '세액', 
        en: 'Tax Amount', 
        vi: 'Số tiền thuế', 
        defKey: 'GlossaryPage_def_130', 
        exKey: 'GlossaryPage_ex_130' 
    },
    { 
        id: 131, 
        category: '세금', 
        term: '세율', 
        en: 'Tax Rate', 
        vi: 'Thuế suất', 
        defKey: 'GlossaryPage_def_131', 
        exKey: 'GlossaryPage_ex_131' 
    },
    { 
        id: 132, 
        category: '세금', 
        term: '신고', 
        en: 'Tax Declaration', 
        vi: 'Khai báo', 
        defKey: 'GlossaryPage_def_132', 
        exKey: 'GlossaryPage_ex_132' 
    },
    { 
        id: 133, 
        category: '세금', 
        term: '납부', 
        en: 'Tax Payment', 
        vi: 'Nộp thuế', 
        defKey: 'GlossaryPage_def_133', 
        exKey: 'GlossaryPage_ex_133' 
    },
    { 
        id: 134, 
        category: '세금', 
        term: '정산', 
        en: 'Settlement', 
        vi: 'Quyết toán', 
        defKey: 'GlossaryPage_def_134', 
        exKey: 'GlossaryPage_ex_134' 
    },
    { 
        id: 135, 
        category: '세금', 
        term: '연말정산', 
        en: 'Year-end Tax Settlement', 
        vi: 'Quyết toán thuế cuối năm', 
        defKey: 'GlossaryPage_def_135', 
        exKey: 'GlossaryPage_ex_135' 
    },
    { 
        id: 136, 
        category: '세금', 
        term: '환급', 
        en: 'Tax Refund', 
        vi: 'Hoàn thuế', 
        defKey: 'GlossaryPage_def_136', 
        exKey: 'GlossaryPage_ex_136' 
    },
    { 
        id: 137, 
        category: '세금', 
        term: '추가납부', 
        en: 'Additional Payment', 
        vi: 'Nộp bổ sung', 
        defKey: 'GlossaryPage_def_137', 
        exKey: 'GlossaryPage_ex_137' 
    },
    { 
        id: 138, 
        category: '보험', 
        term: '출국만기보험', 
        en: 'Departure Guarantee Insurance', 
        vi: 'Bảo hiểm mãn hạn xuất cảnh', 
        defKey: 'GlossaryPage_def_138', 
        exKey: 'GlossaryPage_ex_138' 
    },
    { 
        id: 139, 
        category: '보험', 
        term: '귀국비용보험', 
        en: 'Return Cost Insurance', 
        vi: 'Bảo hiểm chi phí về nước', 
        defKey: 'GlossaryPage_def_139', 
        exKey: 'GlossaryPage_ex_139' 
    },
    { 
        id: 140, 
        category: '보험', 
        term: '상해보험', 
        en: 'Accident Insurance', 
        vi: 'Bảo hiểm tai nạn', 
        defKey: 'GlossaryPage_def_140', 
        exKey: 'GlossaryPage_ex_140' 
    },
    { 
        id: 141, 
        category: '보험', 
        term: '임금체불보증보험', 
        en: 'Wage Guarantee Insurance', 
        vi: 'Bảo hiểm bảo lãnh bảo đảm tiền lương', 
        defKey: 'GlossaryPage_def_141', 
        exKey: 'GlossaryPage_ex_141' 
    },
    { 
        id: 142, 
        category: '급여', 
        term: '퇴직금', 
        en: 'Severance Pay', 
        vi: 'Tiền thôi việc', 
        defKey: 'GlossaryPage_def_142', 
        exKey: 'GlossaryPage_ex_142' 
    },
    { 
        id: 143, 
        category: '급여', 
        term: '퇴직급여', 
        en: 'Retirement Benefit', 
        vi: 'Chế độ trợ cấp thôi việc', 
        defKey: 'GlossaryPage_def_143', 
        exKey: 'GlossaryPage_ex_143' 
    },
    { 
        id: 144, 
        category: '보험', 
        term: '보상', 
        en: 'Compensation', 
        vi: 'Bồi thường', 
        defKey: 'GlossaryPage_def_144', 
        exKey: 'GlossaryPage_ex_144' 
    },
    { 
        id: 145, 
        category: '보험', 
        term: '치료비', 
        en: 'Medical Treatment Costs', 
        vi: 'Chi phí điều trị', 
        defKey: 'GlossaryPage_def_145', 
        exKey: 'GlossaryPage_ex_145' 
    },
    { 
        id: 146, 
        category: '보험', 
        term: '휴업급여', 
        en: 'Shutdown Allowance (Accident)', 
        vi: 'Trợ cấp nghỉ việc do tai nạn', 
        defKey: 'GlossaryPage_def_146', 
        exKey: 'GlossaryPage_ex_146' 
    },
    { 
        id: 147, 
        category: '보험', 
        term: '장해급여', 
        en: 'Disability Benefits', 
        vi: 'Trợ cấp khuyết tật', 
        defKey: 'GlossaryPage_def_147', 
        exKey: 'GlossaryPage_ex_147' 
    },
    { 
        id: 148, 
        category: '보험', 
        term: '유족급여', 
        en: "Survivors' Benefits", 
        vi: 'Trợ cấp tuất', 
        defKey: 'GlossaryPage_def_148', 
        exKey: 'GlossaryPage_ex_148' 
    },
    { 
        id: 149, 
        category: '계약', 
        term: '퇴직', 
        en: 'Retirement', 
        vi: 'Nghỉ việc / Thôi việc', 
        defKey: 'GlossaryPage_def_149', 
        exKey: 'GlossaryPage_ex_149' 
    },
    { 
        id: 150, 
        category: '계약', 
        term: '퇴사', 
        en: 'Leaving the Company', 
        vi: 'Nghỉ việc', 
        defKey: 'GlossaryPage_def_150', 
        exKey: 'GlossaryPage_ex_150' 
    },
    { 
        id: 151, 
        category: '계약', 
        term: '해지', 
        en: 'Termination', 
        vi: 'Hủy bỏ', 
        defKey: 'GlossaryPage_def_151', 
        exKey: 'GlossaryPage_ex_151' 
    },
    { 
        id: 152, 
        category: '계약', 
        term: '계약종료', 
        en: 'Contract Termination', 
        vi: 'Chấm dứt hợp đồng', 
        defKey: 'GlossaryPage_def_152', 
        exKey: 'GlossaryPage_ex_152' 
    },
    { 
        id: 153, 
        category: '계약', 
        term: '만료', 
        en: 'Expiration', 
        vi: 'Hết hạn', 
        defKey: 'GlossaryPage_def_153', 
        exKey: 'GlossaryPage_ex_153' 
    },
    { 
        id: 154, 
        category: '계약', 
        term: '중도퇴사', 
        en: 'Mid-term Resignation', 
        vi: 'Nghỉ việc giữa chừng', 
        defKey: 'GlossaryPage_def_154', 
        exKey: 'GlossaryPage_ex_154' 
    },
    { 
        id: 155, 
        category: '계약', 
        term: '사직', 
        en: 'Resignation', 
        vi: 'Từ chức / Từ nhiệm', 
        defKey: 'GlossaryPage_def_155', 
        exKey: 'GlossaryPage_ex_155' 
    },
    { 
        id: 156, 
        category: '계약', 
        term: '해고예고', 
        en: 'Advance Notice of Dismissal', 
        vi: 'Thông báo sa thải trước', 
        defKey: 'GlossaryPage_def_156', 
        exKey: 'GlossaryPage_ex_156' 
    },
    { 
        id: 157, 
        category: '급여', 
        term: '해고예고수당', 
        en: 'Dismissal Notice Allowance', 
        vi: 'Phụ cấp thông báo sa thải', 
        defKey: 'GlossaryPage_def_157', 
        exKey: 'GlossaryPage_ex_157' 
    },
    { 
        id: 158, 
        category: '세금', 
        term: '출국만기', 
        en: 'Departure Expiry', 
        vi: 'Mãn hạn xuất cảnh 정산', 
        defKey: 'GlossaryPage_def_158', 
        exKey: 'GlossaryPage_ex_158' 
    },
    { 
        id: 159, 
        category: '급여', 
        term: '미지급임금', 
        en: 'Unpaid Wages', 
        vi: 'Tiền lương chưa trả', 
        defKey: 'GlossaryPage_def_159', 
        exKey: 'GlossaryPage_ex_159' 
    },
    { 
        id: 160, 
        category: '급여', 
        term: '체불임금', 
        en: 'Overdue Delayed Wages', 
        vi: 'Tiền lương bị chậm', 
        defKey: 'GlossaryPage_def_160', 
        exKey: 'GlossaryPage_ex_160' 
    },
    { 
        id: 161, 
        category: '세금', 
        term: '퇴직정산', 
        en: 'Retirement Tax Settlement', 
        vi: 'Quyết toán thôi việc', 
        defKey: 'GlossaryPage_def_161', 
        exKey: 'GlossaryPage_ex_161' 
    },
    { 
        id: 162, 
        category: '근로', 
        term: '근태관리', 
        en: 'Time and Attendance Management', 
        vi: 'Quản lý ngày công', 
        defKey: 'GlossaryPage_def_162', 
        exKey: 'GlossaryPage_ex_162' 
    },
    { 
        id: 163, 
        category: '근로', 
        term: '출퇴근기록', 
        en: 'Clock-in/out Record', 
        vi: 'Ghi chép ra vào làm', 
        defKey: 'GlossaryPage_def_163', 
        exKey: 'GlossaryPage_ex_163' 
    },
    { 
        id: 164, 
        category: '근로', 
        term: '작업지시', 
        en: 'Work Order', 
        vi: 'Chỉ thị công việc', 
        defKey: 'GlossaryPage_def_164', 
        exKey: 'GlossaryPage_ex_164' 
    },
    { 
        id: 165, 
        category: '근로', 
        term: '작업배치', 
        en: 'Work Assignment', 
        vi: 'Bố trí công việc', 
        defKey: 'GlossaryPage_def_165', 
        exKey: 'GlossaryPage_ex_165' 
    },
    { 
        id: 166, 
        category: '근로', 
        term: '안전교육', 
        en: 'Safety Training', 
        vi: 'Đào tạo an toàn', 
        defKey: 'GlossaryPage_def_166', 
        exKey: 'GlossaryPage_ex_166' 
    },
    { 
        id: 167, 
        category: '근로', 
        term: '보호구', 
        en: 'Protective Equipment', 
        vi: 'Thiết bị bảo hộ', 
        defKey: 'GlossaryPage_def_167', 
        exKey: 'GlossaryPage_ex_167' 
    },
    { 
        id: 168, 
        category: '근로', 
        term: '산업안전', 
        en: 'Industrial Safety', 
        vi: 'An toàn lao động', 
        defKey: 'GlossaryPage_def_168', 
        exKey: 'GlossaryPage_ex_168' 
    },
    { 
        id: 169, 
        category: '근로', 
        term: '사고보고', 
        en: 'Accident Reporting', 
        vi: 'Báo cáo tai nạn', 
        defKey: 'GlossaryPage_def_169', 
        exKey: 'GlossaryPage_ex_169' 
    },
    { 
        id: 170, 
        category: '근로', 
        term: '주의사항', 
        en: 'Precautions', 
        vi: 'Mục chú ý', 
        defKey: 'GlossaryPage_def_170', 
        exKey: 'GlossaryPage_ex_170' 
    },
    { 
        id: 171, 
        category: '근로', 
        term: '품질검사', 
        en: 'Quality Inspection', 
        vi: 'Kiểm tra chất lượng', 
        defKey: 'GlossaryPage_def_171', 
        exKey: 'GlossaryPage_ex_171' 
    },
    { 
        id: 172, 
        category: '근로', 
        term: '불량', 
        en: 'Defective Product', 
        vi: 'Hàng lỗi', 
        defKey: 'GlossaryPage_def_172', 
        exKey: 'GlossaryPage_ex_172' 
    },
    { 
        id: 173, 
        category: '근로', 
        term: '반품', 
        en: 'Returned Goods', 
        vi: 'Trả lại hàng', 
        defKey: 'GlossaryPage_def_173', 
        exKey: 'GlossaryPage_ex_173' 
    },
    { 
        id: 174, 
        category: '근로', 
        term: '재작업', 
        en: 'Rework', 
        vi: 'Làm lại', 
        defKey: 'GlossaryPage_def_174', 
        exKey: 'GlossaryPage_ex_174' 
    },
    { 
        id: 175, 
        category: '근로', 
        term: '실적', 
        en: 'Performance Result', 
        vi: 'Thành tích', 
        defKey: 'GlossaryPage_def_175', 
        exKey: 'GlossaryPage_ex_175' 
    },
    { 
        id: 176, 
        category: '근로', 
        term: '생산량', 
        en: 'Production Volume', 
        vi: 'Sản lượng', 
        defKey: 'GlossaryPage_def_176', 
        exKey: 'GlossaryPage_ex_176' 
    },
    { 
        id: 177, 
        category: '근로', 
        term: '목표량', 
        en: 'Target Quantity', 
        vi: 'Sản lượng mục tiêu', 
        defKey: 'GlossaryPage_def_177', 
        exKey: 'GlossaryPage_ex_177' 
    },
    { 
        id: 178, 
        category: '문서', 
        term: '급여명세서', 
        en: 'Payslip / Wage Statement', 
        vi: 'Bảng lương chi tiết', 
        defKey: 'GlossaryPage_def_178', 
        exKey: 'GlossaryPage_ex_178' 
    },
    { 
        id: 179, 
        category: '문서', 
        term: '근로자명부', 
        en: 'Roster of Workers', 
        vi: 'Danh sách người lao động', 
        defKey: 'GlossaryPage_def_179', 
        exKey: 'GlossaryPage_ex_179' 
    },
    { 
        id: 180, 
        category: '문서', 
        term: '출근기록부', 
        en: 'Time Card Register', 
        vi: 'Sổ chấm công bảng ghi chép', 
        defKey: 'GlossaryPage_def_180', 
        exKey: 'GlossaryPage_ex_180' 
    },
    { 
        id: 181, 
        category: '문서', 
        term: '임금대장', 
        en: 'Wage Ledger', 
        vi: 'Sổ lương', 
        defKey: 'GlossaryPage_def_181', 
        exKey: 'GlossaryPage_ex_181' 
    },
    { 
        id: 182, 
        category: '문서', 
        term: '연장근로신청서', 
        en: 'Overtime Application', 
        vi: 'Đơn xin làm thêm giờ', 
        defKey: 'GlossaryPage_def_182', 
        exKey: 'GlossaryPage_ex_182' 
    },
    { 
        id: 183, 
        category: '문서', 
        term: '휴가신청서', 
        en: 'Leave Application', 
        vi: 'Đơn xin nghỉ phép', 
        defKey: 'GlossaryPage_def_183', 
        exKey: 'GlossaryPage_ex_183' 
    },
    { 
        id: 184, 
        category: '문서', 
        term: '사직서', 
        en: 'Letter of Resignation', 
        vi: 'Đơn xin thôi việc', 
        defKey: 'GlossaryPage_def_184', 
        exKey: 'GlossaryPage_ex_184' 
    },
    { 
        id: 185, 
        category: '문서', 
        term: '징계통보서', 
        en: 'Disciplinary Notice', 
        vi: 'Thông báo kỷ luật', 
        defKey: 'GlossaryPage_def_185', 
        exKey: 'GlossaryPage_ex_185' 
    },
    { 
        id: 186, 
        category: '문서', 
        term: '확인서', 
        en: 'Confirmation Letter', 
        vi: 'Giấy xác nhận', 
        defKey: 'GlossaryPage_def_186', 
        exKey: 'GlossaryPage_ex_186' 
    },
    { 
        id: 187, 
        category: '문서', 
        term: '동의서', 
        en: 'Letter of Consent', 
        vi: 'Giấy đồng ý', 
        defKey: 'GlossaryPage_def_187', 
        exKey: 'GlossaryPage_ex_187' 
    },
    { 
        id: 188, 
        category: '문서', 
        term: '신고서', 
        en: 'Report/Notification Form', 
        vi: 'Tờ khai báo', 
        defKey: 'GlossaryPage_def_188', 
        exKey: 'GlossaryPage_ex_188' 
    },
    { 
        id: 189, 
        category: '문서', 
        term: '증명서', 
        en: 'Certificate', 
        vi: 'Giấy chứng nhận', 
        defKey: 'GlossaryPage_def_189', 
        exKey: 'GlossaryPage_ex_189' 
    },
    { 
        id: 190, 
        category: '문서', 
        term: '안내문', 
        en: 'Notice / Information Letter', 
        vi: 'Bản hướng dẫn', 
        defKey: 'GlossaryPage_def_190', 
        exKey: 'GlossaryPage_ex_190' 
    },
    { 
        id: 191, 
        category: '문서', 
        term: '공지사항', 
        en: 'Announcements', 
        vi: 'Thông báo chung', 
        defKey: 'GlossaryPage_def_191', 
        exKey: 'GlossaryPage_ex_191' 
    },
    { 
        id: 192, 
        category: '문서', 
        term: '서약서', 
        en: 'Written Pledge', 
        vi: 'Giấy cam kết', 
        defKey: 'GlossaryPage_def_192', 
        exKey: 'GlossaryPage_ex_192' 
    },
    { 
        id: 193, 
        category: '급여', 
        term: '임금체불', 
        en: 'Delayed Overdue Wage Payment', 
        vi: 'Chậm trả lương', 
        defKey: 'GlossaryPage_def_193', 
        exKey: 'GlossaryPage_ex_193' 
    }
    ];
  // 🌟 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24; // 한 페이지에 6개 노출 (2행 3열)

  // 1. 기존 필터링 로직 수행
  const filteredTerms = mockTerms.filter(item => {
    const matchesSearch = item.term.includes(searchTerm) || item.en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === '전체' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // 2. 🌟 필터링된 결과를 바탕으로 페이지네이션 자르기
  const totalPages = Math.ceil(filteredTerms.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentTermsItems = filteredTerms.slice(indexOfFirstItem, indexOfLastItem);

  // 검색어나 카테고리가 바뀌면 페이지를 다시 1페이지로 리셋
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="glossary-page-container">
      <header className="glossary-header">
        {/* 1. 헤더 번역 */}
        <h1>{t('GlossaryPage_header_title')}</h1>
        <p>{t('GlossaryPage_header_subtitle')}</p>
        
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder={t('GlossaryPage_search_placeholder')} 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </header>

      <div className="category-chips">
        {['전체', '급여', '계약', '근로', '보험', '세금'].map(cat => (
          <button 
            key={cat} 
            className={`chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {/* 2. 카테고리 칩 번역 (전체는 특별히 처리) */}
            {cat === '전체' ? t('GlossaryPage_cat_all') : cat}
          </button>
        ))}
      </div>

      <section className="terms-grid">
        {currentTermsItems.map(item => (
          <div key={item.id} className="term-card" onClick={() => setSelectedTerm(item)}>
            <span className="term-cat-tag">{item.category}</span>
            <h3 className="term-name">{item.term}</h3>
            <div className="term-sub-lang">
              <span>{item.en}</span>
              <span className="divider">|</span>
              <span>{item.vi}</span>
            </div>
          </div>
        ))}
      </section>

      {/* 페이지네이션 생략 (동일) */}
      {totalPages > 1 && (
        <div className="pagination-container">
            {/* 이전 버튼 */}
            <button 
            className="page-arrow-btn" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            >
            &lt;
            </button>
            
            {/* 페이지 번호 버튼 (1~9번 등) */}
            {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
                <button
                key={pageNumber}
                className={`page-number-btn ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNumber)}
                >
                {pageNumber}
                </button>
            );
            })}

            {/* 다음 버튼 */}
            <button 
            className="page-arrow-btn" 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            >
            &gt;
            </button>
        </div>
        )}

      {/* 3. 슬라이드 아웃 패널(상세보기) 번역 */}
      <div className={`detail-drawer ${selectedTerm ? 'open' : ''}`}>
        {selectedTerm && (
          <div className="drawer-inner">
            <button className="close-btn" onClick={() => setSelectedTerm(null)}>✕</button>
            <span className="drawer-cat">{selectedTerm.category}</span>
            <h2>{selectedTerm.term}</h2>
            <div className="drawer-langs">
              <p><strong>EN:</strong> {selectedTerm.en}</p>
              <p><strong>VI:</strong> {selectedTerm.vi}</p>
            </div>
            <div className="drawer-divider"></div>
            
            {/* 🌟 여기가 핵심입니다! 키값을 t() 함수로 감쌌습니다. */}
            <div className="drawer-section">
              <h4>{t('GlossaryPage_drawer_def')}</h4>
              <p>{t(selectedTerm.defKey)}</p>
            </div>
            <div className="drawer-section">
              <h4>{t('GlossaryPage_drawer_ex')}</h4>
              <p className="example-box">{t(selectedTerm.exKey)}</p>
            </div>
          </div>
        )}
      </div>
      {selectedTerm && <div className="drawer-overlay" onClick={() => setSelectedTerm(null)}></div>}
    </div>
  );
}

export default GlossaryPage;