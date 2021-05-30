const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");


const app = express()

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html")
});


app.post("/signup",function(req,res){

    const name = req.body.name;
    const email = req.body.email;

    const data = {
        members:[
            {   email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:name
                }
            }
           ]
        }

        const jsonData = JSON.stringify(data);

        const url='https://us1.api.mailchimp.com/3.0/lists/2be3f97d56'

        const Option ={
            method:"POST",
            auth:"kkr:4d95c0b17707c537cf08b48726acd552-us1"
        }
        const request = https.request(url,Option,function(response){

            if(response.statusCode === 200){
            res.sendFile(__dirname + "/index.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

                    response.on("data",function(data){
                    console.log(JSON.parse(data));
                })
        })

        request.write(jsonData);
        request.end();
    });

app.post("/",function(req,res){

    const query = req.body.cityName;
    const apiKey = "a94b04ddce127b76fdbf54ef74d81e4a";
    const unit = "metric";
    const url ="https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    https.get(url,function(response){
        console.log(response.statusCode);
        response.on("data",function(data){
            console.log(JSON.parse(data));

            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            // const icon = weatherData.weather[0].icon;
            // const imageURL = "http://openweathermap.org/img/wn/"+ icon +"@2x.png"

            res.write("<h1>The temperature in "+ query + " is "+ temp + " degree celcius</h1>");
            res.write(" <h2>The weather in "+ query + " is "+ description + "</h2>");
            // res.write("<img src=" +imageURL+ "/>")
            res.send();
        })
    })

})




app.listen("5000",function(){
    console.log("server is running on port 5000");
})