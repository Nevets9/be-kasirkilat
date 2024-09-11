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

  let totalPrice = 0;
  let order_items_detail = [];
  try {
    // Looping semua isi dari body request, dengan nama order_items
    await Promise.all(
      //pakai promise all biar async nyo bejalan terus sampe proses mappingny selesai
      order_items.map(async (item) => {
        const produk = await Produk.findById(item.product_id);

        let items = {
          product_id: item.product_id,
          quantity: item.quantity,
          product_name: produk.nama_produk,
        };

        order_items_detail.push(items);
      })
    );

    //petake galo2 samoke isimencak di model, tarok galo2 keperluan disini

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
