const express = require('express')

const cors = require('cors');
require('dotenv').config()
// add stripe key
const stripe  = require('stripe')("pk_test_51Hg0Q3H4cFgr1v6NAr4W9HAqIoNbhiTGhikyYOSaHhfp9TDBsjSr3jYto6V1sCSJC2QIOJ0QcDJiEGX4VFOLg8qj00I53Odisg");
const uuid = require('uuidv4');
//bodyparser
const  bodyParser = require('body-parser');
const { default: Stripe } = require('stripe');

const app = express()

//bodyparser

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//middlewaare

app.use(express.json);
app.use(cors());

//routes



app.post("/payment" , (req,res)=>{
    const {product, token} = req.body;
    console.log("PRODUCT",product);
    console.log("PRICE",product.price)
    const theunique_key = uuid();
    

    return stripe.customers.create({
        email:token.email,
        source:token.id
    }).then(customer=>{
        stripe.charges.create({
            amount:product.price*100,
            currency: 'usd',
            customer:customer.id,
            receipt_email:token.email,
            description: 'your purchase product name',
            shipping:{
                name:token.card.name,
                address:{
                    country:token.card.address_country
                }
            }
        }, {theunique_key})
    })
    .then(()=>res.status(200).json(result))
    .catch(err=>console.log(err))
})


//listiening
const port = 8282
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })



