import prisma from "../../lib/prisma";

export class StudentsOnSubjectsService {
  static createStudentOnSubject(studentId: string, subjectId: string) {
    try {
      const newStudentOnSubject = prisma.studentsOnSubjects.create({
        data: {
          student: { connect: { id: studentId } },
          subject: { connect: { id: subjectId } },
        },
      });

      return newStudentOnSubject;
    } catch (error) {
      console.log(error);

      throw new Error("Error creating student on subject");
    }
  }

  static async verifyStudentInSubject(studentId: string, subjectId: string) {
    const existingRelation = await prisma.studentsOnSubjects.findUnique({
      where: {
        studentId_subjectId: {
          studentId,
          subjectId,
        },
      },
    });

    return !!existingRelation;
  }

  static async getNumberOfSubjectsByStudent(studentId: string) {
    try {
      const numberOfSubjects = await prisma.studentsOnSubjects.count({
        where: {
          studentId: studentId,
        },
      });

      return numberOfSubjects;
    } catch (error) {
      console.log(error);

      throw new Error("Error getting number of subjects by student");
    }
  }
}
