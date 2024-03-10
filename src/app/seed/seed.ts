import bcryptjs from "bcryptjs";

interface SeedUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  dni: string;
  phone: string;
  password: string;
  role: "admin" | "student";
  birth_date: string;
}

interface SeedSubject {
  id: string;
  name: string;
}

interface SeedEvidence {
  file_name: string;
  size: string;
  format: "jpg" | "png" | "pdf";
  userId: string;
  subjectId: string;
}

interface SeedStudentOnSubject {
  studentId: string;
  subjectId: string;
}

interface SeedData {
  users: SeedUser[];
  subjects: SeedSubject[];
  evidences: SeedEvidence[];
  studentsOnSubjects: SeedStudentOnSubject[];
}

export const InitialData: SeedData = {
  users: [
    {
      id: "edb3ae19-356c-49d5-a3d4-8273db2fe8aa",
      first_name: "Alexander",
      last_name: "Baquero",
      email: "alexanderbaquero@gmail.com",
      dni: "1012458794",
      phone: "3058904785",
      password: bcryptjs.hashSync("@Alexander-123"),
      role: "admin",
      birth_date: "1996-11-07T05:00:00.000Z",
    },
    {
      id: "2a5571cb-1f7b-49a3-9964-d43074bc46b1",
      first_name: "Juan",
      last_name: "Perez",
      email: "juanperez@gmail.com",
      dni: "1037489257",
      phone: "3102524789",
      password: bcryptjs.hashSync("@Juan-123"),
      role: "student",
      birth_date: "1985-11-27T05:00:00.000Z",
    },
    {
      id: "ccaf34cd-5dff-4cb0-884d-8ed9469c78a5",
      first_name: "Sara",
      last_name: "Gomez",
      email: "saragomez@gmail.com",
      dni: "1032489362",
      phone: "3228561129",
      password: bcryptjs.hashSync("@Sara-123"),
      role: "student",
      birth_date: "2001-08-03T05:00:00.000Z",
    },
  ],
  subjects: [
    {
      id: "49ecf5ce-7b5b-4a74-95ae-46717e7c8abf",
      name: "Math",
    },
    {
      id: "42a81537-fe8f-4a24-97b5-eb03afa7a03c",
      name: "Science",
    },
    {
      id: "9ad59e3c-59e7-44f2-b044-d6859c5ac14f",
      name: "Social Studies",
    },
  ],
  evidences: [
    {
      file_name: "evidence1.png",
      size: "1024",
      format: "png",
      userId: "2a5571cb-1f7b-49a3-9964-d43074bc46b1",
      subjectId: "49ecf5ce-7b5b-4a74-95ae-46717e7c8abf",
    },
    {
      file_name: "evidence2.jpg",
      size: "49234",
      format: "jpg",
      userId: "ccaf34cd-5dff-4cb0-884d-8ed9469c78a5",
      subjectId: "49ecf5ce-7b5b-4a74-95ae-46717e7c8abf",
    },
    {
      file_name: "evidence3.pdf",
      size: "89759",
      format: "pdf",
      userId: "2a5571cb-1f7b-49a3-9964-d43074bc46b1",
      subjectId: "42a81537-fe8f-4a24-97b5-eb03afa7a03c",
    },
    {
      file_name: "evidence4.jpg",
      size: "1024",
      format: "jpg",
      userId: "ccaf34cd-5dff-4cb0-884d-8ed9469c78a5",
      subjectId: "9ad59e3c-59e7-44f2-b044-d6859c5ac14f",
    },
  ],
  studentsOnSubjects: [
    {
      studentId: "2a5571cb-1f7b-49a3-9964-d43074bc46b1",
      subjectId: "49ecf5ce-7b5b-4a74-95ae-46717e7c8abf",
    },
    {
      studentId: "2a5571cb-1f7b-49a3-9964-d43074bc46b1",
      subjectId: "42a81537-fe8f-4a24-97b5-eb03afa7a03c",
    },
    {
      studentId: "2a5571cb-1f7b-49a3-9964-d43074bc46b1",
      subjectId: "9ad59e3c-59e7-44f2-b044-d6859c5ac14f",
    },
    {
      studentId: "ccaf34cd-5dff-4cb0-884d-8ed9469c78a5",
      subjectId: "49ecf5ce-7b5b-4a74-95ae-46717e7c8abf",
    },
    {
      studentId: "ccaf34cd-5dff-4cb0-884d-8ed9469c78a5",
      subjectId: "42a81537-fe8f-4a24-97b5-eb03afa7a03c",
    },
    {
      studentId: "ccaf34cd-5dff-4cb0-884d-8ed9469c78a5",
      subjectId: "9ad59e3c-59e7-44f2-b044-d6859c5ac14f",
    },
  ],
};
