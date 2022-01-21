const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const app = express();


mongoose.connect('mongodb+srv://node-corona:'+
    process.env.MONGO_ATLAS_PW
    +'@node-rest-corona.gmwhk.mongodb.net/node-corona?retryWrites=true&w=majority',
)
.then(()=>console.log('db connected'))
.catch( err => console.log(err))


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


countryRoutes = require("./api/routes/country")
superUserRoutes = require("./api/routes/super-user")
adminRoutes = require("./api/routes/admin")


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });


app.use('/countries',countryRoutes)
app.use('/superuser',superUserRoutes)
app.use('/admin',adminRoutes)

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });

module.exports = app;