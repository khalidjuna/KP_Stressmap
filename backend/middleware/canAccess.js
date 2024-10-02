import { StatusCodes } from "http-status-codes";
import * as Role from "../models/RolesModel.js";
// import * as user from "../models/UserModel.js";

export const canAccess = (allowedRoles) => {
  return async (req, res, next) => {
    const { role_id } = req.user;
    const role = await Role.Model.findById(role_id);
    if (!allowedRoles.includes(role.name)) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message:
          "Access Denied: You do not have permission to access this resource",
      });
    }
    next();
  };
};
