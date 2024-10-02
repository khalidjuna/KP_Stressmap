import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Model = mongoose.model(
  "users",
  mongoose.Schema({
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roles",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    institution: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
  })
);
export { Model };

export async function createNew({
  role_id,
  name,
  email,
  password,
  position,
  institution,
  city,
  country,
  image_url,
}) {
  // Hash password dengan bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new Model({
    role_id,
    name,
    email,
    password: hashedPassword,
    position, 
    institution,
    city,
    country,
    image_url,
  });

  try {
    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

export async function login(email, password) {
  try {
    const error_login_message = "email atau password salah";
    const user = await Model.findOne({ email });
    if (!user) {
      return error_login_message;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error_login_message;
    }

    return user;
  } catch (error) {
    throw new Error(`Login error: ${error.message}`);
  }
}

export async function getAllUsers() {
  try {
    const users = await Model.find();
    return users;
  } catch (error) {
    throw new Error(`Error getting users: ${error.message}`);
  }
}

export async function getUserById(userId) {
  try {
    const user = await Model.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`);
  }
}

export async function findByUsername(username) {
  try {
    const user = await Model.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`);
  }
}

export async function deleteUser(userId) {
  try {
    const deletedUser = await Model.findByIdAndDelete(userId);
    if (!deletedUser) {
      throw new Error("User not found");
    }
    return deletedUser;
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
}

export async function updateUser(userId, updateData) {
  try {
    // Jika password disertakan dalam updateData, hash password baru
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await Model.findByIdAndUpdate(userId, updateData, {
      new: true, // Mengembalikan dokumen yang baru setelah update
      runValidators: true, // Menjalankan validasi skema
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
}

