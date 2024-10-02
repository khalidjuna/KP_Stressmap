import mongoose from "mongoose";

const Model = mongoose.model(
  "revoketokens",
  mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    jwt_id: {
      type: String,
      required: true,
    },
    login_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expired_at: {
      type: Date,
      required: true,
    },
  })
);
export { Model };

export async function createNew({ user_id, jwt_id }) {
  const expired_at = new Date();
  expired_at.setDate(expired_at.getDate() + 1); // hari

  const newData = new Model({
    user_id,
    jwt_id,
    expired_at,
  });

  try {
    const saved = await newData.save();
    return saved;
  } catch (error) {
    throw new Error(`Error creating data: ${error.message}`);
  }
}

export async function findByJti(jwt_id) {
  try {
    const revoke_token = await Model.findOne({ jwt_id });
    if (!revoke_token) {
      return "token is not valid";
    }

    return revoke_token;
  } catch (error) {
    throw new Error(`Error finding revoke_token: ${error.message}`);
  }
}

export async function deleteByJti(jwt_id) {
  try {
    const deleted = await Model.findOneAndDelete({ jwt_id });
    if (!deleted) {
      return "token not found";
    }

    return "token successfully deleted";
  } catch (error) {
    throw new Error(`Error deleting revoke_token: ${error.message}`);
  }
}
