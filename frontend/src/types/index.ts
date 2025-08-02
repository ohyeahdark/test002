export interface Department {
  id: string;
  name: string;
}

export interface Position {
    id: string;
    name: string;
    departmentId: string;
    department?: { 
        name: string;
    }
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
  status: EmployeeStatus;
  dateOfBirth?: string; 
  hireDate: string;
  createdAt: string;
  updatedAt: string;
  
  // Cập nhật quan trọng
  departmentId: string;
  department: Department; // Prisma sẽ trả về object lồng nhau này
  positionId: string;
  position: Position; // Prisma sẽ trả về object lồng nhau này
}