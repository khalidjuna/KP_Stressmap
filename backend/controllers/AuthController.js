import { StatusCodes } from "http-status-codes";
import * as jwt from "../utils/jwt.js";

import * as User from "../models/UserModel.js";
import * as Role from "../models/RolesModel.js";
import * as RevokeToken from "../models/RevokeTokenModel.js";

export const register = async (req, res) => {
  const {
    role_id,
    name,
    email,
    password,
    confirmPassword,
    position,
    institution,
    city,
    country,
    image_url,
  } = req.body;

  // Validasi password
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password do not match!" });
  }

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.Model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email sudah terdaftar!" });
    }

    // Buat user baru
    const inserted = await User.createNew({
      role_id,
      name,
      email,
      password,
      position,
      institution,
      city,
      country,
      image_url,
    });

    return res.status(StatusCodes.CREATED).json({
      message: "User registered successfully",
      user: inserted,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Error registering user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    if (typeof user == "string") {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: user });
    }
    const { role_id, _id } = user;
    const user_id = _id.toString();

    const { token, jti } = jwt.generateToken({
      role_id,
      user_id,
    });

    await RevokeToken.createNew({
      user_id,
      jwt_id: jti,
    });

    return res.status(StatusCodes.OK).json({
      user,
      token,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const init = async (req, res) => {
  const { role_id, user_id } = req.user;

  const user = await User.Model.findById(user_id);
  const role = await Role.Model.findById(role_id);

  return res.status(StatusCodes.OK).json({
    name: user.name,
    email: user.email,
    role: role.name,
    position: user.position,
    institution: user.institution,
    city: user.city,
    country: user.country,
  });
};

export const logout = async (req, res) => {
  const { user_id } = req.user;

  await RevokeToken.Model.deleteOne({ user_id });

  return res.status(StatusCodes.OK).json({
    message: "OK",
  });
};
