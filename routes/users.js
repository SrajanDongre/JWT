var express = require('express');
var router = express.Router();
const {dbUrl,mongodb,MongoClient,dbName} = require('../dbSchema');
const {hashedPassword,hashCompare,createToken,validate} = require('../auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/all',async (req,res)=>{
  const client = await MongoClient.connect(dbUrl)
  try{
    let token = req.headers.authorization.split(" ")[1]
    let validation = await validate(token)

    let user = await db.collection('user').findOne({
      email:validation.email,
      role:validation.role
    })
    if(user && validation.validity)
    {
    const db = await client.db(dbName)
    let users = await db.collection('user').find().toArray();
    res.json({
      statusCode:200,
      data:users
    })
    }else{
      res.json({
        statusCode:401,
        message:'Token Expired'
      })
    }

  }catch(error){
    console.log(error)
    res.json({
      statusCode:500,
      message:'Internal server error'
    })
  }finally{
    client.close()
  }
})


//signup
router.post('/add-user',async (req,res)=>{
  const client = await MongoClient.connect(dbUrl)
  try{
    const db = await client.db(dbName)
    let user = await db.collection('user').findOne({email:req.body.email})
    if(user)
    {
      res.json({
        statusCode:200,
        message:'User already exists'
      })
    }else{
      req.body.password = await hashPassword(req.body.password)
      user = await db.collection('user').insertOne(req.body)
      res.json({
        statusCode:200,
        message:'User created successfully'
      })
    }

  }catch(error){
    console.log(error)
    res.json({
      statusCode:500,
      message:'Internal server error'
    })
  }finally{
    client.close()
  }
})

//login
router.post('/login',async (req,res)=>{
  const client = await MongoClient.connect(dbUrl)
  try{
    const db = await client.db(dbName)
    const user = await db.collection('user').findOne({email:req.body.email})
    if(user)
    {
        if(await hashCompare(req.body.password,user.password))
        {
          let token = createToken({
            email:user.email,
            role: user.role
          })

          res.json({
            statusCode:200,
            message:'Login successfull',
            token
          })
        }else{
          res.json({
            statusCode:401,
            message:'Invalid Credentials'
          })
        }
    }else{
      req.json({
        statusCode:404,
        message:'User not found'
      })
    }

  }catch(error){
    console.log(error)
    res.json({
      statusCode:500,
      message:'Internal server error'
    })
  }finally{
    client.close()
  }
})


module.exports = router;