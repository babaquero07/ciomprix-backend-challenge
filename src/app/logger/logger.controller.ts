import { Request, Response, Router } from "express";

import { getLastLogs } from "./logger.service";

const loggerRouter = Router();

/**
 * @swagger
 * /api/logger/logs-file:
 *   get:
 *     summary: Get logs file
 *     description: Endpoint to retrieve the latest logs file.
 *     tags:
 *       - Logger
 *     security:
 *     - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logs file retrieved successfully
 *         content:
 *           text/plain:
 *             example: |
 *               [2022-01-01 12:00:00] INFO: Sample log message
 *               [2022-01-01 12:01:00] ERROR: Another log message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Internal server error
 */
loggerRouter.get("/logs-file", async (req: Request, res: Response) => {
  try {
    // Retrieve the latest logs file
    const logsFile = await getLastLogs();

    // Example of successful response
    return res.type("text/plain").send(logsFile);
  } catch (error) {
    // Error handling

    // Example of internal server error
    console.log(error);
    return res
      .status(500)
      .send({ ok: false, message: "Internal server error" });
  }
});

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
