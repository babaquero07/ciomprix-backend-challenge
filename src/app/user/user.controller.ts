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

/**
 * @swagger
 * /api/user/sign-up:
 *   post:
 *     summary: Create a new user
 *     description: Endpoint to create a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               dni:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               birth_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: User created
 *               newUser:
 *                 id: 1
 *                 first_name: John
 *                 last_name: Doe
 *                 email: john.doe@example.com
 *                 dni: 123456789
 *                 phone: "+1234567890"
 *                 role: user
 *                 birth_date: "1990-01-01"
 *       422:
 *         description: User already exists
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: User already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Internal server error
 */

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

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     description: Endpoint for user login.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: User logged in
 *               user:
 *                 id: 1
 *                 first_name: John
 *                 email: john.doe@example.com
 *                 role: user
 *       401:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Invalid password
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Internal server error
 */
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

/**
 * @swagger
 * /api/user/logout:
 *   get:
 *     summary: User logout
 *     description: Endpoint for user logout.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               message: User logged out
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Unauthorized
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Internal server error
 */
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

/**
 * @swagger
 * /api/user/students:
 *   get:
 *     summary: Get students
 *     description: Endpoint to retrieve a list of students.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of students retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               students:
 *                 - id: 1
 *                   first_name: John
 *                   last_name: Doe
 *                   email: john.doe@example.com
 *                   role: student
 *                 - id: 2
 *                   first_name: Jane
 *                   last_name: Smith
 *                   email: jane.smith@example.com
 *                   role: student
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Unauthorized
 *       403:
 *         description: Forbidden - User not authorized
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Forbidden
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Internal server error
 */
userRouter.get(
  "/students",
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

/**
 * @swagger
 * /api/user/students-count:
 *   get:
 *     summary: Get number of students
 *     description: Endpoint to retrieve the total number of students.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Number of students retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               numberOfStudents: 50
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Unauthorized
 *       403:
 *         description: Forbidden - User not authorized
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Forbidden
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Internal server error
 */
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

/**
 * @swagger
 * /api/user/top-students:
 *   get:
 *     summary: Get top students
 *     description: Endpoint to retrieve a list of top-performing students.
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of top-performing students retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               ok: true
 *               topStudents:
 *                 - id: 1
 *                   first_name: John
 *                   last_name: Doe
 *                   email: john.doe@example.com
 *                   grade: A
 *                 - id: 2
 *                   first_name: Jane
 *                   last_name: Smith
 *                   email: jane.smith@example.com
 *                   grade: A+
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Unauthorized
 *       403:
 *         description: Forbidden - User not authorized
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Forbidden
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               ok: false
 *               message: Internal server error
 */
userRouter.get(
  "/top-students",
  verifyToken,
  AuthService.checkAdminAuthorization,
  async (req: Request, res: Response) => {
    try {
      const topStudents = await userService.getTopStudents();

      return res.status(200).send({ ok: true, topStudents });
    } catch (error) {
      console.log(error);

      return res
        .status(500)
        .send({ ok: false, message: "Internal server error" });
    }
  }
);

export default userRouter;
