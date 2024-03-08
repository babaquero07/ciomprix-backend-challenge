import { Router } from "express";

import userRoutes from "./user/user.controller";
import subjectRouter from "./subject/subject.controller";

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

export default routes;
