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
      res.send({ products });
    });



    ///// api for deleting one item 
    app.delete("/deleteUser/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

//* api for getting  single proudct
    app.get('/product/:id', async (req, res) => {

      const id = req.params;
      console.log(id)

      const query = {_id: ObjectId(id)};
      const product =await productCollection.findOne(query);


      res.send({ product });
    });

     //* api for posting item
     app.post("/addItem", async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);
      console.log(result);
      res.send(result);
    })


    //* api for making admin
    app.put('/makeAdmin', async (req, res) => {
      const query = { _id: ObjectId(req.body._id) };

      const updateDocument = {
        $set: {
          role: "admin",
        }
      }
      const options = { upsert: true };
      const result = await userCollection.updateOne(query, updateDocument, options);
      console.log(result);
      res.send(result);
    });

    //* api for getting all users
    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);

      const users = await cursor.toArray();

      res.send({ users });
    });


    //* api for getting products
    app.get('/products', async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);

      const product = await cursor.toArray();

      res.send({ product });
    });
    

    //* api for get admin role
    app.get('/userRole', async (req, res) => {
      const email = req.query.email;
      const query = { email };
      const cursor = await userCollection.findOne(query);

      if (cursor.role === 'admin') {
        res.send({ role: "admin" })
      }
      else {
        res.send({ role: "user" });
      }
    });

    //*  api for adding one item
    app.post("/addUser", async (req, res) => {
      const doc = req.body;
      console.log(doc);
      const cursor = await userCollection.findOne(doc);
      console.log(cursor);
      if (!cursor) {
        const result = await userCollection.insertOne(doc);
        return res.send(result);
      }

      res.send({result:"not updated"})
      
    })

  } finally {
    // Ensures that the client will close when you finish/error
  }
}

run().catch(console.dir);


app.listen(port, () => {
  console.log("listening to port: ", port);
})
