import { Router } from "express";

import userRoutes from "./user/user.controller";
import subjectRouter from "./subject/subject.controller";
import studentsOnSubjectsRouter from "./students-on-subjects/students-on-subjects.controller";
import evidenceRouter from "./evidence/evidence.controller";

import { verifyToken } from "../utils/token-manager";
import { AuthService } from "./auth/auth.service";

const routes = Router();

routes.use("/users", userRoutes);
routes.use(
  "/subjects",
  verifyToken,
  AuthService.checkAdminAuthorization,
  subjectRouter
);
routes.use(
  "/students-on-subjects",
  verifyToken,
  AuthService.checkAdminAuthorization,
  studentsOnSubjectsRouter
);
routes.use("/evidences", verifyToken, evidenceRouter);

export default routes;
