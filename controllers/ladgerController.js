import transactionModel from '../models/transactionModel.js';
import e2ee from '../utils/e2ee.js';

// Render the ledger page with transactions
export const Ledger = async (req, res) => {
    try {
        const transactions = await transactionModel.find();
        if(!transactions)
        {
            const error = {
                message:"there is no any transaction present"
            }
            const encryptError = e2ee.encrypt(error);
            console.log("No any transaction happen")
            return res.status(400).send(encryptError)
        }
        const success = {
            success:true,
            message:"fetch transaction Successfully",
            Transaction:transactions
        }
        const encryptSuccess = e2ee.encrypt(success);
        return res.status(200).send(encryptSuccess)
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
