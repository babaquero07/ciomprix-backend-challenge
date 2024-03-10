import prisma from "../../lib/prisma";

import { InitialData } from "./seed";

export class SeedService {
  static deleteAllData = async () => {
    try {
      await prisma.evidence.deleteMany();
      await prisma.studentsOnSubjects.deleteMany();
      await prisma.subject.deleteMany();
      await prisma.user.deleteMany();
    } catch (error) {
      console.log(error);

      throw new Error("Error while deleting data");
    }
  };

  static async seedDatabase() {
    try {
      await this.deleteAllData();

      // Users
      await prisma.user.createMany({
        data: InitialData.users,
      });

      // Subjects
      await prisma.subject.createMany({
        data: InitialData.subjects,
      });

      // Students on Subjects
      await prisma.studentsOnSubjects.createMany({
        data: InitialData.studentsOnSubjects,
      });

      // Evidences
      await prisma.evidence.createMany({
        data: InitialData.evidences,
      });
    } catch (error) {
      console.log(error);

      throw new Error("Error while seeding database");
    }
  }
}
