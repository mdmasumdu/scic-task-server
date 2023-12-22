const express = require('express')
const app = express()
const cors =require("cors")
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT|5000;



// middleware 
app.use(cors())
app.use(express.json())








const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1hhdzxu.mongodb.net/?retryWrites=true&w=majority`;

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

const taskCollection =client.db("Scic").collection("tasks");


app.get("/tasks/:email",async(req,res)=>{
   const email=req.params.email;
   const query ={email:email};
   const result =await taskCollection.find(query).toArray();
   res.send(result);
})
app.post("/tasks",async(req,res)=>{
    const taskinfo =req.body;
    const result = await taskCollection.insertOne(taskinfo)
    res.send(result);
})

app.patch('/task',async (req,res)=>{
    const info =req.body;
    console.log(req.body);
    const filter ={_id:new ObjectId(info?.id)}
    const updateDoc = {
        $set: {
           status: info?.status
        },
      };
const result =await taskCollection.updateOne(filter,updateDoc);
res.send(result)

})
app.delete('/task/:id',async (req,res)=>{
   const id =req.params.id;
   const query ={_id: new ObjectId(id)}
   const result =await taskCollection.deleteOne(query);
   res.send(result)

})


app.get("/task/:id",async(req,res)=>{
    const id=req.params.id;
 
    const query ={_id: new ObjectId(id)};
    const result =await taskCollection.findOne(query)
    res.send(result);
 })


app.put("/task",async (req,res)=>{

    const info =req.body;
    console.log(info,'hitting');
    const filter ={_id:new ObjectId(info?.id)}
    const updateDoc = {
        $set: {
  email: info.email,
  title: info.title,
  deadline: info.deadline,
  description:info.description,
  priority: info.priority
      }
    }
const result =await taskCollection.updateOne(filter,updateDoc);
res.send(result)
    
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











app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})