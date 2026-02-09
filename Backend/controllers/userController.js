import User from "../models/User.js";
import Order from "../models/Order.js";


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
    } catch (err) {
    res.status(500).json({ msg: "Server error" });
    }
};

export const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
    try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.role = role;
    await user.save();
    res.json({ msg: "User role updated" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
    const { deleteUserId } = req.params;

    try {
    const user = await User.findOneAndDelete(deleteUserId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
    console.error("DELETE USER ERROR:", err.message);
  }
};

export const getUserOrders = async (req, res) => {
  const { userId } = req.params;
    try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const orders = await Order.find({ user: userId }).populate("orderItems.product", "name price");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};