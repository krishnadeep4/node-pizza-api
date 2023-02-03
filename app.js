const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const User = require("./src/model/UserModel");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const auth = require("./src/utils/auth");
const allPizza = require("./src/utils/pizzas.json");
const Order = require("./src/model/OrderModel");
require("dotenv/config");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!email || !password) {
      return res.json({
        message: "please enter email or password",
        statusCode: 406,
      });
    } else {
      const tmpUser = await User.findOne({ email: email });
      if (tmpUser)
        return res.json({ message: "email already exist", statusCode: 406 });
      else {
        const userData = new User({
          username: username,
          email: email,
          password: password,
        });
        userData.save();
        return res.json("DONE");
      }
    }
  } catch (err) {
    return res.json({
      message: "internal server error",
      statusCode: 500,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("entered===========-=-=-=-=-");
    const tmpUser = await User.findOne({ email: email });
    if (!tmpUser) {
      return res.json({ message: "invalid email", statusCode: 406 });
    } else {
      if (password != tmpUser.password) {
        return res.json({ message: "Password did not match", statusCode: 406 });
      } else {
        const jwToken = jwt.sign(
          {
            userName: tmpUser.name,
            Email: tmpUser.email,
          },
          process.env.jwtSecret1,
          { expiresIn: "15d", algorithm: "HS256" }
        );
        return res.json({ statusCode: 201, token: jwToken, data: tmpUser });
      }
    }
  } catch (err) {
    console.log(err);
    return res.json({
      message: "internal server error",
      statusCode: 500,
    });
  }
});

app.get("/getAllPizza", auth, (req, res) => {
  try {
    return res.json({ status: 200, message: "success", data: allPizza });
  } catch (err) {
    return res.json(err);
    console.log(err);
  }
});

app.post("/createOrder", auth, async (req, res) => {
  try {
    const { email, pizzaIds } = req.body;
    const tmpUser = await User.findOne({ email: email });
    if (!email || !pizzaIds || !tmpUser) {
      return res.json({ message: "please send correct data" });
    } else {
      const tmpUser = await Order.findOne({ email: email });
      if (tmpUser) {
        return res.json({ message: "order already exist"});
      } else {
        const newOrder = new Order({
          email,
          pizzaIds,
        });
        newOrder.save();
        return res.json({ message: "Order Added Successfully" });
      }
    }
  } catch (err) {
    return res.json({
      message: "internal server error",
      statusCode: 500,
    });
  }
});

app.patch("/updateOrder", auth, async (req, res) => {
  try {
    const { email, pizzaIds } = req.body;
    const tmpUser = await Order.findOne({ email: email });
    if (!email || !pizzaIds || !tmpUser) {
      return res.json({ message: "please send correct data" });
    } else {
      const data = await Order.findOneAndUpdate(
        { email: email },
        { pizzaIds: pizzaIds }
      );
      return res.json({ message: "Success", data: data }).status(200);
    }
  } catch (err) {
    return res.json({
      message: "internal server error",
      statusCode: 500,
    });
  }
});

app.delete("/deleteOrder", auth, async (req, res) => {
  try {
    const { email } = req.body;
    const tmpUser = await Order.findOne({ email: email });
    if (!tmpUser) {
      return res.json({ message: "no Order for this email exists" });
    } else {
      const data = await Order.findOneAndDelete({ email: email });
      return res
        .json({ message: "Order Deleted Successfully", data: data })
        .status(200);
    }
  } catch (err) {
    return res.json({
      message: "internal server error",
      statusCode: 500,
    });
  }
});

app.get("/getOrder", auth, async (req, res) => {
  try {
    const { email } = req.query;
    console.log("email=====-=====> ", email);
    const tmpUser = await Order.findOne({ email: email });
    if (!tmpUser) {
      return res.json({ message: "no orders for this email exists" });
    } else {
      return res.json({ message: "Success", data: tmpUser }).status(200);
    }
  } catch (err) {
    return res.json({
      message: "internal server error",
      statusCode: 500,
    });
  }
});

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected");
    }
  }
);

app.listen(PORT, (error) => {
  console.log(`listing to port ${PORT}`);
});
