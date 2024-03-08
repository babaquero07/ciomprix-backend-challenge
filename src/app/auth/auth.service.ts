import { Response } from "express";

import { COOKIE_NAME } from "../../utils/constants";
import { createToken } from "../../utils/token-manager";
import bcryptjs from "bcryptjs";

export class AuthService {
  static clearCookie = (res: Response) => {
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      signed: true,
    });
  };

  static createAndSendToken = (
    res: Response,
    userId: string,
    email: string,
    role: string
  ) => {
    const expiresInMinutes = 5;
    const token = createToken(userId, email, role, `${expiresInMinutes}m`);

    const expires = new Date();
    // Convertir minutos a milisegundos y agregar a la fecha actual
    expires.setTime(expires.getTime() + expiresInMinutes * 60 * 1000);

    // Set the new cookie
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });
  };

  static isPasswordValid(password: string, userPassword: string) {
    return bcryptjs.compareSync(password, userPassword);
  }
}
