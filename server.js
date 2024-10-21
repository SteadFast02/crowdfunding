import express from 'express'
import { configDotenv } from 'dotenv';
import connectDB from './config/db.js'
import adminRoutes from './routes/adminRoutes.js';
import subadminRoutes from './routes/subadminRoutes.js'
import campaignRoutes from './routes/campaignRoutes.js'
import userRoutes from './routes/userRoutes.js'
import pledgeRoutes from './routes/pledgeRoutes.js'
import ledgerRoutes from './routes/ladgerRoutes.js'

import {transactionCron,deadlineCron,checkCampaignGoal,} from "./controllers/cronjobController.js"

configDotenv();
connectDB();
transactionCron.start()
deadlineCron.start()
checkCampaignGoal.start()


const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

app.use('/api/admin',adminRoutes)
app.use('/api/subadmin',subadminRoutes)
app.use('/api/campaign',campaignRoutes)
app.use('/api/user',userRoutes)
app.use('/api/pledge',pledgeRoutes)
app.use('/api/ledger',ledgerRoutes)




app.listen(PORT,()=>{
    console.log(`Server running in port ${PORT}`)
})