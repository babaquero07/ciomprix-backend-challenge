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
}
