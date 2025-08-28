export interface Department {
  id: string;
  name: string;
}

export interface Position {
    id: string;
    name: string;
}

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  country?: string;
  zipCode?: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  addressLine1?: string;
  addressCity?: string;
  addressCountry?: string;
  status: EmployeeStatus;
  dateOfBirth?: string; 
  hireDate: string;
  createdAt: string;
  updatedAt: string;
  
  departmentId: string;
  department: Department;
  positionId: string;
  position: Position;
}

export interface User {
    id: string;
    username: string;
    password: string;
    role: string;
    employeeId: string;
}

export interface Leave {
    id: string;
    typeId: string;
    startDate: string;
    endDate: string;
    reason?: string | null | undefined;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";
    createdAt: string;
}