import { Router } from "express";

import userRoutes from "./user/user.controller";

const routes = Router();

routes.use("/users", userRoutes);

export default routes;
