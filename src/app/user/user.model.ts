type Role = "student" | "admin";

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  dni: string;
  phone: string;
  password: string;
  role: Role;
  birth_date: Date;
}
