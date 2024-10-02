import * as RevokeToken from "../models/RevokeTokenModel.js";
import { StatusCodes } from "http-status-codes";
import * as jwt from "../utils/jwt.js";

const verifyToken = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Access Denied: No Token Provided!" });
  }

  try {
    let decoded = jwt.validateToken(token);
    if (!decoded.valid) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: decoded.message });
    }
    decoded = decoded.decoded;
    console.log({ decoded });

    const revoke_token = await RevokeToken.findByJti(decoded.jti);
    if (typeof revoke_token == "string") {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: revoke_token });
    }

    const now = new Date();
    if (revoke_token.expired_at < now) {
      await RevokeToken.deleteByJti(decoded.jti);
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Token Expired: Please log in again!" });
    }

    req.user = decoded; // Menambahkan klaim JWT ke request
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};

export default verifyToken;
