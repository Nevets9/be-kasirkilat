const Produk = require('../models/produkModel');
const Order = require('../models/orderModel');
const Coupon = require('../models/couponModel');

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
  const tax = 0.1;
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

        totalPrice += produk.harga_produk * item.quantity;

        order_items_detail.push(items);
      })
    );

    let couponDetails = [];
    let totalPriceDiscount = 0;
    if (req.body.coupon) {
      const couponValue = await Coupon.findById(req.body.coupon);
      let couponItems = {
        couponId: req.body.coupon,
        kodeCoupon: couponValue.kodeCoupon,
        besarDiscount: couponValue.besarDiscount,
      };
      couponDetails.push(couponItems);

      totalPriceDiscount =
        totalPrice - totalPrice * couponDetails[0].besarDiscount;
    }

    const result = await Order.create({
      order_items: order_items_detail,
      total_price: totalPrice,
      total_price_with_discount: totalPriceDiscount || 0,
      total_price_with_tax:
        totalPriceDiscount + totalPriceDiscount * tax ||
        totalPrice + totalPrice * tax,
      coupon: couponDetails[0] || null,
      payment_method: payment_method,
      discount_amount: couponDetails[0]?.besarDiscount || 0,
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

exports.getAllStatistics = async (req, res) => {
  try {
    const orders = await Order.find();

    let totalIncome = 0;
    orders.map((item) => {
      totalIncome += item.total_price_with_tax;

    });

    console.log(totalIncome);

    res.status(200).send({
      status: 'success',
      data: {
        totalIncome: totalIncome,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
