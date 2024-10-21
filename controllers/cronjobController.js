import cron from 'node-cron';
import pledgeModel from '../models/pledgeModel.js'; 
import transactionModel from '../models/transactionModel.js'; 
import campaignModel from '../models/campaignModel.js';
import userModel from '../models/userModel.js';
// import axios from 'axios';
// import { renderDashboard } from './dashboardController.js';

export let transactionCron = cron.schedule('*/10 * * * * *', async () => {
    try {
        const currentTime =new Date();
        const pledges = await pledgeModel.find({
            executeTime: { $lte: new Date() },
            isComplete: false,
        });

        for (const pledge of pledges) {
            const startTime = pledge.currentTime;
            const transaction = new transactionModel({
                campaignId: pledge.campaignId,
                userId: pledge.userId,
                amount: pledge.amount,
                currentDate: pledge.currentTime, 
                status: 'completed', 
            });
            await transaction.save();

            pledge.isComplete = true;
            await pledge.save();

            const user = await userModel.findById(pledge.userId);
            if (user) {
                user.transaction.push(transaction._id);  
                if (!user.campaign.includes(pledge.campaignId)) {
                    user.campaign.push(pledge.campaignId); 
                }
                await user.save();
            }

            await campaignModel.findByIdAndUpdate(
                pledge.campaignId,
                { $addToSet: { backers: pledge.userId } }, 
                { new: true }
            );

            console.log(`Processed pledge ID: ${pledge._id}`);
            console.log(`Processed Transaction  ID: ${transaction._id}`);
            console.log("Cron job for transaction Started at", startTime);
            console.log("Cron job for transaction executed at", currentTime);
        }
    } catch (error) {
        console.error("Error processing pledges:", error);
    }
});


// This cron job will run every minute
export let deadlineCron = cron.schedule('*/10 * * * * *', async () => {
    try {
        const currentTime = new Date();

        const campaignsToComplete = await campaignModel.find({
            deadline: { $lte: currentTime }, 
            status: "ongoing",
            isDelete: false
        });

        if(!campaignsToComplete)
        {
            console.log("There is no any campaign right now")
        }

        for (let campaign of campaignsToComplete) {
            if (campaign.raisedAmount >= campaign.targetAmount){
                campaign.status = "completed";  
                await campaign.save();  
                console.log(`Campaign ${campaign._id} has been marked as completed!`)
            }
        }
        console.log("Cron job for campaign deadlines executed at", currentTime);
    } catch (error) {
        console.error("Error in campaign deadline cron job:", error.message);
    }
});

export let checkCampaignGoal = cron.schedule('*/10 * * * * *', async () => {
    try {
        const currentTime = new Date();
        const ongoingCampaigns = await campaignModel.find({
            status: "ongoing",
            isDelete: false,
            deadline: { $gte: currentTime } 
        });
        for (let campaign of ongoingCampaigns) {
            if (campaign.raisedAmount >= campaign.targetAmount) {
                // campaign.status = "completed";
                // await campaign.save();
                console.log(`Campaign ${campaign._id} has met its goal and is now completed!`);
            } else {
                console.log(`Campaign ${campaign._id} is still ongoing.`);
            }
        }

        const failedCampaigns = await campaignModel.find({
            deadline: { $lt: currentTime }, 
            status: "ongoing",
            isDelete: false,
            $expr: { $lt: ["$raisedAmount", "$targetAmount"] } 
        });
        for (let campaign of failedCampaigns) {
            campaign.status = "failed";
            await campaign.save();
            console.log(`Campaign ${campaign._id} has failed to meet its goal by the deadline.`);
        }
        console.log("Cron job for checking campaign goals executed at", currentTime);
    } catch (error) {
        console.error("Error in campaign goal check cron job:", error.message);
    }
});


// Cron job to check and notify about the campaign progress
export const campaignProgressCron = cron.schedule('*/30 * * * * *', async () => { // Runs every 30 minutes
    try {
        console.log("Campaign progress cron job running...");

        // Find all ongoing campaigns
        const ongoingCampaigns = await campaignModel.find({ status: 'ongoing' });

        ongoingCampaigns.forEach((campaign) => {
            const { targetAmount, raisedAmount } = campaign;
            
            if (targetAmount > 0) {
                const percentageRaised = (raisedAmount / targetAmount) * 100;

                if (percentageRaised >= 50 && percentageRaised < 100) {
                    console.log(`Campaign ${campaign._id} has reached 50% of its goal.`);
                    const remainingPercentage = 100 - percentageRaised;

                    console.log(`Campaign ID: ${campaign._id}`);
                    console.log(`Raised Amount: ${raisedAmount}`);
                    console.log(`Target Amount: ${targetAmount}`);
                    console.log(`Percentage Raised: ${percentageRaised.toFixed(2)}%`);
                    console.log(`Remaining Percentage: ${remainingPercentage.toFixed(2)}%`);

                    // Notify users or take any other action if needed (for example, using sockets or emails)
                    if (remainingPercentage > 0) {
                        console.log(`Campaign ID: ${campaign._id} is ${remainingPercentage.toFixed(2)}% away from being fully funded.`);
                    } else {
                        console.log(`Campaign ID: ${campaign._id} is fully funded.`);
                    }
                }
                
                if (percentageRaised >= 100) {
                    console.log(`Campaign ${campaign._id} is fully funded.`);
                    const remainingPercentage = 100 - percentageRaised;

                    console.log(`Campaign ID: ${campaign._id}`);
                    console.log(`Raised Amount: ${raisedAmount}`);
                    console.log(`Target Amount: ${targetAmount}`);
                    console.log(`Percentage Raised: ${percentageRaised.toFixed(2)}%`);
                    console.log(`Remaining Percentage: ${remainingPercentage.toFixed(2)}%`);

                    // Notify users or take any other action if needed (for example, using sockets or emails)
                    if (remainingPercentage > 0) {
                        console.log(`Campaign ID: ${campaign._id} is ${remainingPercentage.toFixed(2)}% away from being fully funded.`);
                    } else {
                        console.log(`Campaign ID: ${campaign._id} is fully funded.`);
                    }
                }                
            }
        });
        console.log("Campaign progress cron job completed.");
    } catch (error) {
        console.error("Error running campaign progress cron job:", error);
    }
});

// 

// export let crondashBoard = cron.schedule('*/10 * * * * *', async () => {
//     try {
//         console.log('Refreshing dashboard data');
//         await renderDashboard(); // Trigger the dashboard refresh
//     } catch (error) {
//         console.error('Error refreshing dashboard data:', error);
//     }
// });

// export const refreshLedgerCron = cron.schedule('*/5 * * * * *', async () => {
//     try {
//         // Make a request to your own API to trigger the ledger fetch
//         await axios.get('http://localhost:8000/api/ledger/refresh');
//         console.log('Ledger data refreshed');
//     } catch (error) {
//         console.error('Error refreshing ledger data:', error);
//     }
// });