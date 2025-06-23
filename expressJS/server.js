require("dotenv").config();
const express= require("express");
const app=express();
const cors= require("cors");
const path= require("path");
const connectDB = require("./config/db");
const authRoutes= require("./routes/authRoutes");
const userRoutes= require("./routes/userRoutes");
const taskRoutes=require("./routes/taskRoutes");
const reportRoutes=require("./routes/reportRoutes");
app.use(
    cors({
        origin:process.env.CLIENT_URL|| "http://localhost:5173",
        methods:["GET","POST",'PUT',"DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
        credentials:true,
    })
 );
 connectDB();
 app.use(express.json());

 app.use("/api/auth",authRoutes);
 app.use("/api/users",userRoutes);
app.use("/api/tasks",taskRoutes);
 app.use("/api/reports",reportRoutes);


 const PORT=process.env.PORT||8000;
 app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));