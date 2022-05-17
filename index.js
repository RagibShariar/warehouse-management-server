const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { config } = require('dotenv');
const app = express();
// const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

// Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zlmws.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try {
    await client.connect();
    // console.log('db connected');

    const productCollection = client.db("perfume_inventory").collection("products");
    const orderCollection = client.db("perfume_inventory").collection("orders");

    //all products
    app.get("/products", async (req, res) => {
        const query = {};
        const products = await productCollection.find(query).toArray();
        console.log('inside products ->', products);
        res.send(products);
    });

    // single product
    app.get("/products/:id", async (req, res) => {
        const id = req.params.id;
        const product = await productCollection.findOne({ _id: ObjectId(id) });
        res.send(product);
    })

    //updating a product
    app.put('/update-product/:id', async (req, res) => {
        const id = req.params.id;
        const updatedBikeInfo = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                quantity: updatedBikeInfo.quantity,
                sold: updatedBikeInfo.sold
            }
        }
        const result = await productCollection.updateOne(filter, updatedDoc, options);
        res.send(result);
    })

    //deleting a product
    app.delete('/product/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await productCollection.deleteOne(query);
        res.send(result);
    })

    //adding a product
    app.post("/add-product", async (req, res) => {
        const bikeInfo = req.body;
        const result = await productCollection.insertOne(bikeInfo);
        res.send(result);
    })

    // jwt token while logging in
    // app.post("/login", (req, res) => {
    //     const user = req.body;
    //     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    //     res.send({ token })
    // })

    //add to order
    app.post("/add-order", async (req, res) => {
        const orderInfo = req.body;//=> ...bike, email
        const result = await orderCollection.insertOne(orderInfo);
        res.send({ success: 'order complete' })
    })

    //order list
    // app.get("/order-list", verifyToken, async (req, res) => {
    //     const decodedEmail = req.decoded.email;
    //     const email = req.query.email;
    //     if (decodedEmail === email) {
    //         const orders = await orderCollection.find({ email }).toArray();
    //         res.send(orders);
    //     } else {
    //         res.status(403).send({ message: 'You are forbidden, if you try again I\'m gonna call the cops' })
    //     }
    // })

    // delete from order
    // app.delete('/order-list/:id', async (req, res) => {
    //     const id = req.params.id;
    //     const query = { _id: ObjectId(id) };
    //     const result = await orderCollection.deleteOne(query);
    //     res.send(result);
    // })

} finally {
    //   await client.close();
}
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Ragib Perfume Inventory Server...');
});

app.listen(port, ()=>{
    console.log('Listening to port...', port);
})
