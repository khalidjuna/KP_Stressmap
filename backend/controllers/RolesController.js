import *as Role from "../models/RolesModel.js";

export const addRole = async (req, res) => {
    const { name } = req.body;
    try {
        const role = await Role.createNew({ name });
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }    
};

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.getAll();
        res.status(200).json(roles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }    
};

export const deleteRole = async (req, res) => {
    const { id } = req.params;
    try {
        const role = await Role.deleteRole({ _id: id });
        res.status(200).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }    
};