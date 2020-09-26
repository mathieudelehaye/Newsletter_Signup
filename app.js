//jshint esversion: 6

const express = require('express')
const bodyParser = require("body-parser")
const request = require('request')
const https = require('https')

const app = express()

app.use(express.static("public"))

app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.post('/', function(req, res) {

  var firstName = req.body.first_name
  var lastName = req.body.last_name
  var email = req.body.email

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  }

  const jsdonData = JSON.stringify(data)

  const url = 'https://us2.api.mailchimp.com/3.0/lists/c8b388974e/' // server 'us2' from API Key

  const options = {
    method: "POST",
    auth: "mdelehaye:264d692b7f3efe277c1eebdec7f724e4-us2" // any basic auth user allowed
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else {
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", function(data) {
      // console.log(JSON.parse(data))
    })
  })

  // request.write(jsdonData)

  request.end()

})

app.post('/failure', function(req, res) {
  res.redirect("/")
})

app.listen(process.env.PORT || 3000, function() { // dynamic port used by heroku or local port 3000 
  console.log("Server started on port 3000")
})
