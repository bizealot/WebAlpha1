var MongoClient = require('mongodb').MongoClient;
var mongo = new MongoClient();

mongo.connect("mongodb://localhost/", function(err, db) {
  var myDB = db.db("words");

  myDB.collection("word_stats", function(err, collection){
    largeSmallVowels(collection);
    top5AverageSize(collection);

    setTimeout( function(){ myDB.close(); }, 3000);
  });
});

function displayAggregate(results){
  for (var i in results){
    console.log(results[i]);
  }
}

// ^
function largeSmallVowels(collection){
  var match = {'$match' :
                {'first' :
                  {'$in' : ['a','e','i','o','u']}}};

  var group = {'$group' : 
                { '_id' : '$first', 
                  'largest' : {'$max' : '$size'},
                  'smallest' : {'$min' : '$size'},
                  'total' : {'$sum' : 1}}};

  var sort = {'$sort' : {'largest' : 1}};

  collection.aggregate([match, group, sort], 
    function(err, results){
      console.log("\nLargest and smallest word sizes for " + 
                  "words beginnig with a vowel");
      displayAggregate(results);
  });
}

// ^
function top5AverageSize(collection){
  var group = {'$group' : 
                {'_id' : '$first', 
                 'average' : {'$avg' : '$size'}}};

  var sort = {'$sort' : {'average' : -1}};
  
  var limit = {'$limit' : 5};
  
  collection.aggregate([group, sort, limit], 
    function(err, results){
      console.log("\nFirst letter of top 5 largest average " + 
                  "word size: ");
      displayAggregate(results);
  });
}