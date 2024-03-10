import { Request, Response, Router } from "express";

import { validate, subjectValidator } from "../../utils/validators";

import { SubjectService } from "./subject.service";

const subjectRouter = Router();

/**
 * @swagger
 * /api/subject/new-subject:
 *   post:
 *     summary: Create a new subject
 *     description: Endpoint to create a new subject.
 *     tags:
 *       - Subject
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subject created successfully
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Subject created
 *               newSubject:
 *                 id: 1
 *                 name: Biology
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Internal server error
 */
subjectRouter.post(
  "/new-subject",
  validate(subjectValidator),
  async (req: Request, res: Response) => {
    try {
      const { name } = req.body;

      const newSubject = await SubjectService.createSubject(name);

      return res
        .status(201)
        .send({ ok: true, message: "Subject created", newSubject });
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .send({ ok: false, message: "Internal server error" });
    }
  }
);

export default subjectRouter;
