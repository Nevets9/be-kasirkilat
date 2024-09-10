const Produk = require('../models/produkModel');
const Order = require('../models/orderModel');
const OrderItem = require('../models/orderItemModel');

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.status(200).json({
    status: 'success',
    data: {
      orders,
    },
  });
};

exports.createOrder = async (req, res) => {
  const { order_items, payment_method } = req.body;

  try {
    let totalPrice = 0;

    const createdOrderItems = await Promise.all(
      order_items.map(async (item) => {
        const produk = await Produk.findById(item.product_id);
        if (!produk) {
          throw new Error(
            `Produk dengan ID ${item.product_id} tidak ditemukan`
          );
        }

        const orderItem = new OrderItem({
          order_id: null,
          product_id: produk._id,
          quantity: item.quantity,
          product_price: produk.harga_produk,
        });

        totalPrice += produk.harga_produk * item.quantity;
        await orderItem.save();
        return orderItem._id;
      })
    );

    const order = new Order({
      total_price: totalPrice,
      order_items: createdOrderItems,
      payment_method: payment_method || 'cash',
      payment_status: 'unpaid',
    });

    await order.save();
    await OrderItem.updateMany(
      { _id: { $in: createdOrderItems } },
      { order_id: order._id }
    );

    res.status(201).send({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
