import prisma from "../../lib/prisma";
import bcryptjs from "bcryptjs";

import { User } from "./user.model";

export class UserService {
  async isUserRegister(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async createUser(user: User) {
    try {
      const newUser = await prisma.user.create({
        data: {
          ...user,
          password: bcryptjs.hashSync(user.password, 10),
        },
      });

      const { password, ...userWithoutPassword } = newUser;

      return userWithoutPassword;
    } catch (error) {
      console.log(error);

      throw new Error("Error creating user");
    }
  }

  async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          role: true,
        },
      });

      return user;
    } catch (error) {
      console.log(error);

      throw new Error("Error getting user with id: " + id);
    }
  }

  async getStudents() {
    try {
      const students = await prisma.user.findMany({
        where: {
          role: "student",
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          dni: true,
          phone: true,
          birth_date: true,
        },
        orderBy: {
          last_name: "asc",
        },
      });

      return students;
    } catch (error) {
      console.log(error);

      throw new Error("Error getting students");
    }
  }

  async getNumberOfStudents() {
    try {
      const numberOfStudents = await prisma.user.count({
        where: {
          role: "student",
        },
      });

      return numberOfStudents;
    } catch (error) {
      console.log(error);

      throw new Error("Error getting number of students");
    }
  }

  async getTopStudents() {
    try {
      const topStudents = await prisma.user.findMany({
        where: {
          role: "student",
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          Evidence: {
            select: {
              id: true,
              file_name: true,
              format: true,
            },
          },
        },
        orderBy: {
          Evidence: {
            _count: "desc",
          },
        },
        take: 10,
      });

      const formatedTopStudents = topStudents.map((student) => {
        const { Evidence, ...rest } = student;

        return {
          ...rest,
          evidences: Evidence,
          numberOfEvidences: Evidence.length,
        };
      });

      return formatedTopStudents;
    } catch (error) {
      console.log(error);

      throw new Error("Error getting top students");
    }
  }
}
