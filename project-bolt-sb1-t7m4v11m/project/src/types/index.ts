export interface Teacher {
  id: string;
  name: string;
  loginId: string;
  password: string;
}

export interface Student {
  id: string;
  name: string;
  class: string;
}

export interface AttendanceRecord {
  studentName: string;
  className: string;
  date: string;
  status: 'P' | 'A';
  teacherId: string;
  teacherName: string;
}

export interface AuthContextType {
  currentTeacher: Teacher | null;
  isAuthenticated: boolean;
  login: (loginId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface ClassData {
  id: string;
  name: string;
  sheetId: string;
  attendanceSheetId: string;
}