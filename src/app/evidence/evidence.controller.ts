import { Request, Response, Router } from "express";

import { EvidenceService } from "./evidence.service";
import {
  validate,
  newEvidenceValidator,
  countEvidencesValidator,
} from "../../utils/validators";

import { Format } from "./evidence.model";
import { AuthService } from "../auth/auth.service";

import multer from "multer";
import { StudentsOnSubjectsService } from "../students-on-subjects/students-on-subjects.service";

const upload = multer({ dest: "uploads/" });

const evidenceRouter = Router();
const evidenceService = new EvidenceService();

evidenceRouter.post(
  "/upload",
  validate(newEvidenceValidator),
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const { subjectId } = req.query;
      const { userId } = res.locals.jwtData;

      // Check if the student is already registered in the subject
      const isStudentOnSubject =
        await StudentsOnSubjectsService.verifyStudentInSubject(
          userId,
          subjectId.toString()
        );
      if (!isStudentOnSubject) {
        return res
          .status(400)
          .json({ message: "Student is not registered in the subject" });
      }

      // Check file format and number of evidences uploaded on the subject
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { originalname: file_name, mimetype, size } = file;
      const format = mimetype.split("/")[1];

      if (format !== "png" && format !== "jpg" && format !== "pdf") {
        return res
          .status(400)
          .json({ message: "Invalid file format. Must be png, jpg or pdf!" });
      }

      const numberOfEvidencesOnSubject =
        await evidenceService.getNumberOfEvidencesOnSubject(
          userId,
          subjectId.toString()
        );

      if (numberOfEvidencesOnSubject >= 5) {
        return res.status(422).json({
          message: "You can't upload more than 5 evidences for a subject",
        });
      }

      // Create evidence
      const newEvidence = await evidenceService.createEvidence({
        file_name,
        size: size.toString(),
        format: format as Format,
        userId,
        subjectId: subjectId.toString(),
      });

      return res
        .status(201)
        .json({ ok: true, message: "Evidence created", newEvidence });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

evidenceRouter.get(
  "/",
  AuthService.checkAdminAuthorization,
  async (req: Request, res: Response) => {
    try {
      const evidences = await evidenceService.getAllEvidences();

      return res.status(200).json({ ok: true, evidences });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

evidenceRouter.get(
  "/count-by-subject/:subjectId",
  AuthService.checkAdminAuthorization,
  validate(countEvidencesValidator),
  async (req: Request, res: Response) => {
    try {
      const { subjectId } = req.params;

      const numberOfEvidences =
        await evidenceService.getNumberOfEvidencesBySubject(subjectId);

      return res.status(200).json({ ok: true, numberOfEvidences });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

evidenceRouter.get(
  "/percentage-by-file-type",
  AuthService.checkAdminAuthorization,
  async (req: Request, res: Response) => {
    try {
      const percentageByFileType =
        await evidenceService.getPercentageByFileType();

      return res.status(200).json({ ok: true, percentageByFileType });
    } catch (error) {
      console.log(error);

      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

export default evidenceRouter;
