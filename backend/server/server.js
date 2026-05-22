import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import router from "./router/task.router.js"
dotenv.config();

// database
import { connectDB } from "./db/db.js";

// Variable
const app = express();
const PORT = process.env.PORT;
const frontend = process.env.VERCEL_URI;

app.use(cors({
        origin: frontend
    })
);

// initialize server check
app.get('/',(req,res)=>{
    return res.send("Server Ready");
});

app.use(express.json());
app.use('/api/task',router);

// run server
app.listen(PORT || 5000, () => {
    connectDB();
    console.log(`Server is running at ${process.env.PORT}`);
});