const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require('dotenv').config();

//Config Apis
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Cors
app.use(cors({origin:true}))

//routers
app.use("/users", require("./routes/validateUserRoutes"));
app.use("/videos", require("./routes/videosRoutes"));

app.listen(9000, () => {
    console.log('server running on', 'http://localhots:' + 9000 );
});