import prisma from "../../lib/prisma";

export class SubjectService {
  static createSubject(name: string) {
    try {
      const newSubject = prisma.subject.create({
        data: {
          name,
        },
      });

      return newSubject;
    } catch (error) {
      console.log(error);
    }
  }
}
