const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()

//cross origin resource sharing
const cors = require('cors');

//middleware
app.use(cors());
app.use(express.json());

//declearing mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.itp5m.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

// working with api and data collection 
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("CompayBase").collection("products");
    const userCollection = client.db("CompayBase").collection("users");

  
    app.get('/', async (req, res) => {
      const products = "hello form server"
      res.send({products});
    });



    ////api for getting all product
    app.get('/product', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);

      const products = await cursor.toArray();

      res.send(products);
    });


    

    ///// api for deleting one item 
    app.delete("/deleteUser/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

        //* api for getting all users
        app.get('/users', async (req, res) => {
          const query = {};
          const cursor = userCollection.find(query);
    
          const users = await cursor.toArray();
    
          res.send({users});
        });


    //* api for get admin role
    app.get('/userRole', async(req, res) => {
      const email= req.query.email;
      const query = {email};
      const cursor =await userCollection.findOne(query);

      if(cursor.role ==='admin'){
        res.send({role:"admin"})
      }
      else{
        res.send({role:"user"});
      }
    });

    //*  api for adding one item
    app.post("/addUser", async (req, res) => {
      const doc = req.body;
      const result = await userCollection.insertOne(doc);
      console.log(doc);
      res.send(result);
    })

  } finally {
    // Ensures that the client will close when you finish/error
  }
}

run().catch(console.dir);


app.listen(port, () => {
    console.log("listening to port: ", port);
})
