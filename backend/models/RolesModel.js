import mongoose from "mongoose";

const Model = mongoose.model(
  "roles",
  mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
  })
);
export { Model };

export async function createNew({ name }) {
  const newRole = new Model({
    name,
  });

  try {
    const savedRole = await newRole.save();
    return savedRole;
  } catch (error) {
    new Error(`Error creating user: ${error.message}`);
  }
};

export async function getAll() {
  try {
    const roles = await Model.find();
    return roles;
  } catch (error) {
    throw new Error(`Error getting roles: ${error.message}`);
  }
};

export async function deleteRole({ id }) {
  try {
    const role = await Model.deleteOne({ _id: id });
    return role;
  } catch (error) {
    throw new Error(`Error deleting role: ${error.message}`);
  }
};