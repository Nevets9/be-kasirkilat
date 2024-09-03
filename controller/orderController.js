exports.createOrder = async (req, res) => {
  const {
    order_items,
    customer_id,
    payment_method,
    tax,
    coupon,
    discount_amount,
    employee_number,
  } = req.body;

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

    // Terapkan pajak dan diskon dari kupon
    const totalAfterDiscount = totalPrice - (discount_amount || 0);
    const totalWithTax = totalAfterDiscount + (tax || 0);

    // Buat order baru
    const order = new Order({
      customer_id: customer_id || null,
      total_price: totalWithTax,
      order_items: createdOrderItems,
      payment_method: payment_method || 'cash',
      payment_status: 'unpaid',
      tax: tax || 0,
      coupon: coupon || null,
      discount_amount: discount_amount || 0,
      employee_number: employee_number,
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
