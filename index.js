const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000 ;

// middleware
app.use(express.json());
app.use(cors());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aheao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
const coffeeCollection = client.db("CoffeeDB").collection("Coffees");
const userCollection = client.db("CoffeeDB").collection("User");
 
app.post ('/coffees' , async(req,res)=>{
    const newCoffee = req.body;
    const result = await coffeeCollection.insertOne(newCoffee);
    res.send(result);

})




app.get('/coffees' , async(req ,res)=>{
  const cursor = coffeeCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})

app.get('/coffees/singleCoffee/:id' , async(req , res)=>{
  const id = req.params.id;
  
  const query = {_id : new ObjectId(id)}
  const result = await coffeeCollection.findOne(query);
  res.send(result);
 
})


app.get('/coffees/:email', async(req,res)=> { 
  const result =await coffeeCollection.find({email : req.params.email}).toArray();
  res.send(result);
})


app.delete('/coffees/:id' , async(req, res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)};
  const result = await coffeeCollection.deleteOne(query);
  res.send(result);
})

app.get('/coffees/updateCoffee/:id' , async(req , res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result = await coffeeCollection.findOne(query);
  res.send(result)
})

app.put('/coffees/updateCoffee/:id' , async(req , res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const options = {upsert : true}
  const updatedCoffee = req.body
  const coffee = {
    $set : {
name : updatedCoffee.name,
category : updatedCoffee.category,
supplier : updatedCoffee.supplier,
chef : updatedCoffee.chef,
taste : updatedCoffee.taste,
details : updatedCoffee.details,
photo : updatedCoffee.photo,
    }
  }
  const result = await coffeeCollection.updateOne(query ,coffee, options);
  res.send(result)
})

// User Related Apis


app.post("/users", async(req,res)=>{
  const user = req.body;
  console.log(user);
  const result = await userCollection.insertOne(user);
  res.send(result);
})

app.get('/users', async(req,res)=>{
  const cursor = userCollection.find();
  const users = await cursor.toArray();
  res.send(users);
})

app.patch('/users' , async(req, res) =>{
const user = req.body;
const filter = {email : user.email}
const updateDoc = {
  $set : {
    lastLoggedAt : user.lastLoggedAt
  }
}
const result = await userCollection.updateOne(filter, updateDoc);
res.send(result);
})

app.delete('/users/:id' , async(req, res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId (id)}
  const result = await userCollection.deleteOne(query);
  res.send(result);

})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req , res)=>{
    res.send("Espresso-Emporium Running Properly");
})

app.listen(port , ()=>{
    console.log(`Coffee Server on running in port ${port}`);
})