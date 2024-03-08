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
}
