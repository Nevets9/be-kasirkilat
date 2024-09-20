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

    function getOrdersInRange(orders, rangeType) {
      const now = new Date();
      let startDate;

      switch (rangeType) {
        case 'week': // Satu minggu terakhir (7 hari)
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 hari terakhir
          break;
        case 'month': // Satu bulan terakhir
          startDate = new Date(now.setMonth(now.getMonth() - 1)); // 1 bulan terakhir
          break;
        case 'year': // Satu tahun terakhir
          startDate = new Date(now.setFullYear(now.getFullYear() - 1)); // 1 tahun terakhir
          break;
        default:
          throw new Error(
            'Invalid range type. Use "week", "month", or "year".'
          );
      }

      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startDate && orderDate <= now;
      });
    }

    function calculateDailyEarnings(orders, month, year) {
      const daysInMonth = new Date(year, month, 0).getDate(); // Jumlah hari dalam bulan
      const dailyEarnings = Array(daysInMonth).fill(0); // Inisialisasi array untuk pendapatan harian

      orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const day = orderDate.getDate(); // Ambil tanggal dari order
        dailyEarnings[day - 1] += order.total_price_with_tax; // Tambah pendapatan pada hari yang sesuai
      });

      // Tampilkan pendapatan harian dari tanggal 1 hingga 31
      for (let i = 0; i < daysInMonth; i++) {
        console.log(`Tanggal ${i + 1}: Pendapatan = ${dailyEarnings[i]}`);
      }
    }

    // Fungsi untuk menghitung pendapatan dalam rentang waktu (fleksibel)
    function calculateEarningsByRange(orders, rangeType) {
      const now = new Date();
      const filteredOrders = getOrdersInRange(orders, rangeType);

      if (rangeType === 'week') {
        // Hitung pendapatan dalam satu minggu terakhir
        console.log('Pendapatan satu minggu terakhir:');
        calculateDailyEarnings(
          filteredOrders,
          now.getMonth() + 1,
          now.getFullYear()
        );
      } else if (rangeType === 'month') {
        // Hitung pendapatan dalam satu bulan terakhir
        console.log('Pendapatan satu bulan terakhir:');
        calculateDailyEarnings(
          filteredOrders,
          now.getMonth() + 1,
          now.getFullYear()
        );
      } else if (rangeType === 'year') {
        // Hitung pendapatan dalam satu tahun terakhir
        console.log('Pendapatan satu tahun terakhir:');
        for (let month = 0; month < 12; month++) {
          calculateDailyEarnings(filteredOrders, month + 1, now.getFullYear());
        }
      }
    }

    // Menghitung pendapatan dalam rentang waktu yang berbeda
    calculateEarningsByRange(orders, 'week'); // Untuk pendapatan satu minggu terakhir
    calculateEarningsByRange(orders, 'month'); // Untuk pendapatan satu bulan terakhir
    calculateEarningsByRange(orders, 'year'); // Untuk pendapatan satu tahun terakhir

    function formatOrderData(orders) {
      const dailyEarnings = {};
    
      orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const day = orderDate.getDate(); // Mengambil tanggal dari createdAt
        const month = orderDate.toLocaleString('id-ID', { month: 'long' }); // Mengubah bulan ke format bahasa Indonesia
        const dateKey = `${day} ${month}`; // Membentuk string "12 Agustus" misalnya
    
        if (!dailyEarnings[dateKey]) {
          dailyEarnings[dateKey] = 0; // Inisialisasi jika belum ada data untuk hari itu
        }
        dailyEarnings[dateKey] += order.total_price_with_tax; // Tambahkan pendapatan dari order
      });
    
      // Ubah dailyEarnings ke array seperti chartData yang diinginkan
      const chartData = Object.keys(dailyEarnings).map(date => ({
        date,
        income: dailyEarnings[date],
      }));
    
      return chartData;
    }
    
    // Panggil fungsi untuk mendapatkan data dalam format chartData
    const result = formatOrderData(orders);
    console.log(result);
    

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
