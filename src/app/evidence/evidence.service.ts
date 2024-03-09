import { Evidence } from "./evidence.model";
import prisma from "../../lib/prisma";

export class EvidenceService {
  async createEvidence(evidence: Evidence) {
    try {
      const newEvidence = await prisma.evidence.create({
        data: {
          ...evidence,
        },
      });

      return newEvidence;
    } catch (error) {
      console.log(error);

      throw new Error("Error creating evidence");
    }
  }

  async getNumberOfEvidencesOnSubject(userId: string, subjectId: string) {
    try {
      const numberOfEvidences = await prisma.evidence.count({
        where: {
          userId,
          subjectId,
        },
      });

      return numberOfEvidences;
    } catch (error) {
      console.log(error);

      throw new Error("Error getting number of evidences");
    }
  }

  async getAllEvidences() {
    try {
      const evidences = await prisma.evidence.findMany({
        orderBy: [
          {
            user: {
              email: "asc",
            },
          },
          {
            upload_date: "asc",
          },
        ],
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      });

      return evidences;
    } catch (error) {
      console.log(error);

      throw new Error("Error getting evidences");
    }
  }
}
