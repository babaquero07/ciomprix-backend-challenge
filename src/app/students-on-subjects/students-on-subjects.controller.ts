import { Request, Response, Router } from "express";

import { UserService } from "../user/user.service";
import { SubjectService } from "../subject/subject.service";

import { validate, studentsOnSubjectsValidator } from "../../utils/validators";

import { StudentsOnSubjectsService } from "./students-on-subjects.service";

const studentsOnSubjectsRouter = Router();
const userService = new UserService();

/**
 * @swagger
 * /api/students-on-subjects/register-student:
 *   post:
 *     summary: Register a student for a subject
 *     description: Endpoint to register a student for a subject.
 *     tags:
 *       - StudentsOnSubjects
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student registered successfully in the subject
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Student successfully registered in the subject
 *               studentsOnSubjects:
 *                 id: 1
 *                 studentId: 1
 *                 subjectId: 1
 *       400:
 *         description: Bad Request - Student already registered or exceeds limit
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Student already registered in the subject or exceeds limit
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Unauthorized
 *       403:
 *         description: Forbidden - User not authorized
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Forbidden
 *       404:
 *         description: Not Found - Student or subject not found
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Student or subject not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Internal server error
 */
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
