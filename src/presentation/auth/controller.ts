import { Request, Response } from "express";

import { AuthService } from "../services/auth.service";
import { CustomError } from "../../domain/errors/custom.error";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { loginUserDto } from "../../domain/dtos/auth/loginUserDto";

export class AuthController {
  //DI

  constructor(public readonly authService: AuthService) {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }

  register = (req: Request, res: Response) => {
    const [error, registerDtos] = RegisterUserDto.create(req.body);

    if (error) return res.status(400).json({ error });

    this.authService
      .register(registerDtos!)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  login = (req: Request, res: Response) => {
    const [error, loginDtos] = loginUserDto.create(req.body);

    if (error) return res.status(400).json({ error });

    this.authService
      .login(loginDtos!)
      .then((user) => res.json({ user }))
      .catch((error) => this.handleError(error, res));
  };

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;
    this.authService
      .validateEmail(token)
      .then(() => res.json({ message: "Email validated" }))
      .catch((error) => this.handleError(error, res));
  };
}
