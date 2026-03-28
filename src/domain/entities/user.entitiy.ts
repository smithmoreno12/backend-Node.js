import { CustomError } from "../errors/custom.error";

export class UserEntity {
  constructor(
    public id: string,
    public email: string,
    public emailVerified: boolean,
    public password: string,
    public role: [string],
    public img?: string,
  ) {}
  static fromObject(object: { [key: string]: any }) {
    const { id, _id, email, emailVerified, password, role, img } = object;
    if (!_id && !id) {
      throw CustomError.badRequest("Missing id");
    }

    if (!email) {
      throw CustomError.badRequest("Missing email");
    }

    if (emailVerified === undefined) {
      throw CustomError.badRequest("Missing emailVerified");
    }
    if (!password) {
      throw CustomError.badRequest("Missing password");
    }
    if (!role) {
      throw CustomError.badRequest("Missing role");
    }
    return new UserEntity(id || _id, email, emailVerified, password, role, img);
  }
}
