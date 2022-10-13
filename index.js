const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const redis = require('connect-redis');
const routes = require("./routes");
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
// Redis configuration.

const redisClient = require('redis').createClient({
    legacyMode:true
});
redisClient.connect().catch(console.log);
const RedisStore = redis(session);

// Session configuration.
app.use(
    session({
        store:new RedisStore({client:redisClient}),
        secret: "keyboard cat", 
        resave: true, 
        saveUninitialized: true, 
        cookie:{
            secure:false, // Only set to true if you are using HTTPS.
            httpOnly:false, // Only set to true if you are using HTTPS.
            maxAge:60000 // Session max age in milliseconds.
        } 
    })
);

// app.get("/",(req,res) => {
//     return res.json({
//         "message":"Hello World!",
//         "success":true
//     })
// })

app.use(routes);

app.listen(PORT, async () => {
    mongoose.connect("mongodb://localhost/session_app", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(
        () => console.log(`App listening on port ${PORT}`)
    ).catch(console.error);    
});