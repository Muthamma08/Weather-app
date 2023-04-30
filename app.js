const express = require('express'); //server is created
const bodyParser = require('body-parser'); //to parse html
const https = require('https'); //http request and response
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

//a get rerives index.html page and display it to user
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//post get triggerred when a user submits form
app.post('/', function (req, res) {
  const query = req.body.city;
  const apiId = 'c8c2717a81569da3824e58356d91df36';
  //a get request is sent to openapiweather map with query and apiId as it parameter
  https.get(
    'https://api.openweathermap.org/data/2.5/forecast?appid=' +
      apiId +
      '&q=' +
      query,
    function (response) {
      let data = '';
      response.on('data', function (chunk) {
        data += chunk;
      });
      //data in the form of json is stored it data variable and and is parsed and values like temperature,humidity,description and image is retrived
      response.on('end', function () {
        try {
          const weatherdata = JSON.parse(data);
          const temp = weatherdata.list[0].main.temp;
          const hum = weatherdata.list[0].main.humidity;
          const des = weatherdata.list[0].weather[0].description;
          const icons = weatherdata.list[1].weather[0].icon;
          const imageUrl =
            'https://openweathermap.org/img/wn/' + icons + '@2x.png';

          const weatherReport =
            '<h2>Temperature is ' +
            temp +
            '</h2>' +
            '<h2>Humidity is ' +
            hum +
            '</h2>' +
            '<em><h3>It is ' +
            des +
            ' day!!</h3></em>' +
            '<img src="' +
            imageUrl +
            '"/>';
          //and displayed to the user
          res.write(
            "<br><br><br><div class='result' style='text-align: center'>" +
              weatherReport +
              '</div>'
          );
          res.write(
            '<div style="display: flex;justify-content: center;"><a href="/" style="text-decoration:none;color:red;font-size:12px">Back to search</a></div>'
          );
          res.send();
        } catch (error) {
          console.error(error);
        }
      });
    }
  );
});

app.listen(3008, function () {
  console.log('the server is running in the localhost 3008');
});
