const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

// username: dbuser1
//pass: 1234


const uri = "mongodb+srv://dbuser1:1234@cluster0.zlmws.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  
}
// client.connect(err => {
//   const collection = client.db("RagibInventory").collection("perfumes");
//   // console.log("Database Connected");
//   // perform actions on the collection object
//   client.close();
// });



app.get('/', (req, res) => {
    res.send('Ragib Perfume Arena Inventory Server');
});

app.listen(port, ()=>{
    console.log('Listening to port...', port);
})
