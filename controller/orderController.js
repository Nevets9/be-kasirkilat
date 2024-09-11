const Produk = require('../models/produkModel');
const Order = require('../models/orderModel');

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.status(200).json({
    status: 'success',
    result: orders.length,
    data: {
      orders,
    },
  });
};

exports.createOrder = async (req, res) => {
  const { order_items, payment_method } = req.body;

  try {
    // const createdOrderItems = await Promise.all(
    //   order_items.map(async (item) => {
    //     const produk = await Produk.findById(item.product_id);
    //     if (!produk) {
    //       throw new Error(
    //         `Produk dengan ID ${item.product_id} tidak ditemukan`
    //       );
    //     }

    //     const orderItem = new OrderItem({
    //       order_id: null,
    //       product_id: produk._id,
    //       quantity: item.quantity,
    //       product_price: produk.harga_produk,
    //     });

    //     totalPrice += produk.harga_produk * item.quantity;
    //     await orderItem.save();
    //     return orderItem._id;
    //   })
    // );

    // const order = new Order({
    //   total_price: totalPrice,
    //   order_items: createdOrderItems,
    //   payment_method: payment_method || 'cash',
    //   payment_status: 'unpaid',
    // });

    // await order.save();
    // await OrderItem.updateMany(
    //   { _id: { $in: createdOrderItems } },
    //   { order_id: order._id }
    // );

    let totalPrice = 0;
    let order_items_detail = [];

    // Looping semua isi dari body request, dengan nama order_items

    order_items.map(async (item) => {
      console.log('a');
      let items = {
        product_id: item.product_id,
        quantity: item.quantity,
      };

      order_items_detail.push(items);
    });

    const result = await Order.create({
      order_items: order_items_detail,
      total_price: 696969,
      payment_method: 'cash',
    });

    res.status(201).send({
      status: 'success',
      data: {
        result,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
