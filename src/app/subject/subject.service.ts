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

  static async getSubjectById(id: string) {
    const subject = await prisma.subject.findUnique({
      where: {
        id,
      },
    });

    return subject;
  }
}
