import { NextFunction, Request, Response } from "express";
import {
  body,
  query,
  ValidationChain,
  validationResult,
} from "express-validator";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);

      if (!result.isEmpty()) {
        break;
      }
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    return res.status(422).json({ errors: errors.array() });
  };
};

export const signupValidator = [
  body("first_name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isString(),
  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .isString(),
  body("email")
    .isEmail()
    .withMessage("Email is required")
    .normalizeEmail()
    .isString(),
  body("dni").notEmpty().withMessage("DNI is required").trim().isString(),
  body("phone").notEmpty().withMessage("Phone is required").trim().isString(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password is required")
    .isString(),
  body("role")
    .notEmpty()
    .withMessage("role is required")
    .trim()
    .isString()
    .isIn(["student", "admin"])
    .withMessage("role must be student or admin"),
  body("birth_date")
    .notEmpty()
    .withMessage("Birth date is required")
    .isISO8601(),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Email is required")
    .normalizeEmail()
    .isString(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password is required")
    .isString(),
];

export const subjectValidator = [
  body("name").notEmpty().withMessage("Name is required").trim().isString(),
];

export const studentsOnSubjectsValidator = [
  body("studentId")
    .notEmpty()
    .withMessage("Student id is required")
    .trim()
    .isString(),
  body("subjectId")
    .notEmpty()
    .withMessage("Subject id is required")
    .trim()
    .isString(),
];

export const newEvidenceValidator = [
  query("subjectId")
    .notEmpty()
    .withMessage("Subject id is required")
    .trim()
    .isString(),
];
