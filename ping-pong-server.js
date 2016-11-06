//Author: Paul Peters
//Ping-Pong API
//Version: 1.0
//Dependencies: Express, BodyParser

var express        =         require("express")
var bodyParser     =         require("body-parser")
var app            =         express()

//**We will be using express route-specific so that only expected input is parsed**

// create application/json parser 
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/matches', urlencodedParser,function(req,res){
	if (!req.body) return res.sendStatus(400)

	console.log("running: get /matches")

	//read data file and display array of the past ping pong matches in ascending order of date played
	var fs = require('fs')
	fs.readFile('./ping-pong-data.json', 'utf8', function (err,data) {
		//handle error if issues with JSON doc
		if(err) {
			console.log('Reading JSON data Error: '+err)
		    return
		}

		try{
			//parse the JSON doc
		  	data = JSON.parse(data)
	  	} catch (e) {
		    console.error("Parsing JSON data error: "+e)
		    return false
		}
	  	//organize the data appropriatly
	  	sortAscending('datePlayed',data)
	})

	//if we ever want to sort by other properties might as well just make it a function
  	function sortAscending(compareVar, obj) {
	    var sortedData = obj.sort(function(a, b) {
	    	return (new Date(a[compareVar]) > new Date(b[compareVar])) ? 1 : ((new Date(a[compareVar]) < new Date(b[compareVar])) ? -1 : 0)
	    })
	    //print the sorted data
	    displayData(sortedData)
	}

	//spit out some nicely formated data
	function displayData(obj){
		res.writeHead(200, {'Content-Type': 'text/html'})
	    res.write(JSON.stringify(obj, null,'\t'))
	    res.end()
	}

})



app.post('/matches', jsonParser,function(req,res){
	if (!req.body) return res.sendStatus(400)

	console.log("running: post /matches")
	//Records the results of a new ping pong match.
	var matchData = req.body
	//console.log(JSON.stringify(matchData))

	//check if json is valid
	if(validateJsonMatch(matchData)){
		//after successful validation add the match data to JSON file
		addMatch(matchData)
		//return an empty response to release the client
		res.writeHead(200, {'Content-Type': 'application/json'})
		res.end()
	}
	//first lets check the validity of the post json
	function validateJsonMatch(obj){
		//lets rip through the properly formated JSON by key
		var key
		try{
			for (key in obj) {
				//ensure that each key has a property associated with it
			    if (obj.hasOwnProperty(key)) {
			        //console.log(key + " = " + obj[key]);
			        if(obj[key].length < 1 || obj[key] === " "){
			        	sendError("Invalid Input",key)
			    		return false
			        }else if(key === "datePlayed" && isNaN(Date.parse(obj[key]))){
			        	//if date is not able to be parsed then return invalid date
			        	sendError("Invalid Date",key)
			        	return false
			        }else if(key === "sets"){
			        	//check set logic
			        	for (var index = 0; index < obj[key].length; ++index) {
						    var mySet = obj[key][index]
						    //only concerned with winner comparision
						    if(mySet.winner.points < 21 || mySet.winner.points < mySet.loser.points+2){
						    	sendError("Invalid Winner in set "+index,mySet.winner)
						    	return false
						    }
						}
						//since index starts at 0 we will be accounting for this in our logic
						if(index < 1 || index > 2){
							//not a valid number of sets played
							sendError("Must be BEST OF THREE",key)
							return false
						}
			        }
			    }else{
			    	sendError("Missing Property",key)
			    	return false
			    }
			}
		} catch (e) {
		    console.error("validateJson error: "+e)
		    return false
		}
		//if all checks have passed then we can conlcude valid JSON input
		return true
	}

	function addMatch(obj){
		try {
			//after validation we can add this match to the data file
			var fs = require('fs')
		  	var configFile = fs.readFileSync('./ping-pong-data.json')
		  	var config = JSON.parse(configFile)
		  	config.push(obj)
		  	var configJSON = JSON.stringify(config)
		  	fs.writeFileSync('./ping-pong-data.json', configJSON)
	  	} catch (e) {
		    return console.error("addMatch error: "+e)
		}
	}

	//json error response
	function sendError(errorMessage,errorField){
	    var errorResponse = { message: errorMessage, fields: errorField };
		res.writeHead(400, {'Content-Type': 'application/json'})
		res.end(JSON.stringify(errorResponse))
	}
})

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('You broke it!')
})

//open port 3000 to listen on local machine - testing on local
app.listen(3000,function(){
  console.log("Opening Doors to Mordor PORT 3000")
})
