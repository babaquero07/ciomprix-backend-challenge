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
}
