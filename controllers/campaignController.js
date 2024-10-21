import campaignModel from '../models/campaignModel.js';
import e2ee from '../utils/e2ee.js'; 
import subadminModel from '../models/subadminModel.js';


// Create a new campaign
export const createCampaign = async (req, res) => {
    try {
        const { userId } = req.user;
        const encryptData = req.body;
        const decryptedData = e2ee.decrypt(encryptData.content);
        const { title, description, targetAmount, deadline, status } = decryptedData;

        if (!title || !description || targetAmount === undefined) {
            const error = { message: "Please Provide all Fields including Subadmin ID" };
            const encryptError = e2ee.encrypt(error);
            return res.status(400).send(encryptError);
        }

        const newCampaign = new campaignModel({
            title,
            description,
            targetAmount,
            raisedAmount: 0,
            // deadline: new Date(deadline),
            status: 'ongoing' || status,
        });

        await newCampaign.save();
        const subadmin = await subadminModel.findById(userId);

        if (!subadmin) {
            const error = {
                message: "Subadmin not found"
            };
            const encryptError = e2ee.encrypt(error);
            console.log("Subadmin not found");
            return res.status(400).send(encryptError);
        }
        subadmin.campaingn.push(newCampaign._id);
        await subadmin.save();
        const success = { success: true, message: "Campaign created Successfully" };
        const encryptSuccess = e2ee.encrypt(success);
        res.status(201).json(encryptSuccess);
    } catch (err) {
        const error = { success: false, message: err.message };
        const encryptError = e2ee.encrypt(error);
        res.status(400).json(encryptError);
    }
};

// Delete controller
export const deleteCampaign = async (req, res) => {
    try {
        const { userId } = req.user; 
        const campaign = await campaignModel.findById(req.params.id);

        if (!campaign) {
            const error = { message: "Campaign not found" };
            const encryptError = e2ee.encrypt(error);
            return res.status(404).send(encryptError);
        }

        if (campaign.isDelete) {
            const error = { message: "Campaign already deleted" };
            const encryptError = e2ee.encrypt(error);
            return res.status(400).send(encryptError);
        }

        campaign.isDelete = true;
        await campaign.save();

        const subadmin = await subadminModel.findById(userId);

        if (subadmin) {
            subadmin.campaingn = subadmin.campaingn.filter(id => id.toString() !== req.params.id);
            await subadmin.save();
        }

        const success = { success: true, message: "Campaign deleted successfully" };
        const encryptSuccess = e2ee.encrypt(success);
        res.status(200).json(encryptSuccess);

    } catch (err) {
        const error = { success: false, message: err.message };
        const encryptError = e2ee.encrypt(error);
        res.status(500).json(encryptError);
    }
};


// Fetch a campaign by ID
export const fetchCampaignById = async (req, res) => {
    try {
        const campaign = await campaignModel.findById(req.params.id);
        if (!campaign) {
            const error = { message: "Campaign not found" };
            const encryptError = e2ee.encrypt(error);
            return res.status(404).json(encryptError);
        }

        const success = {
            success: true,
            message: "Campaign fetched successfully",
            campaign
        };
        const encryptSuccess = e2ee.encrypt(success);
        res.status(200).json(encryptSuccess);
    } catch (error) {
        const errResponse = { success: false, message: error.message };
        const encryptError = e2ee.encrypt(errResponse);
        res.status(400).json(encryptError);
    }
};

// Update a campaign by ID
export const updateCampaign = async (req, res) => {
    try {
        const encryptData = req.body;
        const decryptedData = e2ee.decrypt(encryptData.content);
        const { title, description, targetAmount, deadline, status } = decryptedData;

        const updateFields = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (targetAmount !== undefined) updateFields.targetAmount = targetAmount;
        if (deadline) updateFields.deadline = new Date(deadline);
        if (status) updateFields.status = status;

        const updatedCampaign = await campaignModel.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        if (!updatedCampaign) {
            const error = { message: "Campaign not found" };
            const encryptError = e2ee.encrypt(error);
            return res.status(404).json(encryptError);
        }

        const success = { success: true, message: "Campaign updated successfully", campaign: updatedCampaign };
        const encryptSuccess = e2ee.encrypt(success);
        res.status(200).json(encryptSuccess);
    } catch (error) {
        const errResponse = { success: false, message: error.message };
        const encryptError = e2ee.encrypt(errResponse);
        res.status(400).json(encryptError);
    }
};

// List all campaigns
export const listCampaigns = async (req, res) => {
    try {
        const campaigns = await campaignModel.find();

        const success = {
            success: true,
            message: "Campaigns fetched successfully",
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