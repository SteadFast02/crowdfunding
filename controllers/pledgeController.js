import Pledge from "../models/pledgeModel.js";
import campaignModel from "../models/campaignModel.js";
import userModel from "../models/userModel.js";
import e2ee from "../utils/e2ee.js"; 

export const createPledge = async (req, res) => {
    try {
        const encData = req.body;
        const decryptedData = e2ee.decrypt(encData.content);

        const { amount } = decryptedData;
        const {campaignid} = req.params;  
        const {userId} = req.user;        
        console.log(amount)
        console.log(campaignid)
        console.log(userId)
        const campaign = await campaignModel.findOne({ _id: campaignid, isDelete: false });
        console.log(campaign)
        if (!campaign) {
            const error = { message: "Campaign not found or has been deleted" };
            const encryptedError = e2ee.encrypt(error);
            return res.status(404).json(encryptedError);
        }
        const user = await userModel.findOne({ _id: userId, isDeleted: false });
        if (!user) {
            const error = { message: "User not found or has been deleted" };
            const encryptedError = e2ee.encrypt(error);
            return res.status(404).json(encryptedError);
        }
        const newPledge = new Pledge({
            campaignId:campaignid,
            userId,
            amount,
            isComplete: false, 
        });
        await newPledge.save();
        campaign.raisedAmount += amount;
        await campaign.save();

        const success = { success: true, message: "Pledge created successfully", pledge: newPledge };
        const encryptedSuccess = e2ee.encrypt(success);
        return res.status(201).json(encryptedSuccess);

    } catch (error) {
        const errResponse = { success: false, message: error.message };
        const encryptedError = e2ee.encrypt(errResponse);
        return res.status(500).json(encryptedError);
    }
};
