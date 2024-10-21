// reset all
import transactionModel from '../models/transactionModel.js';
import pledgeModel from '../models/pledgeModel.js';
import userModel from '../models/userModel.js';
import campaignModel from '../models/campaignModel.js';
import subadminModel from '../models/subadminModel.js';
import adminModel from '../models/adminModel.js';

export const resetAllData = async (req, res) => {
    try {
        await transactionModel.deleteMany({});
        console.log("All transactions have been deleted.");
        await pledgeModel.deleteMany({});
        console.log("All pledges have been deleted.");
        await userModel.updateMany({}, { $set: { campaign: [], transaction: [] } });
        console.log("User campaigns and transactions cleared.");
        await userModel.deleteMany({});
        console.log("All users have been deleted.");
        await campaignModel.updateMany({}, { $set: { backers: [] } });
        console.log("Campaign backers cleared.");
        await campaignModel.deleteMany({});
        console.log("All campaigns have been deleted.");
        await subadminModel.updateMany({}, { $set: { campaign: [] } });
        console.log("Subadmin campaigns cleared.");
        await subadminModel.deleteMany({});
        console.log("All subadmins have been deleted.");
        await adminModel.updateMany({}, { $set: { subadmin: [] } });
        console.log("Admin subadmins cleared.");
        // // Optionally, you can delete all admins as well if required
        // await adminModel.deleteMany({});
        // console.log("All admins have been deleted.");
        return res.status(200).json({ message: "System reset successfully completed!" });
    } catch (error) {
        console.error("Error during system reset:", error);
        return res.status(500).json({ message: "Error during system reset", error: error.message });
    }
};
