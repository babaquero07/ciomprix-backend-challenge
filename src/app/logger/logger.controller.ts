import { Request, Response, Router } from "express";

import { getLastLogs } from "./logger.service";

const loggerRouter = Router();

loggerRouter.get("/logs-file", async (req: Request, res: Response) => {
  try {
    const logsFile = await getLastLogs();

    return res.type("text/plain").send(logsFile);
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .send({ ok: false, message: "Internal server error" });
  }
});

export default loggerRouter;
