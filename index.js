const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;


// middleware setup 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kjooh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri); check kaj korse ki na 

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    // console.log('connected to the database'); // you should check the database
    const database = client.db('carMechanic');
    const servicesCollection = database.collection('serivces');
    // Get API 
    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    //Get single Serivce 
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting service', id);
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.json(service);

    })


    // POST API created 
    app.post('/services', async (req, res) => {
      const service = req.body;

      console.log('hit the post api ', service);

      /*    const service = {
           "name": "ENGINE DIAGNOSTIC",
           "price": "300",
           "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
           "img": "https://i.ibb.co/dGDkr4v/1.jpg"
         } */

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
      // res.send('post hitted')

    });


    //Update API 
     app.put('/services/:id', async(req,res) =>{
      const id = req.params.id;
      const updatedService = req.body;
      const filter = {_id: ObjectId(id)};
      const options = {upsert: true};
      const updateDoc ={
        $set:{
          name: updatedService.name,
          description: updatedService.description,
       /*    price: updatedService.price,
          image: updatedService.img */
        }, 
      };
      const result = await servicesCollection.updateOne(filter, updateDoc,options)
      // console.log('updating', id);
      // console.log('updating', req);
      res.json(result);
      // res.send('updating');

    }) 








    // Delete API 
    app.delete('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    })
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Running the Genius Car Mechanics on Server ')
});
app.get('/hello', (req, res) => {
  res.send('Hello updated here  ')
});


app.listen(port, () => {
  console.log('Running Genius Server on port', port);

})

