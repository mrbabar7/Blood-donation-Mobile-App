const Notification = require("../../models/notificationModel");

exports.createNotification = async (userId, message, link, io) => {
  try {
    const notification = new Notification({
      userId,
      message,
      link,
      isRead: false,
    });
    const savedNotif = await notification.save();

    if (io) {
      const targetRoom = userId.toString();
      io.to(targetRoom).emit("new_notification_received", savedNotif);
      console.log(`🚀 Notification Emitted to Room: ${targetRoom}`);
    }
  } catch (err) {
    console.error("Error:", err);
  }
};
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort(
      { createdAt: -1 },
    );
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true },
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};
