const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const db = require("./config/db");
const route = require("./routes/authRouter");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const donorRoutes = require("./routes/donorRoutes");
const seekerRouter = require("../backend/routes/seekerRouter");
const historyRouter = require("./routes/historyRouter");
const googleSignup = require("./routes/googleSignup");
const cron = require("node-cron");
const formRoutes = require("./routes/formRouter");
const initAutoRejectCron = require("./services/autoRejectService");
const passport = require("passport");
require("./config/passport");
const app = express();

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://pakblood.vercel.app"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.set("socketio", io);

app.use(express.json());

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
  socket.on("join_room", (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`✅ Room Joined: ${userId}`);
    }
  });
});
app.set("trust proxy", 1);
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://pakblood.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);
app.use(passport.initialize());
app.use("/health", (req, res) => {
  res.status(200).json({ message: "Health check passed!" });
});
initAutoRejectCron();
app.use("/auth", route);
app.use("/api/donors", donorRoutes);
app.use("/api/seeker", seekerRouter);
app.use("/api", historyRouter);
app.use("/api/notifications", donorRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/auth", googleSignup);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
