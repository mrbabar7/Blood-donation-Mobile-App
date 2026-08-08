// controllers/notificationController.js
const Notification = require("../models/notificationModel");
const userModel = require("../models/userMode");
const {
  emitToUser,
  sendPushNotification,
} = require("../services/socketService");

// Helper function called by other controllers (sendBloodRequest, acceptRequest, etc.)
exports.createNotification = async ({
  userId,
  message,
  link = "",
  data = {},
}) => {
  try {
    // 1. Save Notification to Database (In-App Inbox)
    const notification = new Notification({
      userId,
      message,
      link,
      data,
      isRead: false,
    });
    const savedNotif = await notification.save();

    // 2. Emit Real-time Socket Event to User's Room
    emitToUser(userId, "new_notification_received", savedNotif);

    // 3. Send Mobile Push Notification via Expo
    const targetUser = await userModel.findById(userId).select("pushToken");
    if (targetUser && targetUser.pushToken) {
      await sendPushNotification(
        targetUser.pushToken,
        "🩸 PakBlood Alert",
        message,
        { ...data, notificationId: savedNotif._id.toString() },
      );
    }

    return savedNotif;
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

// API Endpoint: Get user notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json({ success: true, notifications });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};

// API Endpoint: Mark single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true },
    );
    res.json({ success: true, notification: notif });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to mark as read" });
  }
};
