import { Request, Response, Router } from "express";

import { AuthService } from "../auth/auth.service";

import { validate, signupValidator } from "../../utils/validators";

// import { verifyToken } from "../../utils/token-manager";
import { UserService } from "./user.service";

const userService = new UserService();
const userRouter = Router();

userRouter.post(
  "/sign-up",
  validate(signupValidator),
  async (req: Request, res: Response) => {
    try {
      const {
        first_name,
        last_name,
        email,
        dni,
        phone,
        password,
        role,
        birth_date,
      } = req.body;

      const existingUser = await userService.isUserRegister(email);
      if (existingUser) {
        return res
          .status(422)
          .send({ ok: false, message: "User already exists" });
      }

      const newUser = await userService.createUser({
        first_name,
        last_name,
        email,
        dni,
        phone,
        password,
        role,
        birth_date,
      });

      // Clear Cookie
      AuthService.clearCookie(res);

      // Create token and send it as a cookie
      AuthService.createAndSendToken(
        res,
        newUser.id,
        newUser.email,
        newUser.role
      );

      return res
        .status(201)
        .send({ ok: true, message: "User created", newUser });
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .send({ ok: false, message: "Internal server error" });
    }
  }
);

export default userRouter;
