const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

connectDB();

const app = express();

// Init Middleware
app.use(express.json({ extended: false }));

// @route GET /api
// @desc Get the initial response from the Server
// @access Public
app.get("/api", (req, res) => {
  res.status(200).json({
    msg: "Welcome to the APIs of this demo app",
    author: "Ahmed Faraz",
  });
});

// OTHER ROUTES
// user routes
app.use("/api/user", require("./routes/user"));
// posts routes
app.use("/api/posts", require("./routes/posts"));
// auth routes
app.use("/api/auth", require("./routes/auth"));

// @route GET *
// @desc Get the initial response from the Server
// @access Public
// if (process.env.NODE_ENV === "production") {
// }
app.use(express.static("client"));
app.get("*", (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, "client", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `The Server has been started on port : ${PORT} \nhttp://localhost:${PORT}`
  )
);
