const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");  // Import models

const app = express();
app.use(bodyParser.json()); // Use bodyParser to parse JSON bodies

// Routes
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/products", require("./routes/product.routes"));

// Sync database and start the server
db.sequelize.sync().then(() => {
    app.listen(5000, () => {
        console.log("Server is running on port 5000.");
    });
}).catch(err => {
    console.error("Failed to sync database: ", err.message);
});
