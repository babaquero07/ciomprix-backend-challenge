import { Request, Response, Router } from "express";

import { validate, subjectValidator } from "../../utils/validators";

import { SubjectService } from "./subject.service";

const subjectRouter = Router();

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
