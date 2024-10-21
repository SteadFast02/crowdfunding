import bcrypt from 'bcrypt'
import adminModel from '../models/adminModel.js'; 
import subadminModel from '../models/subadminModel.js'; 
import campaignModel from '../models/campaignModel.js';
import userModel from '../models/userModel.js';
import transactionModel from '../models/transactionModel.js';

import e2ee from '../utils/e2ee.js';


// Create a new admin
export const createAdmin = async (req, res) => {
    try {
        const encryptData = req.body;
        const decryptedData = e2ee.decrypt(encryptData.content);
        
        const username = decryptedData.username;
        const email = decryptedData.email;
        const password = decryptedData.password;

        if(!username || !email || !password){
            const error = {
                message:"Please Provide all Field"
            }
            const encryptError = e2ee.encrypt(error);
            console.log("Provide all field")
            return res.status(400).send(encryptError)
        }
        
        const admin = await adminModel.findOne({email});
        if(admin)
        {
            const error = {
                message:"Admin Exist Already"
            }
            const encryptError = e2ee.encrypt(error);
            console.log("Admin Exist Already")
            return res.status(400).send(encryptError)
        }
            
        const newAdmin = new adminModel({ 
            username, 
            email,
            password 
        });

        const salt = await bcrypt.genSalt(10);
        newAdmin.password = await bcrypt.hash(password, salt);

        const success = {
            success:true,
            message:"Admin created Successfully"
        }
        const encryptSuccess = e2ee.encrypt(success);
        
        await newAdmin.save();

        console.log("Admin created Successfully")
        return res.status(201).json(encryptSuccess);
    } catch (err) {
        const error = {
            success:false,
            message:err.message
        }
        const encryptError = e2ee.encrypt(error);
        console.log(err.message)
        return res.status(400).json(encryptError);
    }
};

// Admin login
export const loginAdmin = async (req, res) => {
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

        const admin = await adminModel.findOne({ email });
        if (!admin) {
            const error = {
                message:"Invalid Credentials"
            }
            const encryptError = e2ee.encrypt(error);
            console.log("Admin not found")
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
            message:"Admin login Successfully"
        }
        const encryptSuccess = e2ee.encrypt(success);
        console.log("Admin login Successfully")
        return res.status(200).json(encryptSuccess);
        
    } catch (err) {
        const error = {
            success:false,
            message:err.message
        }
        const encryptError = e2ee.encrypt(error);
        console.log(error.message)
        return res.status(400).json(encryptError);
    }
};

// Update an subadmin by ID
export const updateSubAdminStatus = async (req, res) => {
    try {
      const encryptData = req.body;
      const decryptedData = e2ee.decrypt(encryptData.content);
      const id = req.params
      const status = decryptedData.status;

      if (!['active', 'inactive', 'blocked'].includes(status)) {
        const invalidStatusResponse = {
          success: false,
          message: "Invalid status. Allowed values are 'active', 'inactive', 'blocked'."
        };
        return res.status(400).json(e2ee.encrypt(invalidStatusResponse));
      }
  
      const subAdmin = await subadminModel.findByIdAndUpdate(id, { status }, { new: true });
  
      if (!subAdmin) {
        const notExistResponse = {
          success: false,
          message: "Sub-admin not found."
        };
        return res.status(404).json(e2ee.encrypt(notExistResponse));
      }
  
      const successResponse = {
        success: true,
        message: `Sub-admin status updated to ${status} successfully.`
      };
      return res.status(200).json(e2ee.encrypt(successResponse));
    } catch (error) {
      const errorResponse = {
        success: false,
        message: error.message
      };
      return res.status(500).json(e2ee.encrypt(errorResponse));
    }
  };
  

// Delete Sub admin
export const deleteSubAdmin = async (req, res) => {
    try {
    const subAdmin = await subadminModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });

    if (!subAdmin) {
        const notExistResponse = {
        success: false,
        message: "Sub-admin not found."
        };
        return res.status(404).json(e2ee.encrypt(notExistResponse));
    }

    const campaigns = subAdmin.campaingn; 

        await campaignModel.updateMany(
            { _id: { $in: campaigns } }, // Match all campaigns in the array
            { isDeleted: true }
        );

        const successResponse = {
            success: true,
            message: "Sub-admin and associated campaigns deleted successfully."
        };
    return res.status(200).json(e2ee.encrypt(successResponse));
    } catch (error) {
    const errorResponse = {
        success: false,
        message: error.message
    };
    return res.status(500).json(e2ee.encrypt(errorResponse));
    }
};

export const dashboardStats = async (req, res) => {
    try {
        // Subadmin Stats
        const totalSubadmins = await subadminModel.countDocuments({ isDeleted: false });
        const activeSubadmins = await subadminModel.countDocuments({ status: 'active', isDeleted: false });
        const inactiveSubadmins = await subadminModel.countDocuments({ status: 'inactive', isDeleted: false });
        const blockedSubadmins = await subadminModel.countDocuments({ status: 'blocked', isDeleted: false });
  
        if (!totalSubadmins || !activeSubadmins || !inactiveSubadmins || !blockedSubadmins) {
          console.error('1   Error: Missing data in one or more queries.');
          // return res.status(500).send('Server Error: Missing data.');
      }
  
        // Campaign Stats
        const totalCampaigns = await campaignModel.countDocuments({ isDelete: false });
        const ongoingCampaigns = await campaignModel.countDocuments({ status: 'ongoing', isDelete: false });
        const completedCampaigns = await campaignModel.countDocuments({ status: 'completed', isDelete: false });
        const failedCampaigns = await campaignModel.countDocuments({ status: 'failed', isDelete: false });
  
        if (!ongoingCampaigns || !totalCampaigns || !completedCampaigns || !failedCampaigns) {
          console.error('2   Error: Missing data in one or more queries.');
          // return res.status(500).send('Server Error: Missing data.');
      }
  
        // User Stats
        const totalUsers = await userModel.countDocuments({ isDeleted: false });
  
        // Transaction Stats
        const totalTransactions = await transactionModel.countDocuments();
        const completedTransactions = await transactionModel.countDocuments({ status: 'completed' });
        const pendingTransactions = await transactionModel.countDocuments({ status: 'pending' });
  
        // Check for any undefined values and log them for debugging
        if (!totalUsers || !totalTransactions || !completedTransactions || !pendingTransactions) {
            console.error('3   Error: Missing data in one or more queries.');
          //   return res.status(500).send('Server Error: Missing data.');
        }
  
        const success = {
          success:true,
          subadminStats: {
              total: totalSubadmins || 0, 
              active: activeSubadmins || 0,
              inactive: inactiveSubadmins || 0,
              blocked: blockedSubadmins || 0,
          },
          campaignStats: {
              total: totalCampaigns || 0,
              ongoing: ongoingCampaigns || 0,
              completed: completedCampaigns || 0,
              failed: failedCampaigns || 0,
          },
          userStats: {
              total: totalUsers || 0,
          },
          transactionStats: {
              total: totalTransactions || 0,
              completed: completedTransactions || 0,
              pending: pendingTransactions || 0,
          },
      }
      const encryptSuccess = e2ee.encrypt(success);
  
      res.status(200).json(encryptSuccess);
  }   catch (err) {
      const error = {
          success:false,
          message:err.message
      }
      const encryptError = e2ee.encrypt(error);
      console.log(err.message)
      return res.status(400).json(encryptError);
  }
  };

// reset subadmin field

export const resetsubadminIds = async (req, res) => {
  try {
    const {userId} =req.user
    const admin = await adminModel.findById(userId);
    if (!admin) {
        const error = {
            message:"Invalid Credentials"
        }
        const encryptError = e2ee.encrypt(error);
        console.log("Admin not found")
        return res.status(400).json(encryptError);
    }
    const validSubAdmins = await subadminModel.find({}, '_id');
    const validSubAdminIds = validSubAdmins.map(subAdmin => subAdmin._id.toString());

    const filteredSubAdminIds = admin.subadmin.filter(subAdminId =>
      validSubAdminIds.includes(subAdminId.toString())
    );

    admin.subadmin = filteredSubAdminIds;
    await admin.save();

    const successResponse = {
        success: true,
        message: "Invalid subadmin IDs removed successfully"
    };
    return res.status(200).json(e2ee.encrypt(successResponse));

  } catch (error) {
    console.error('Error deleting invalid subadmin IDs:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
