var mongo = require('mongodb');
var data = require("./data/exp8");

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

//mongodb://<user>:<password>@linus.mongohq.com:10013/todomap
//mongodb://<dbuser>:<dbpassword>@ds047037.mongolab.com:47037/todomap

// var server = new Server('ds047037.mongolab.com', 47037, { auto_reconnect: true });

var server = new Server('localhost', 27017, { auto_reconnect: true });
var db = new Db('todomap', server, {native_parser:false});


db.open(function(err, db) {
    console.log("Connecting to DB");
    if (err) {
        console.log("Connection failed: " + err);
    }
    console.log("Connecting to DB done");
    
    db.authenticate( "todoapp", "todoapp", function( err, result){ 
        console.log("Authentication to DB");
        if(err){
            console.log("Authentication failed: " + err);
        }
        console.log("Authentication to DB done");
        
        db.collection('maps', function(err, collection) {
            console.log("Inserting into DB");
            if(err){
                console.log("Insertion failed: " + err);
            }
            collection.insert(data.tree, {safe:true}, function(err, result) {
                if(err){
                    console.log("Insertion failed: " + err);
                }
                console.log("Insertion into DB done");
            });
        });
    });
    
    
});



 

 
