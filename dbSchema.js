const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dbName = 'user';
const dbUrl = `mongodb+srv://SrajanDongre:Sr%40j2905@atlascluster.0ic6vmr.mongodb.net/${dbName}`
module.exports={dbUrl,mongodb,MongoClient,dbName}