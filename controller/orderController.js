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
    let totalQuantity = 0;
    let totalCouponUse = 0;
    orders.map((item) => {
      totalIncome += item.total_price_with_tax;

      const order_items = item.order_items;
      order_items.map((result) => {
        totalQuantity += result.quantity;
      });

      if (item.coupon.couponId) {
        totalCouponUse += 1;
      }
    });

    function filterOrdersByTime(hours) {
      const now = new Date();
      const timeLimit = new Date(now.getTime() - hours * 60 * 60 * 1000);

      return orders.filter((order) => new Date(order.createdAt) >= timeLimit);
    }

    res.status(200).send({
      status: 'success',
      data: {
        totalIncome: totalIncome,
        totalQuantity: totalQuantity,
        totalOrders: orders.length,
        totalCouponUse: totalCouponUse,
        ordersOneHour: filterOrdersByTime(1),
        ordersSixHour: filterOrdersByTime(6),
        ordersTwelveHour: filterOrdersByTime(12),
        ordersOneDay: filterOrdersByTime(24),
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllPendapatan = async (req, res) => {
  try {
    const orders = await Order.find();

    const filterByDateRange = (days) => {
      const now = new Date();
      return orders.filter((item) => {
        const diffTime = Math.abs(now.getTime() - item.order_date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days;
      });
    };

    const generateChartData = (filteredData, daysRange) => {
      const now = new Date();
      let chartData = [];

      for (let i = 0; i < daysRange; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);

        const formattedDate = `${date.getDate()} ${date.toLocaleString(
          'id-ID',
          {
            month: 'long',
          }
        )}`;

        const totalIncome = filteredData
          .filter(
            (item) =>
              item.order_date.toLocaleDateString() === date.toLocaleDateString()
          )
          .reduce((sum, item) => sum + item.total_price_with_tax, 0);

        chartData.push({
          date: formattedDate,
          income: totalIncome,
        });
      }

      return chartData.reverse();
    };

    res.status(200).send({
      status: 'success',
      data: {
        oneweek: generateChartData(filterByDateRange(7), 7),
        onemonth: generateChartData(filterByDateRange(31), 31),
        threemonth: generateChartData(filterByDateRange(93), 93),
        twelvemonth: generateChartData(filterByDateRange(365), 365),
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
