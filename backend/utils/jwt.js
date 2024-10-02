import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { ACCESS_TOKEN_SECRET } from "../env.js";

export function generateToken(payload) {
  const jti = uuidv4();
  const token = jwt.sign({ ...payload, jti }, ACCESS_TOKEN_SECRET);
  return { token, jti };
}

export function validateToken(token) {
  try {
    if (String(token).includes("Bearer")) {
      token = String(token).split(" ")[1];
    }
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return { valid: true, decoded };
  } catch (err) {
    return { valid: false, message: err.message };
  }
}
