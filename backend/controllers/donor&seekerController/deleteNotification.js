const Notification = require("../../models/notificationModel");
const mongoose = require("mongoose");

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (id === "all") {
      const result = await Notification.deleteMany({ userId: userId });
      return res.status(200).json({
        success: true,
        message: "All notifications cleared successfully",
        deletedCount: result.deletedCount,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Notification ID" });
    }

    const deletedNotif = await Notification.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    if (!deletedNotif) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error in delete logic:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting",
    });
  }
};

module.exports = { deleteNotification };
