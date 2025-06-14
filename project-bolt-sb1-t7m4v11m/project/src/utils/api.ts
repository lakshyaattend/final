import axios from 'axios';
import { Teacher, Student, AttendanceRecord } from '../types';

// Google Sheets API key (read-only)
const API_KEY = 'AIzaSyAZJckTpIuvWzZOrNRPrpso96O87TlUmzc';

// Apps Script Web App URL (write access)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjtMzaJyvXMOXiJ1m-dosogZpvKhn5QVbx08F1igPWuPf1DiMUOtIFdDm7-zfw5fvMxA/exec';

// Sheet IDs
const TEACHER_SHEET_ID = "1nR3Q1XRApy79iTxQFg8K_46XUtXXkjgF_gYylpJCQ0k";

export const classSheets = [
  { id: '1', name: 'Class1', sheetId: '1O4jcvI2zRRm7C3v7OjURMVX2wsrczpyzTo50wwc-Ras' },
  { id: '2', name: 'Class2', sheetId: '1g0q03gHKoYjyN_DjtLV-3KfvKQ4crlY-fqvvwABjNd4' },
  { id: '3', name: 'Class3', sheetId: '16Z6Hp5cDscGsJKGIevPxBiLl9U51a5L2erocqiX9vVY' },
  { id: '4', name: 'Class4', sheetId: '1wH2Vn8MOJkg2umCBfbPPrH_coKU_zXB8mrkdAMZMGwc' }
];

async function fetchSheetData(sheetId: string, range: string) {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${API_KEY}`;
    const response = await axios.get(url);
    return response.data.values || [];
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw new Error('Failed to fetch sheet data');
  }
}

export async function getTeachers(): Promise<Teacher[]> {
  const data = await fetchSheetData(TEACHER_SHEET_ID, 'Sheet1!A2:D');
  return data.map((row: string[]) => ({
    id: row[0] || '',
    name: row[1] || '',
    loginId: row[2] || '',
    password: row[3] || ''
  }));
}

export async function authenticateTeacher(loginId: string, password: string): Promise<Teacher | null> {
  const teachers = await getTeachers();
  return teachers.find(t => t.loginId === loginId && t.password === password) || null;
}

export async function getStudents(classId: string): Promise<Student[]> {
  const classData = classSheets.find(cls => cls.id === classId);
  if (!classData) {
    throw new Error('Class not found');
  }

  try {
    console.log('Fetching students for class:', classData.name);
    const data = await fetchSheetData(classData.sheetId, `${classData.name}!A2:B`);
    console.log('Raw student data:', data);

    return data
      .map((row: string[], index: number) => ({
        id: (index + 1).toString(),
        name: row[0] || '',
        className: classData.name
      }))
      .filter(student => student.name !== '');
  } catch (error) {
    console.error('Error fetching students:', error);
    throw new Error(`Failed to fetch students for ${classData.name}`);
  }
}

export async function submitAttendance(records: AttendanceRecord[]): Promise<void> {
  try {
    const response = await axios.post(APPS_SCRIPT_URL, {
      action: 'submitAttendance',
      records: records
    });

    const result = response.data;
    if (!result.success) {
      throw new Error(result.message || 'Unknown error');
    }

    console.log('Attendance submitted successfully:', result.message);
  } catch (error) {
    console.error('Error submitting attendance:', error);
    throw new Error('Failed to submit attendance records');
  }
}
