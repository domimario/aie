const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const cors = require("cors");
const path = require("path");



dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//routes
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/uploads", express.static("uploads"));


const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error: ", err));


app.get("/", (req, res) => {  res.send("Server & MongoDB are running...");});

app.listen(PORT, () => {console.log(` Server is running on port ${PORT}`);});
