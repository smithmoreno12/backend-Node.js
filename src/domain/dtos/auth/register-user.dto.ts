import { regularExps } from "../../../config";

export class RegisterUserDto {
  constructor(
    public email: string,
    public password: string,
  ) {}
  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { email, password } = object;
    if (!email) return ["Missing email"];
    if (!regularExps.email.test(email)) return ["Email is not valid"];
    if (!password) return ["Missing password"];
    if (password.length < 6) return ["Password must be at least 6 characters"];
    return [undefined, new RegisterUserDto(email, password)];
  }
}
