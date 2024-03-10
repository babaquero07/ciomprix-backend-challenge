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

/**
 * @swagger
 * /api/evidence/upload:
 *   post:
 *     summary: Upload evidence
 *     description: Endpoint to upload evidence for a subject.
 *     tags:
 *       - Evidence
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *             required:
 *               - file
 *     parameters:
 *       - in: query
 *         name: subjectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the subject for which evidence is being uploaded
 *     responses:
 *       201:
 *         description: Evidence uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: Evidence created
 *               newEvidence:
 *                 id: 1
 *                 file_name: "evidence1.pdf"
 *                 size: "1024"
 *                 format: "pdf"
 *                 userId: 1
 *                 subjectId: "subject123"
 *       400:
 *         description: Bad Request - Invalid file format or no file uploaded
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Invalid file format. Must be png, jpg, or pdf! (or) No file uploaded
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Unauthorized
 *       422:
 *         description: Unprocessable Entity - Exceeded the limit of 5 evidences for a subject
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: You can't upload more than 5 evidences for a subject
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Internal server error
 */
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

/**
 * @swagger
 * /api/evidence:
 *   get:
 *     summary: Get all evidences
 *     description: Endpoint to retrieve all evidences.
 *     tags:
 *       - Evidence
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Evidences retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               evidences:
 *                 - id: 1
 *                   file_name: "evidence1.pdf"
 *                   size: "1024"
 *                   format: "pdf"
 *                   userId: 1
 *                   subjectId: "subject123"
 *                 - id: 2
 *                   file_name: "evidence2.jpg"
 *                   size: "2048"
 *                   format: "jpg"
 *                   userId: 2
 *                   subjectId: "subject456"
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

/**
 * @swagger
 * /api/evidence/count-by-subject/{subjectId}:
 *   get:
 *     summary: Get number of evidences by subject
 *     description: Endpoint to retrieve the number of evidences for a specific subject.
 *     tags:
 *       - Evidence
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the subject for which the number of evidences is being retrieved
 *     responses:
 *       200:
 *         description: Number of evidences retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               numberOfEvidences: 10
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

/**
 * @swagger
 * /api/evidence/percentage-by-file-type:
 *   get:
 *     summary: Get percentage of evidences by file type
 *     description: Endpoint to retrieve the percentage of evidences based on their file types.
 *     tags:
 *       - Evidence
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Percentage of evidences retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               percentageByFileType:
 *                 pdf: 50
 *                 png: 30
 *                 jpg: 20
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
