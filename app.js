// rzp_test_3wNdrQGujnrR49
// L51h76Ef0a4Y439FvlCK9qSZ

let express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const bodyParser = require("body-parser");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const ejs = require("ejs");
const shortid = require("shortid");

dotenv.config();
let app = express();

const instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

//MIM
app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.set("view engine", "ejs");

//routes
app.get("/payments", (req, res) => {
  res.render("payment", { key: process.env.KEY_ID });
});
app.get("/", (req, res) => {
  res.render("home", { key: process.env.KEY_ID });
});
app.post("/razorpay", async (req, res) => {
  try {
    console.log(req.body);
    const { amount } = req.body;
    const payment_capture = 1;
    const currency = "INR";
    const options = {
      amount: amount * 100,
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };
    const response = await instance.orders.create(options);
    res.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/payment/verify", (req, res) => {
  body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

  var expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");
  console.log("sig" + req.body.razorpay_signature);
  console.log("sig" + expectedSignature);
  var response = { status: "failure" };
  if (expectedSignature === req.body.razorpay_signature)
    response = { status: "success" };
  res.send(response);
});
app.listen("3000", () => {
  console.log("server started");
});
