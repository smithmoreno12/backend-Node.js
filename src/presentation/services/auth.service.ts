import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, UserEntity } from "../../domain";
import { loginUserDto } from "../../domain/dtos/auth/loginUserDto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { EmailService } from "./email.service";

export class AuthService {
  //DI

  constructor(private readonly emailService: EmailService) {}

  public async register(RegisterUserDto: RegisterUserDto) {
    const existeUser = await UserModel.findOne({
      email: RegisterUserDto.email,
    });
    if (existeUser) throw CustomError.badRequest("Email already exists");

    try {
      const user = new UserModel(RegisterUserDto);

      // Encriptar contraseña
      user.password = bcryptAdapter.hash(RegisterUserDto.password);
      await user.save();

      // Email de confirmacion
      await this.sendEmailValidateEmail(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);
      const token = await JwtAdapter.generateToken({
        id: user.id,
      });
      if (!token) throw CustomError.badRequest("Error while creating JWT ");
      return {
        user: { ...userEntity },
        token: token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async login(loginUserDto: loginUserDto) {
    try {
      const user = await UserModel.findOne({ email: loginUserDto.email });
      if (!user) throw CustomError.badRequest("Email or password is incorrect");

      const isMatching = bcryptAdapter.compare(
        // 👈 await
        loginUserDto.password,
        user.password,
      );
      if (!isMatching) throw CustomError.badRequest("Password is not valid");

      const { password, ...userEntity } = UserEntity.fromObject(user);
      const token = await JwtAdapter.generateToken({
        id: user.id,
      });
      if (!token) throw CustomError.badRequest("Error while creating JWT ");

      return {
        user: { ...userEntity },
        token: token,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
  private sendEmailValidateEmail = async (email: string) => {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServer("Error getting token");

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
      <div>
        <h1>Account confirmation</h1>
        <p>Click <a href="${link}">${link}</a>to confirm your account</p>
      </div>
    `;

    const option = {
      to: email,
      subject: "Account confirmation",
      htmlBody: html,
    };
    const isSent = await this.emailService.sendEmail(option);
    if (!isSent) throw CustomError.internalServer("Error sending email");
    return true;
  };
  public validateEmail = async (token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized("Invalid token");

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServer("Email not token");
    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.internalServer("Email no Exists");
    user.emailVerified = true;
    await user.save();
    return true;
  };
}
