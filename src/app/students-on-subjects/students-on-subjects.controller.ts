import { Request, Response, Router } from "express";

import { UserService } from "../user/user.service";
import { SubjectService } from "../subject/subject.service";

import { validate, studentsOnSubjectsValidator } from "../../utils/validators";

import { StudentsOnSubjectsService } from "./students-on-subjects.service";

const studentsOnSubjectsRouter = Router();
const userService = new UserService();

studentsOnSubjectsRouter.post(
  "/register-student",
  validate(studentsOnSubjectsValidator),
  async (req: Request, res: Response) => {
    try {
      const { studentId, subjectId } = req.body;

      const student = await userService.getUserById(studentId);
      const subject = await SubjectService.getSubjectById(subjectId);

      if (!student || !subject) {
        return res
          .status(404)
          .json({ message: "Student or subject not found" });
      }

      const studentInSubject =
        await StudentsOnSubjectsService.verifyStudentInSubject(
          studentId,
          subjectId
        );

      if (studentInSubject) {
        return res
          .status(400)
          .json({ message: "Student already registered in the subject" });
      }

      const numberOfSubjects =
        await StudentsOnSubjectsService.getNumberOfSubjectsByStudent(studentId);
      if (numberOfSubjects >= 5) {
        return res
          .status(400)
          .json({ message: "Student already registered in 5 subjects" });
      }

      const studentsOnSubjects =
        await StudentsOnSubjectsService.createStudentOnSubject(
          studentId,
          subjectId
        );

      return res.status(201).json({
        ok: true,
        message: "Student successfully registered in the subject",
        studentsOnSubjects,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default studentsOnSubjectsRouter;
