const express =require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const fileUpload=require('express-fileupload');
const fs=require('fs-extra');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lnzgn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app=express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('agency'));
app.use(express.static('review'));
app.use(fileUpload());

const port=5000;


const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
client.connect(err => {
  const serviceCollection = client.db("creatingAgency").collection("service");
  const allServiceCollection = client.db("creatingAgency").collection("allService");
  const reviewCollection=client.db("creatingAgency").collection("allReview");

  app.post('/addService',(req,res)=>{
      const service=req.body;
      console.log(service);
      serviceCollection.insertOne(service)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
  })

  app.get('/servicePlaced',(req,res)=>{
    serviceCollection.find({})
    .toArray((err,serviceDocuments)=>{
      res.send(serviceDocuments);
    })
  })

  app.post('/newService',(req,res)=>{
    const file=req.files.file;
    const name=req.body.name;
    const description=req.body.description;
      var newImg=file.data;
      var encImg=newImg.toString('base64');
        var image={
          contentType:file.mimetype,
          size:file.size,
         img:Buffer.from(encImg,'base64')
        }

      allServiceCollection.insertOne({name,description,image})
      .then(result=>{
          res.send(result.insertedCount>0)
        })
      })

  app.get('/newService',(req,res)=>{
    allServiceCollection.find({})
    .toArray((err,newServiceDocuments)=>{
      res.send(newServiceDocuments);
    })
  })


  app.post('/reviewer',(req,res)=>{
    const file=req.files.file;
    const name=req.body.name;
    const company=req.body.company;
    const description=req.body.description;
      var newImg=file.data;
      var encImg=newImg.toString('base64');
        var image={
          contentType:file.mimetype,
          size:file.size,
         img:Buffer.from(encImg,'base64')
        }
        reviewCollection.insertOne({name,company,description,image})
      .then(result=>{
          res.send(result.insertedCount>0)
        })
       })
 


  app.get('/reviewer',(req,res)=>{
    reviewCollection.find({})
    .toArray((err,reviewDocuments)=>{
      res.send(reviewDocuments);
    })
})
})



app.listen(process.env.PORT || port);