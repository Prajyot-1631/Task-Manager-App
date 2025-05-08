const Notification = require("../model/notificationModel");

const getNotifications = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const userId = req.user.userId;

    const notifications = await Notification.find({ recipient: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Notification fetch error:", error);
    res.status(500).json({ message: "Error fetching Notifications", error });
  }
};
module.exports = getNotifications;
