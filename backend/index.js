// ============================================================
//  Sugar Daddy's Bake Shoppe — Backend API
//  Built on Express + MongoDB (Mongoose)
// ============================================================

require('dotenv').config();

const port      = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET || "sugardaddys_secret_2024";

const express  = require("express");
const app      = express();
const mongoose = require("mongoose");
const jwt      = require("jsonwebtoken");
const multer   = require("multer");
const path     = require("path");
const cors     = require("cors");

app.use(express.json());
app.use(cors());

if (!MONGO_URI) {
    console.error("❌  MONGO_URI is not set. Please check your .env file.");
    process.exit(1);
}

// ──────────────────────────────────────────────
//  DATABASE CONNECTION
// ──────────────────────────────────────────────
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅  MongoDB connected"))
    .catch(err => console.error("❌  MongoDB connection error:", err));

// ──────────────────────────────────────────────
//  HEALTH CHECK
// ──────────────────────────────────────────────
app.get("/", (req, res) => {
    res.send("🍪 Sugar Daddy's API is running");
});

// ──────────────────────────────────────────────
//  IMAGE UPLOAD
// ──────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// ──────────────────────────────────────────────
//  PRODUCT SCHEMA
//  Categories: classic | artisanal | exotic | custom
// ──────────────────────────────────────────────
const Product = mongoose.model("Product", {
    id:           { type: Number,  required: true },
    name:         { type: String,  required: true },
    image:        { type: String,  required: true },
    category:     { type: String,  required: true },
    subcategory:  { type: String,  default: '' },
    brand:        { type: String,  default: '' },
    new_price:    { type: Number,  required: 0 },
    old_price:    { type: Number,  required: 0 },
    date:         { type: Date,    default: Date.now },
    description:  { type: String,  required: true },
    available:    { type: Boolean, default: true },
    ingredients:  { type: String,  default: '' },
    origin:       { type: String,  default: '' },
    allergens:    { type: String,  default: '' },
});

// Add product
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last = products.slice(-1)[0];
        id = last.id + 1;
    } else { id = 1; }

    const product = new Product({
        id,
        name:         req.body.name,
        image:        req.body.image,
        category:     req.body.category,
        subcategory:  req.body.subcategory  || '',
        brand:        req.body.brand        || '',
        new_price:    parseFloat(req.body.new_price) || 0,
        old_price:    parseFloat(req.body.old_price) || 0,
        description:  req.body.description,
        ingredients:  req.body.ingredients  || '',
        origin:       req.body.origin       || '',
        allergens:    req.body.allergens     || '',
    });

    await product.save();
    console.log("✅  Product saved:", product.name);
    res.json({ success: true, name: req.body.name });
});

// Remove product
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("🗑️  Product removed:", req.body.id);
    res.json({ success: true, name: req.body.name });
});

// Get all products
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("📦  All products fetched");
    res.send(products);
});

// Edit product
app.post('/editproduct', async (req, res) => {
    try {
        const { id, name, description, category, subcategory, brand,
                new_price, old_price, image, ingredients, origin, allergens } = req.body;
        const update = { name, description, category, subcategory, brand,
                         new_price, old_price, ingredients, origin, allergens };
        if (image) update.image = image;
        await Product.findOneAndUpdate({ id: Number(id) }, update);
        console.log("✏️  Product updated:", id);
        res.json({ success: true });
    } catch (error) {
        console.error("Edit product error:", error);
        res.status(500).json({ success: false });
    }
});

// ──────────────────────────────────────────────
//  HOMEPAGE ENDPOINTS
// ──────────────────────────────────────────────
app.get('/popularinchat', async (req, res) => {
    let products = await Product.find({ category: "classic" });
    let popular = products.slice(0, 4);
    console.log("🍪  Popular classics fetched");
    res.send(popular);
});

app.get('/newcollections', async (req, res) => {
    let products = await Product.find({}).sort({ date: -1 });
    let newcollection = products.slice(0, 8);
    console.log("✨  New arrivals fetched");
    res.send(newcollection);
});

// ──────────────────────────────────────────────
//  USER SCHEMA & AUTH
// ──────────────────────────────────────────────
const Users = mongoose.model('Users', {
    name:      { type: String },
    email:     { type: String, unique: true },
    password:  { type: String },
    cartData:  { type: Object },
    phone:     { type: String, default: '' },
    address:   { type: String, default: '' },
    city:      { type: String, default: '' },
    date:      { type: Date,   default: Date.now }
});

// Sign up
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "An account with this email already exists." });
    }
    let cart = {};
    for (let i = 0; i < 300; i++) { cart[i] = 0; }
    const user = new Users({
        name:     req.body.username,
        email:    req.body.email,
        password: req.body.password,
        cartData: cart
    });
    await user.save();
    const token = jwt.sign({ user: { id: user._id } }, JWT_SECRET);
    res.json({ success: true, token });
});

// Login
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passMatch = req.body.password === user.password;
        if (passMatch) {
            const token = jwt.sign({ user: { id: user.id } }, JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: "Incorrect password." });
        }
    } else {
        res.json({ success: false, errors: "No account found with that email." });
    }
});

// ──────────────────────────────────────────────
//  AUTH MIDDLEWARE
// ──────────────────────────────────────────────
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ errors: "Authentication required. Please sign in." });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Invalid or expired token. Please sign in again." });
    }
};

// ──────────────────────────────────────────────
//  CART
// ──────────────────────────────────────────────
app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        if (!userData) return res.status(400).json({ errors: "User not found." });
        if (!userData.cartData) userData.cartData = {};
        userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Added to cart");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong." });
    }
});

app.post('/removefromcart', fetchUser, async (req, res) => {
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed from cart");
});

app.post('/getcart', fetchUser, async (req, res) => {
    console.log("🛒  Get cart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
});

// ──────────────────────────────────────────────
//  ORDER SYSTEM
// ──────────────────────────────────────────────
const Order = mongoose.model('Order', {
    orderId:        { type: mongoose.Schema.Types.Mixed, required: true },
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    products:       [{ type: Object }],
    customerInfo:   {
        fullName: String,
        email:    String,
        phone:    String,
        address:  String,
        city:     String
    },
    deliveryMethod: { type: String, enum: ['delivery', 'pickup'], default: 'delivery' },
    paymentMethod:  { type: String, enum: ['cash', 'online'],    default: 'cash' },
    paymentStatus:  { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    subtotal:       { type: Number },
    shippingFee:    { type: Number, default: 0 },
    total:          { type: Number, required: true },
    status:         { type: String, default: 'Pending' },
    notes:          { type: String, default: '' },
    date:           { type: Date,   default: Date.now },
});

function generateOrderId() {
    const ts   = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SD-${ts}-${rand}`;
}

// Create order
app.post('/createorder', fetchUser, async (req, res) => {
    try {
        const { products, subtotal, shippingFee, total,
                customerInfo, deliveryMethod, paymentMethod, notes } = req.body;

        const validProducts = [];
        for (const item of products) {
            if (item.quantity > 0) {
                const pd = await Product.findOne({ id: Number(item.productId) });
                validProducts.push({
                    productId: Number(item.productId),
                    name:      pd ? pd.name      : `Cookie #${item.productId}`,
                    image:     pd ? pd.image     : '',
                    price:     pd ? pd.new_price : 0,
                    quantity:  item.quantity,
                });
            }
        }

        if (validProducts.length === 0) {
            return res.json({ success: false, message: "Your cart is empty." });
        }

        const order = new Order({
            orderId:        generateOrderId(),
            userId:         req.user.id,
            products:       validProducts,
            customerInfo:   customerInfo   || {},
            deliveryMethod: deliveryMethod || 'delivery',
            paymentMethod:  paymentMethod  || 'cash',
            paymentStatus:  'pending',
            subtotal:       subtotal || total,
            shippingFee:    shippingFee || 0,
            total:          total,
            notes:          notes || '',
        });

        await order.save();

        let cart = {};
        for (let i = 0; i < 300; i++) { cart[i] = 0; }
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: cart });

        console.log("📬  Order created:", order.orderId);
        res.json({ success: true, orderId: order.orderId, message: "Order placed successfully!" });
    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ success: false, message: "Failed to create order. Please try again." });
    }
});

// Admin: get all orders
app.get('/allorders', async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('userId', 'name email')
            .sort({ date: -1 });

        const cleanedOrders = await Promise.all(orders.map(async (order) => {
            const o = order.toObject();
            const cleanProducts = [];
            for (const p of o.products) {
                if ((p.quantity || 0) > 0) {
                    if (!p.name && p.productId) {
                        const pd = await Product.findOne({ id: Number(p.productId) });
                        p.name  = pd ? pd.name      : `Cookie #${p.productId}`;
                        p.image = pd ? pd.image     : '';
                        p.price = pd ? pd.new_price : 0;
                    }
                    cleanProducts.push(p);
                }
            }
            o.products = cleanProducts;
            return o;
        }));

        res.json(cleanedOrders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Failed to fetch orders." });
    }
});

// Admin: update order status
app.post('/updateorderstatus', async (req, res) => {
    try {
        const { orderId, status } = req.body;
        console.log("🔄  Updating order:", orderId, "->", status);

        let result = await Order.findOneAndUpdate({ orderId }, { status });
        if (!result && !isNaN(orderId)) {
            result = await Order.findOneAndUpdate({ orderId: Number(orderId) }, { status });
        }

        console.log("Update result:", result ? "✅ found" : "❌ not found");
        res.json({ success: !!result });
    } catch (error) {
        console.error("Update order error:", error);
        res.status(500).json({ success: false });
    }
});

// User: get my orders
app.get('/myorders', fetchUser, async (req, res) => {
    try {
        let orders = await Order.find({ userId: req.user.id }).sort({ date: -1 });

        const cleaned = await Promise.all(orders.map(async (order) => {
            const o = order.toObject();
            const cleanProducts = [];
            for (const p of o.products) {
                if ((p.quantity || 0) > 0) {
                    if (!p.name && p.productId) {
                        const pd = await Product.findOne({ id: Number(p.productId) });
                        p.name  = pd ? pd.name      : `Cookie #${p.productId}`;
                        p.price = pd ? pd.new_price : 0;
                    }
                    cleanProducts.push(p);
                }
            }
            o.products = cleanProducts;
            return o;
        }));

        res.json(cleaned);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch your orders." });
    }
});

// ──────────────────────────────────────────────
//  USER PROFILE
// ──────────────────────────────────────────────
app.get('/getuser', fetchUser, async (req, res) => {
    try {
        let user = await Users.findOne({ _id: req.user.id }).select('-password -cartData');
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        res.json({
            success: true,
            user: {
                name:    user.name,
                email:   user.email,
                date:    user.date,
                phone:   user.phone   || '',
                address: user.address || '',
                city:    user.city    || ''
            }
        });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.post('/updateuser', fetchUser, async (req, res) => {
    try {
        const { name, phone, address, city } = req.body;
        await Users.findOneAndUpdate({ _id: req.user.id }, { name, phone, address, city });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update profile." });
    }
});

app.post('/changepassword', fetchUser, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        let user = await Users.findOne({ _id: req.user.id });
        if (!user) return res.status(404).json({ success: false, message: "User not found." });
        if (user.password !== oldPassword) {
            return res.json({ success: false, message: "Current password is incorrect." });
        }
        await Users.findOneAndUpdate({ _id: req.user.id }, { password: newPassword });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to change password." });
    }
});

// ──────────────────────────────────────────────
//  PAYMENT ENDPOINTS (stub — ready for Stripe)
// ──────────────────────────────────────────────
app.post('/create-payment', fetchUser, async (req, res) => {
    try {
        res.json({
            success: true,
            paymentUrl: null,
            message: "Online payment coming soon. Please use cash on delivery for now."
        });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

app.post('/verify-payment', async (req, res) => {
    try {
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false });
    }
});

// ──────────────────────────────────────────────
//  START SERVER
// ──────────────────────────────────────────────
app.listen(port, (error) => {
    if (!error) {
        console.log(`\n🍪  Sugar Daddy's API running on http://localhost:${port}\n`);
    } else {
        console.log("Server error:", error);
    }
});
