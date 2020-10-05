var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("aggregator");
  var myobj = { name: "xyz", Village: "xyz", Age: "xyz" , Gender: "xyz",  Phone: "xyz" ,   Picture: "xyz" };
  dbo.collection("users").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("record added");
    db.close();
  });
});