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

    // Fungsi untuk memfilter pesanan berdasarkan jumlah hari (1 bulan)
    function filterOrdersByDays(days) {
      const now = new Date();
      const timeLimit = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      return orders.filter((order) => new Date(order.createdAt) >= timeLimit);
    }

    // Filter orders untuk 1 bulan terakhir
    const filteredOrders = filterOrdersByDays(30);

    // Menghitung total income, quantity, dan coupon use dari orders yang terfilter
    filteredOrders.forEach((item) => {
      totalIncome += item.total_price_with_tax;

      item.order_items.forEach((result) => {
        totalQuantity += result.quantity;
      });

      if (item.coupon && item.coupon.couponId) {
        totalCouponUse += 1;
      }
    });

    res.status(200).send({
      status: 'success',
      data: {
        totalIncome: totalIncome,
        totalQuantity: totalQuantity,
        totalOrders: filteredOrders.length, // Hanya orders dalam 1 bulan terakhir
        totalCouponUse: totalCouponUse,
        ordersOneHour: filterOrdersByDays(1 / 24), // 1 jam = 1/24 hari
        ordersSixHour: filterOrdersByDays(6 / 24), // 6 jam = 6/24 hari
        ordersTwelveHour: filterOrdersByDays(12 / 24), // 12 jam = 12/24 hari
        ordersOneDay: filterOrdersByDays(1), // 1 hari
        ordersOneMonth: filteredOrders, // Pesanan dalam 1 bulan terakhir
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

    // Fungsi untuk memfilter pesanan berdasarkan jumlah hari
    const filterByDateRange = (days) => {
      const now = new Date();
      return orders.filter((item) => {
        const diffTime = Math.abs(now.getTime() - item.order_date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days;
      });
    };

    // Fungsi untuk mengelompokkan pendapatan per minggu
    const generateWeeklyChartData = (filteredData, weeksRange) => {
      const now = new Date();
      let chartData = [];

      for (let week = 0; week < weeksRange; week++) {
        const startOfWeek = new Date(now);
        const endOfWeek = new Date(now);

        startOfWeek.setDate(now.getDate() - (week + 1) * 7);
        endOfWeek.setDate(now.getDate() - week * 7);

        const formattedWeek = `Minggu ke-${weeksRange - week}`;

        // Total pendapatan untuk satu minggu tersebut
        const totalIncome = filteredData
          .filter((item) => {
            const orderDate = new Date(item.order_date);
            return orderDate >= startOfWeek && orderDate < endOfWeek;
          })
          .reduce((sum, item) => sum + item.total_price_with_tax, 0);

        chartData.push({
          week: formattedWeek,
          income: totalIncome,
        });
      }

      return chartData.reverse(); // Urutkan minggu dari terlama ke terbaru
    };

    // Menghitung jumlah minggu berdasarkan rentang hari
    const weeksInMonth = Math.ceil(31 / 7); // 31 hari, dibagi 7 hari per minggu
    const weeksInTwoMonths = Math.ceil(62 / 7); // 62 hari, dibagi 7 hari per minggu
    const weeksInThreeMonths = Math.ceil(93 / 7); // 93 hari, dibagi 7 hari per minggu

    // Mendapatkan data untuk 1 bulan, 2 bulan, dan 3 bulan
    const lastOneMonthData = filterByDateRange(31);
    const lastTwoMonthData = filterByDateRange(62);
    const lastThreeMonthData = filterByDateRange(93);

    // Menghasilkan data pendapatan mingguan
    const weeklyDataOneMonth = generateWeeklyChartData(
      lastOneMonthData,
      weeksInMonth
    );
    const weeklyDataTwoMonth = generateWeeklyChartData(
      lastTwoMonthData,
      weeksInTwoMonths
    );
    const weeklyDataThreeMonth = generateWeeklyChartData(
      lastThreeMonthData,
      weeksInThreeMonths
    );

    res.status(200).send({
      status: 'success',
      data: {
        oneMonth: weeklyDataOneMonth,
        twoMonth: weeklyDataTwoMonth,
        threeMonth: weeklyDataThreeMonth,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getAllPelanggan = async (req, res) => {
  try {
    const orders = await Order.find();

    // Fungsi untuk memfilter pesanan berdasarkan jumlah hari
    const filterByDateRange = (days) => {
      const now = new Date();
      const timeLimit = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      return orders.filter((item) => new Date(item.order_date) >= timeLimit);
    };

    // Fungsi untuk menghasilkan data chart berdasarkan jumlah pesanan per hari
    const generateOrderCountData = (filteredData, daysRange) => {
      const now = new Date();
      const chartData = [];

      for (let i = 0; i < daysRange; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);

        const formattedDate = `${date.getDate()} ${date.toLocaleString(
          'id-ID',
          {
            month: 'long',
          }
        )}`;

        // Menghitung jumlah pesanan pada hari tersebut
        const totalOrders = filteredData.filter(
          (item) =>
            new Date(item.order_date).toLocaleDateString() ===
            date.toLocaleDateString()
        ).length;

        chartData.push({
          date: formattedDate,
          orders: totalOrders,
        });
      }

      return chartData.reverse(); // Mengembalikan data agar urut dari tanggal terlama ke terbaru
    };

    // Mendapatkan data untuk 7 hari, 31 hari, dan 1 tahun terakhir
    const last7DaysData = filterByDateRange(7);
    const last31DaysData = filterByDateRange(31);
    const last1YearData = filterByDateRange(365);

    // Menghasilkan data chart dengan jumlah pesanan
    const chartData7Days = generateOrderCountData(last7DaysData, 7);
    const chartData31Days = generateOrderCountData(last31DaysData, 31);
    const chartData1Year = generateOrderCountData(last1YearData, 365);

    res.status(200).send({
      status: 'success',
      data: {
        oneweek: chartData7Days,
        onemonth: chartData31Days,
        threemonth: chartData1Year, // Perbaikan: Harusnya mungkin 'oneyear'
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getPopularMenu = async (req, res) => {
  let firstDate;
  let lastDate;

  const monthNow = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  console.log(monthNow);
  console.log(currentYear);

  if (req.params.mon == 0) {
    lastDate = new Date();
    firstDate = new Date(`${currentYear}-${monthNow}-01`);
  } else if (req.params.mon == 1) {
    lastDate = new Date(`${currentYear}-${monthNow - req.params.mon}-30`);
    firstDate = new Date(`${currentYear}-${monthNow - req.params.mon}-01`);
  } else if (req.params.mon == 2) {
    lastDate = new Date(`${currentYear}-${monthNow - req.params.mon}-30`);
    firstDate = new Date(`${currentYear}-${monthNow - req.params.mon}-01`);
  }
  try {
    // const today = new Date();
    // const lastMonth = new Date(today);
    // lastMonth.setMonth(today.getMonth() - 1); // Mengurangi satu bulan
    // console.log(lastMonth);

    // Query untuk mendapatkan order antara `lastMonth` dan `today`
    const orders = await Order.find({
      order_date: {
        $gte: firstDate,
        $lte: lastDate,
      },
    });

    const getGambarProduk = async (productName) => {
      const produk = await Produk.findOne({ nama_produk: productName });
      return produk ? produk.gambar_produk : null; // Gunakan gambar default jika null
    };

    const getTopThreeProducts = async (orders) => {
      const productCount = {};
      const productImages = {};

      // Gunakan Promise.all untuk menjalankan operasi async secara paralel
      await Promise.all(
        orders.map(async (order) => {
          await Promise.all(
            order.order_items.map(async (item) => {
              const productName = item.product_name;
              if (!productImages[productName]) {
                productImages[productName] = await getGambarProduk(productName);
              }

              if (productCount[productName]) {
                productCount[productName] += item.quantity;
              } else {
                productCount[productName] = item.quantity;
              }
            })
          );
        })
      );

      const productArray = Object.entries(productCount).map(
        ([productName, count]) => ({
          product_name: productName,
          count: count,
          gambar_produk: productImages[productName],
        })
      );

      productArray.sort((a, b) => b.count - a.count);

      return productArray.slice(0, 3);
    };

    const topThreeProducts = await getTopThreeProducts(orders);

    res.status(200).send({
      status: 'success',
      data: topThreeProducts,
      lastDate,
      firstDate,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
