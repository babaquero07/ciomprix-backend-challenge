import { Request, Response, Router } from "express";

import { EvidenceService } from "./evidence.service";
import { validate, newEvidenceValidator } from "../../utils/validators";

import { Format } from "./evidence.model";
import { AuthService } from "../auth/auth.service";

import multer from "multer";

const upload = multer({ dest: "uploads/" });

const evidenceRouter = Router();
const evidenceService = new EvidenceService();

evidenceRouter.post(
  "/upload",
  validate(newEvidenceValidator),
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
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

      const { subjectId } = req.query;
      const { userId } = res.locals.jwtData;

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

export default evidenceRouter;
