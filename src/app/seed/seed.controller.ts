import { Request, Response, Router } from "express";
import { SeedService } from "./seed.service";

import { config } from "dotenv";

config();

const seedRouter = Router();

seedRouter.get("/", async (req: Request, res: Response) => {
  try {
    (async () => {
      if (process.env.NODE_ENV === "production") return;

      await SeedService.seedDatabase();
    })();

    return res.send({ ok: true, message: "Database seeded" });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .send({ ok: false, message: "Internal server error" });
  }
});

export default seedRouter;
