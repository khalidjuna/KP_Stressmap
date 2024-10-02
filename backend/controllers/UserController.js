import { StatusCodes } from "http-status-codes";
import * as User from "../models/UserModel.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Manually create __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "..", "uploads")); // Adjust this path to where you want to store images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }).single("image"); // Expecting image to be sent with key 'image'

export const addUser = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "File upload failed: " + err.message,
      });
    } else if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "An unexpected error occurred: " + err.message,
      });
    }

    const userData = req.body;

    // Handle image upload
    if (req.file) {
      userData.image_url = req.file.path; // Store the path of the uploaded image
    }

    try {
      const user = await User.createNew(userData);
      return res.status(StatusCodes.CREATED).json({
        message: "Register Success! Please Login",
        user,
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    return res.status(StatusCodes.OK).json(users);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.deleteUser(req.params.id);
    return res.status(StatusCodes.OK).json(user);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "File upload failed: " + err.message,
      });
    } else if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "An unexpected error occurred: " + err.message,
      });
    }

    const updateData = req.body;

    // Handle image upload if a new image is provided
    if (req.file) {
      updateData.image_url = req.file.path;
    }

    try {
      const user = await User.updateUser(req.params.id, updateData);
      return res.status(StatusCodes.OK).json(user);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    if (typeof user === "string") {
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
