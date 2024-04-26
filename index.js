const express = require("express");
const mongoose = require("mongoose");
const app = express();

const jsonparser = require("body-parser");
const bodyparser = jsonparser.json();

const cors = require("cors");
app.use(cors());
const jwt = require("jsonwebtoken");

const atlasurl =
  "mongodb+srv://ajinkya8970:root123@cluster0.mr5fzto.mongodb.net/ajinkyaDb?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(atlasurl)
  .then(() => {
    console.log("database connection is  successfull");
  })
  .catch(() => {
    console.log("error");
  });

const Item = mongoose.model("products", {
  id: Number,
  title: String,

  description: String,
  price: Number,
  discountPercentage: Number,

  rating: Number,
  stock: Number,

  brand: String,
  category: String,

  thumbnail: String,

  images: Array,
});

const cart = mongoose.model("cartproducts", {
  title: String,
  images: Array,

  price: Number,
  qty: Number,
});
app.get("/getdata", (req, res) => {
  Item.find().then((data) => {
    res.send(data);
  });
});
app.get("/getdatacartproducts", (req, res) => {
  cart.find().then((data) => {
    res.send(data);
  });
});

app.post("/adddtocart", bodyparser, (req, res) => {
  let title = req.body.title;
  let images = req.body.images;
  let price = req.body.price;
  let qty = 1;

  cart.insertMany({ title, images, price, qty }).then((data) => res.json(data));
});

app.delete("/deletemethod/:id", (req, res) => {
  const id = req?.params?.id;
  cart.deleteOne({ _id: id }).then((data) => res.send(data));
});

app.put("/updateqty/:id", bodyparser, (req, res) => {
  let id = req.params.id;

  let qty = req.body.qty + 1;
  console.log(qty);

  cart.updateOne({ _id: id }, { qty: qty }).then((data) => res.json(data));
});
app.put("/updatdecqty/:id", bodyparser, (req, res) => {
  let id = req.params.id;

  let qty = req.body.qty - 1;
  console.log(qty);

  cart.updateOne({ _id: id }, { qty: qty }).then((data) => res.json(data));
});
const user = mongoose.model("newusers", {
  username: String,
  password: String,
});
app.post("/addduser", bodyparser, (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  user.insertMany({ username, password }).then((data) => res.json(data));
});
app.post("/verifyuser", bodyparser, async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  // Check if the username exists
  let existingUser = await user.findOne({ username });
  if (existingUser) {
    const token = jwt.sign({ username: existingUser.username }, "secretKey");

    res.status(200).json({ message: "User verified", token });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});
app.listen(3500);
