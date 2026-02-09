import Order from "../models/Order.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    console.log("USER:", req.user);
    console.log("BODY:", req.body);
    
    const {
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      bankReference,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have items" });
    }

    const order = new Order({
      user: req.user.id,

      orderItems: items.map((item) => ({
        product: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),

      shippingAddress,
      totalAmount,

      // 👇 New (bank transfer support)
      paymentMethod: paymentMethod || "transfer",
      bankReference,

      paymentStatus: "pending",
      status: "pending",

      
    });
    
    

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }


};

// GET LOGGED-IN USER ORDERS (ARRAY)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("orderItems.product", "name image price");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE ORDER BY ID (OBJECT)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("orderItems.product", "name image price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN: GET ALL ORDERS
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("orderItems.product", "name image price");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {   
        return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }     
};