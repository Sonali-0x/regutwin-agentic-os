import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";

import { hashPassword, comparePassword } from "../utils/password.js";

import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

export class AuthService {
  static async register(data: any) {
    const existing = await User.findOne({
      email: data.email,
    });

    if (existing) throw new Error("User already exists");

    const hashed = await hashPassword(data.password);

    const user = await User.create({
      ...data,
      password: hashed,
    });

    return user;
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({
      email,
    });

    if (!user) throw new Error("Invalid credentials");

    const valid = await comparePassword(password, user.password);

    if (!valid) throw new Error("Invalid credentials");

    const payload = {
      id: user._id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
