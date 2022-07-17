const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Product = require('./models/product');
const Farm = require('./models/farm')
const categories = ['fruit', 'vegetable', 'dairy'];


mongoose.connect('mongodb://localhost:27017/farmStandTake2', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

// FARM ROUTES

app.route('/farms')
    .get(async (req, res) => {
        const farms = await Farm.find({});
        res.render('farms/index', { farms })
    })
    .post(async (req, res) => { 
        const newFarm =  new Farm(req.body)
        await newFarm.save()
        res.redirect('/farms');
            })    
app.route('/farms/new')
    .get(async (req,res) => { 
        res.render('farms/new');
    })

app.route('/farms/:id')
    .get(async(req , res) => { 
        const { id } = req.params;
       
        const farm = await Farm.findById(id);
        res.render('farms/show', {farm})
    })
app.route('/farms/:id/products/new')
    .get(async (req, res) => { 
        const { id } = req.params;
        const farm = await Farm.findById(id);
        res.render('products/new', {categories , farm })
    })

app.post('/farms/:id/products',async (req, res) => { 
        const { id } = req.params;
        const farm = await Farm.findById(id);
        const product = new Product(req.body);
        product.farm = farm;
        await product.save();
        farm.products.push(product)
        console.log(farm);
        res.redirect('/farms');
    })



app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})



