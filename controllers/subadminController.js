import bcrypt from 'bcrypt'
import adminModel from '../models/adminModel.js';
import subadminModel from '../models/subadminModel.js'; 
import e2ee from '../utils/e2ee.js';

// Create a new admin
export const createsubAdmin = async (req, res) => {
    try {
        const encryptData = req.body;
        const decryptedData = e2ee.decrypt(encryptData.content);
        
        const username = decryptedData.username;
        const email = decryptedData.email;
        const password = decryptedData.password;

        if (!username || !email || !password) {
            const error = {
                message: "Please Provide all Fields"
            };
            const encryptError = e2ee.encrypt(error);
            console.log("Provide all fields");
            return res.status(400).send(encryptError);
        }

        const subadmin = await subadminModel.findOne({ email });
        if (subadmin) {
            const error = {
                message: "Sub-admin Already Exists"
            };
            const encryptError = e2ee.encrypt(error);
            console.log("Sub-admin already exists");
            return res.status(400).send(encryptError);
        }

        const newsubAdmin = new subadminModel({
            username,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        newsubAdmin.password = await bcrypt.hash(password, salt);
        await newsubAdmin.save();
        const { userId } = req.user;
        const admin = await adminModel.findById(userId);

        if (!admin) {
            const error = {
                message: "Admin not found"
            };
            const encryptError = e2ee.encrypt(error);
            console.log("Admin not found");
            return res.status(400).send(encryptError);
        }
        admin.subadmin.push(newsubAdmin._id);
        await admin.save();

        const success = {
            success: true,
            message: "Sub-admin created and added to admin successfully"
        };
        const encryptSuccess = e2ee.encrypt(success);

        console.log("Sub-admin created and added to admin successfully");
        res.status(201).json(encryptSuccess);

    } catch (err) {
        const error = {
            success: false,
            message: err.message
        };
        const encryptError = e2ee.encrypt(error);
        console.log(err.message);
        res.status(400).json(encryptError);
    }
};


// Admin login
export const loginsubAdmin = async (req, res) => {
    try {
        const encryptData = req.body;
        const decryptedData = e2ee.decrypt(encryptData.content);
        const email = decryptedData.email;
        const password = decryptedData.password;

        if(!email || !password)
        {
            const error = {
                message:"Please Provide all Field"
            }
            const encryptError = e2ee.encrypt(error);
            console.log("Please Provide all Field")
            return res.status(400).send(encryptError)
        }

        const admin = await subadminModel.findOne({ email });
        if (!admin) {
            const error = {
                message:"Invalid Credentials"
            }
            const encryptError = e2ee.encrypt(error);
            console.log("Subadmin not found")
            return res.status(400).json(encryptError);
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            const error = {
                message:"Invalid Credentials"
            }
            const encryptError = e2ee.encrypt(error);
            console.log("Password not match")
            return res.status(400).json(encryptError);
        }

        const token = await admin.createJWT();

        const success = {
            Token:token,
            success:true,
            message:"Subadmin login Successfully"
        }
        const encryptSuccess = e2ee.encrypt(success);
        console.log("Subadmin login Successfully")
        res.status(200).json(encryptSuccess);
        
    } catch (err) {
        const error = {
            success:false,
            message:err.message
        }
        const encryptError = e2ee.encrypt(error);
        console.log(error.message)
        res.status(400).json(encryptError);
    }
};