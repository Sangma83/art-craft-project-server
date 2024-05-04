const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4xueldm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)


   const craftCollection = client.db('craftDB').collection('craft');
   const categoriesCollection = client.db('craftDB').collection('categories');
   

  app.get('/crafts', async(req, res) =>{
    const cursor = craftCollection.find();
    const result = await cursor.toArray(cursor);
    res.send(result);
  })
 
  app.get('/crafts/:email', async(req, res) =>{
    console.log(req.params.email);
    const result = await craftCollection.find({email: req.params.email}).toArray();
    res.send(result);
  })
 

  app.get('/craft/:id', async(req, res) =>{
    console.log(req.params.id);
    const id = req.params.id;
    console.log(id);
    // const query = {_id: new ObjectId(id)};
    const result = await craftCollection.findOne({_id: new ObjectId(req.params.id)});
    
    res.send(result);
  })

  app.put('/craftUpdate/:id', async(req, res) => {
    console.log(req.params.id);
    const query = {_id: new ObjectId(req.params.id)};
    const data = {
      $set: {
        photo: req.body.photo,
        name: req.body.name,
        subcategory: req.body.subcategory,
        details: req.body.details,
        price: req.body.price,
        rating: req.body.rating,
        custom: req.body.custom,
        stock: req.body.stock,
        username: req.body.username,
        time: req.body.time
      }
    }
    const result = await craftCollection.updateOne(query, data);
    console.log(result);
    res.send(result);
  })
  
  app.post('/crafts', async(req, res) =>{
  const newCraft = req.body;
  console.log(newCraft);
  const result = await craftCollection.insertOne(newCraft);
  res.send(result)
  })



  app.delete('/crafts/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await craftCollection.deleteOne(query);
    res.send(result);
  })

  //categries related apis

  app.get('/categories', async(req, res) =>{
    const cursor = categoriesCollection.find();
    const categories = await cursor.toArray();
    res.send(categories);
});

// app.post('/categories', async(req, res) =>{
//     const newCategory = req.body;
//     const result = await categoriesCollection.insertOne(newCategory);
//     res.send(result);
// });


 
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Art & Craft server is running')
})

app.listen(port, () =>{
    console.log(`Art & Craft server is running on : ${port}`)
})























// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

