# ping-pong-anow
Let the 'matches' begin

##Ping-Pong API

*Author:* Paul Peters

*Version:* 1.0

*Dependencies:* Express, BodyParser

**The following project is a simple API built in Node.js that handles a get and post request.**

This API was based off the following Swagger API Documentation: http://petstore.swagger.io/?url=http://docs.anow.com/api-sample/ping-pong.yml

##Run Server
######Use Strict Mode
node -use_strict ping-pong-server.js


##Test API

**You can test this API with the following curl commands (Tested on my local windows machine using port 3000):**

######get /matches
curl -X GET -H "Accept: text/html" http://localhost:3000/matches

######post /matches
curl -X POST -H "Content-Type: application/json" -H "Accept: application/json" -d "{ \"id\": \"5\", \"datePlayed\": \"2016-10-30T16:23:56.027Z\", \"winner\": \"mr.x\", \"loser\": \"mr.sir\", \"sets\": [ { \"winner\": { \"name\": \"mr.x\", \"points\": 22 }, \"loser\": { \"name\": \"mr.sir\", \"points\": 20 } },{ \"winner\": { \"name\": \"mr.x\", \"points\": 42 }, \"loser\": { \"name\": \"mr.sir\", \"points\": 40 } } ] }" http://localhost:3000/matches

*All temp data is stored in the JSON document labeled "ping-pong-data.json"*
