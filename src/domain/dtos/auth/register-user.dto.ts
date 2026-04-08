import { regularExps } from "../../../config";

export class RegisterUserDto {
  constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}
  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = object;
    if (!name) return ["Missing name"];
    if (name.trim().length < 2) return ["Name must be at least 2 characters"];
    if (!email) return ["Missing email"];
    if (!regularExps.email.test(email)) return ["Email is not valid"];
    if (!password) return ["Missing password"];
    if (password.length < 6) return ["Password must be at least 6 characters"];
    return [undefined, new RegisterUserDto(name.trim(), email, password)];
  }
}
