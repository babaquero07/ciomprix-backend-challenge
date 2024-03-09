import { Request, Response, Router } from "express";

import { AuthService } from "../auth/auth.service";
import { UserService } from "./user.service";

import {
  validate,
  signupValidator,
  loginValidator,
} from "../../utils/validators";

import { verifyToken } from "../../utils/token-manager";

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

userRouter.post(
  "/login",
  validate(loginValidator),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await userService.isUserRegister(email);
      if (!user) {
        return res.status(404).send({ ok: false, message: "User not found" });
      }

      const isPasswordValid = AuthService.isPasswordValid(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).send({ ok: false, message: "Invalid password" });
      }

      // Clear Cookie
      AuthService.clearCookie(res);

      // Create token and send it as a cookie
      AuthService.createAndSendToken(res, user.id, user.email, user.role);

      return res.status(200).send({
        ok: true,
        message: "User logged in",
        user: {
          id: user.id,
          first_name: user.first_name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .send({ ok: false, message: "Internal server error" });
    }
  }
);

userRouter.get("/logout", verifyToken, async (req: Request, res: Response) => {
  try {
    // User token check
    const { userId } = res.locals.jwtData;
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).send({ ok: false, message: "User not found" });
    }

    // Clear Cookie
    AuthService.clearCookie(res);

    return res.status(200).send({ ok: true, message: "User logged out" });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .send({ ok: false, message: "Internal server error" });
  }
});

userRouter.get(
  "/",
  verifyToken,
  AuthService.checkAdminAuthorization,
  async (req: Request, res: Response) => {
    try {
      const students = await userService.getStudents();

      return res.status(200).send({ ok: true, students });
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .send({ ok: false, message: "Internal server error" });
    }
  }
);

userRouter.get(
  "/students-count",
  verifyToken,
  AuthService.checkAdminAuthorization,
  async (req: Request, res: Response) => {
    try {
      const numberOfStudents = await userService.getNumberOfStudents();

      return res.status(200).send({ ok: true, numberOfStudents });
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .send({ ok: false, message: "Internal server error" });
    }
  }
);

export default userRouter;
