ROUTE LOGIN USER (POST):
https://be-kasirkilat.vercel.app//api/v1/user
request:
{
    "nomorPegawai": "KASIR1",
    "password": "kasir1"
}
response:
{
    "message": "Login successful",
    "data": {
        "user": {
            "_id": "66ebe3f75c7b1be07addcb89",
            "nama": "Kasir1",
            "nomorPegawai": "KASIR1",
            "password": "kasir1",
            "role": "user",
            "__v": 0
        }
    }
}

ROUTE CREATE USER (POST):
https://be-kasirkilat.vercel.app//api/v1/user/create
request:
{
    "nama": "Kasir2",
    "nomorPegawai": "KASIR2",
    "password": "kasir2",
    "role": "user"
}
response:
{
    "status": "success create user",
    "data": {
        "user": {
            "nama": "Kasir2",
            "nomorPegawai": "KASIR2",
            "password": "kasir2",
            "role": "user",
            "_id": "66ec40cdcc570754054496ea",
            "__v": 0
        }
    }
}

ROUTE GET ALL PRODUKS (GET):
https://be-kasirkilat.vercel.app//api/v1/produk

ROUTE CREATE PRODUK (POST):
https://be-kasirkilat.vercel.app//api/v1/produk
request:
{
    "nama_produk": "Sapi Goreng",
    "harga_produk": 45000,
    "stok_produk": 20,
    "tipe_produk": "makanan"
}
response:
{
    "status": "success",
    "data": {
        "produk": {
        "nama_produk": "Sapi Goreng",
        "harga_produk": 45000,
        "stok_produk": 20,
        "tipe_produk": "makanan",
        "\_id": "66ec3e79cc570754054496e2",
        "createdAt": "2024-09-19T15:08:41.852Z",
        "updatedAt": "2024-09-19T15:08:41.852Z",
        "slug_produk": "sapi-goreng",
        "\_\_v": 0
        }
    }
}

ROUTE GET PRODUK BY ID (GET):
https://be-kasirkilat.vercel.app//api/v1/produk/:id

ROUTE UPDATE BY ID (PATCH):
https://be-kasirkilat.vercel.app//api/v1/produk/:id
request:
{
    "harga_produk": "30000"
}
response:
{
    "status": "success",
    "data": {
        "produk": {
            "_id": "66dfd7b1049e42ec9142a577",
            "nama_produk": "Nasi Goreng",
            "harga_produk": 30000,
            "stok_produk": 40,
            "tipe_produk": "makanan",
            "slug_produk": "nasi-goreng",
            "createdAt": "2024-09-10T05:22:57.359Z",
            "updatedAt": "2024-09-19T15:24:00.504Z",
            "__v": 0,
            "gambar_produk": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Fnasi-goreng&psig=AOvVaw3DyGPY0csCmIJvEyFx0Gnp&ust=1726760138348000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLCFj_nozIgDFQAAAAAdAAAAABAE"
        }
    }
}

ROUTE DELETE BY ID (DELETE):
https://be-kasirkilat.vercel.app//api/v1/produk/:id

ROUTE GET ALL ORDERS (GET):
https://be-kasirkilat.vercel.app//api/v1/order

ROUTE CREATE ORDER (POST):
https://be-kasirkilat.vercel.app//api/v1/order
request:
{
    "order_items": [
        {
        "product_id": "66dfd7b1049e42ec9142a577",
        "quantity": 2
        }
    ],
    "coupon": {
        "couponId": "66e6ef6b22ed2987b0934dfa"
    },
    "payment_method": "cash"
}  
response:
{
    "status": "success",
    "data": {
        "result": {
            "order_date": "2024-09-19T15:08:34.616Z",
            "status": "pending",
            "total_price": 50000,
            "total_price_with_tax": 55500,
            "order_items": [
                {
                    "product_id": "66dfd7b1049e42ec9142a577",
                    "product_name": "Nasi Goreng",
                    "quantity": 2,
                    "_id": "66ec3f1acc570754054496e6"
                }
            ],
            "payment_method": "cash",
            "tax": 0.11,
            "coupon": null,
            "discount_amount": 0,
            "_id": "66ec3f1acc570754054496e5",
            "createdAt": "2024-09-19T15:11:22.365Z",
            "updatedAt": "2024-09-19T15:11:22.365Z",
            "__v": 0
        }
    }
}
ROUTE GET ALL COUPONS (GET):
https://be-kasirkilat.vercel.app//api/v1/coupon

ROUTE CREATE COUPON (POST):
https://be-kasirkilat.vercel.app//api/v1/coupon
request: 
{
    "kodeCoupon": "KUPONTEST2",
    "awalCoupon": "2024-9-19",
    "akhirCoupon": "2024-9-25",
    "besarDiscount": 0.15,
    "deskripsi": "kode diskon yang memperingati hari....",
    "payment_method": "cash"
}
response:
{
    "status": "success",
    "data": {
        "coupon": {
            "kodeCoupon": "KUPONTEST2",
            "awalCoupon": "2024-09-18T17:00:00.000Z",
            "akhirCoupon": "2024-09-24T17:00:00.000Z",
            "besarDiscount": 0.15,
            "deskripsi": "kode diskon yang memperingati hari....",
            "payment_method": "cash",
            "_id": "66ec41b2f988991788982207",
            "createdAt": "2024-09-19T15:22:26.472Z",
            "updatedAt": "2024-09-19T15:22:26.472Z",
            "__v": 0
        }
    }
}
