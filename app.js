require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.SECRET_KEY);
const logger = require('morgan');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



const stripePublicKey = process.env.STRIPE_PUBLISH_KEY;


const DOMAIN = 'http://localhost:3000';


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/checkout.html');
})


app.get('/cancel', function (req, res) {
  res.sendFile(__dirname + '/views/cancel.html');
})


app.get('/success', function (req, res) {
  res.sendFile(__dirname+'/views/success.html');
})

app.post("/payment", async (req, res) => {
  const { product } = req.body;
  // console.log(product);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.amount * 100,
        },
        quantity: product.quantity,
      },
    ],
    mode: "payment",
    success_url: `${DOMAIN}/success`,
    cancel_url: `${DOMAIN}/cancel`,
  });

  res.json({ id: session.id });
  // res.redirect(303,session.url);
});




// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
