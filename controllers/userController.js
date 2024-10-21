import userModel from '../models/userModel.js';
import subadminModel from '../models/subadminModel.js';
import campaignModel from '../models/campaignModel.js';
import e2ee from '../utils/e2ee.js';
import bcrypt from 'bcrypt';

// Register new user
export const createUser = async (req, res) => {
    try {
        const encryptedData = req.body;
        const decryptedData = e2ee.decrypt(encryptedData.content);
        const { username, email, password } = decryptedData;

        if (!username || !email || !password) {
            const error = { message: "Please provide all fields" };
            const encryptedError = e2ee.encrypt(error);
            return res.status(400).json(encryptedError);
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            const error = { message: "User with this email already exists" };
            const encryptedError = e2ee.encrypt(error);
            return res.status(400).json(encryptedError);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ username, email, password: hashedPassword });
        await newUser.save();

        const success = { success: true, message: "User created successfully" };
        const encryptedSuccess = e2ee.encrypt(success);
        res.status(201).json(encryptedSuccess);
    } catch (error) {
        const errResponse = { success: false, message: error.message };
        const encryptedError = e2ee.encrypt(errResponse);
        res.status(500).json(encryptedError);
    }
};

// User login
export const loginUser = async (req, res) => {
    try {
        const encryptedData = req.body;
        const decryptedData = e2ee.decrypt(encryptedData.content);
        const { email, password } = decryptedData;

        if (!email || !password) {
            const error = { message: "Please provide both email and password" };
            const encryptedError = e2ee.encrypt(error);
            return res.status(400).json(encryptedError);
        }

        const user = await userModel.findOne({ email, isDeleted: false });
        if (!user) {
            const error = { message: "Invalid credentials" };
            const encryptedError = e2ee.encrypt(error);
            return res.status(400).json(encryptedError);
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            const error = { message: "Invalid credentials" };
            const encryptedError = e2ee.encrypt(error);
            return res.status(400).json(encryptedError);
        }

        const token = user.createJWT();
        const success = { success: true, token };
        const encryptedSuccess = e2ee.encrypt(success);

        console.log("User logged in successfully");
        return res.status(200).json(encryptedSuccess);
    } catch (error) {
        const errResponse = { success: false, message: error.message };
        const encryptedError = e2ee.encrypt(errResponse);
        console.log(error.message);
        return res.status(500).json(encryptedError);
    }
};


// Fetch a user by ID
export const fetchUserById = async (req, res) => {
    try {
        const {userId} = req.user;
        console.log(userId)
        const user = await userModel.findById(userId)  //.populate('campaign').populate('transaction');
        if (!user || user.isDeleted) {
            const error = { message: "User not found" };
            const encryptedError = e2ee.encrypt(error);
            return res.status(404).json(encryptedError);
        }

        const success = { success: true, user };
        const encryptedSuccess = e2ee.encrypt(success);
        res.status(200).json(encryptedSuccess);
    } catch (error) {
        const errResponse = { success: false, message: error.message };
        const encryptedError = e2ee.encrypt(errResponse);
        res.status(500).json(encryptedError);
    }
};

// Fetch all users
export const fetchAllUsers = async (req, res) => {
    try {
        const {userId} = req.user;
        console.log({userId})
        const subadmin = await subadminModel.findById(userId)  //.populate('campaign').populate('transaction');
        if (!subadmin || subadmin.isDeleted) {
            const error = { message: "Subadmin not found" };
            const encryptedError = e2ee.encrypt(error);
            return res.status(404).json(encryptedError);
        }
        const users = await userModel.find({ isDeleted: false })  //.populate('campaign').populate('transaction');

        const success = { success: true, users };
        const encryptedSuccess = e2ee.encrypt(success);
        res.status(200).json(encryptedSuccess);
    } catch (error) {
        const errResponse = { success: false, message: error.message };
        const encryptedError = e2ee.encrypt(errResponse);
        res.status(500).json(encryptedError);
    }
};

// Delete a user by ID (soft delete)
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.user; 

        const subadmin = await subadminModel.findById(userId);
        if (!subadmin || subadmin.isDeleted) {
            const error = { message: "Subadmin not authorized or account is Deleted" };
            const encryptedError = e2ee.encrypt(error);
            return res.status(403).json(encryptedError);
        }

        const { id } = req.params; 
        const user = await userModel.findById(id);

        if (!user || user.isDeleted) {
            const error = { message: "User not found or already deleted" };
            const encryptedError = e2ee.encrypt(error);
            return res.status(404).json(encryptedError);
        }
        user.isDeleted = true;
        await user.save();
        const success = { success: true, message: "User deleted successfully" };
        const encryptedSuccess = e2ee.encrypt(success);
        res.status(200).json(encryptedSuccess);

    } catch (error) {
        const errResponse = { success: false, message: error.message };
        const encryptedError = e2ee.encrypt(errResponse);
        res.status(500).json(encryptedError);
    }
};

// Fetch all ongoing campaign
export const fetchAllCampaign = async (req, res) => {
    try {
        const campaigns = await campaignModel.find({ status: 'ongoing' });
        const success = {
            success: true,
            message: "Ongoing campaigns fetched successfully",
            campaigns
        };
        const encryptSuccess = e2ee.encrypt(success);
        res.status(200).json(encryptSuccess);
    } catch (error) {
        const errResponse = { success: false, message: error.message };
        const encryptError = e2ee.encrypt(errResponse);
        res.status(400).json(encryptError);
    }
};