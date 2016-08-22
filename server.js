var express = require('express');
var app = express();
var exphbs  = require('express-handlebars');
var fs = require('fs');
var moment = require('moment');
var long = require('long')

var pokemonArray = JSON.parse(fs.readFileSync('./pokemon.json', 'utf8'))

var hbs = exphbs.create({
    defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
    res.render('index', {
        fortInfo: JSON.parse(fs.readFileSync('./malvern_gym_status.json', 'utf8')),
        updatedTime: JSON.parse(fs.readFileSync('./update.json')),
        helpers: {
            calcIV: function (iv1, iv2, iv3) { 
                return (((iv1+iv2+iv3)/45)*100).toFixed(0); 
            },
            getPokemonInfo: function (id, attr) { 
                return pokemonArray.pokemon[id - 1][attr]; 
            },
            getHighestTrainer: function (array) {
                return array[array.length-1].trainer_public_profile.name + ' (' + array[array.length-1].trainer_public_profile.level + ')'
            },
            epochTimeConverter: function(ms){
                console.log(parseInt(ms.toString, 10))
                var longVal = new long(ms.low, ms.high, ms.unsigned);
                var longStr = longVal.toNumber();
                var expDate = new Date(longStr).getTime();
                var currentDate = new Date().getTime();
                var minUntilExp = ((expDate - currentDate)/(1000*60)).toFixed(2);
                return minUntilExp
            }
        }
    });
})

app.get('/map', function(req, res){
    res.render('map', {
        
    });
})

app.get('/data', function(req, res){
    res.setHeader('Content-Type', 'application/json')
    res.send(fs.readFileSync('./malvern_gym_status.json', 'utf8'))
})

app.use('/img', express.static('img'));

var port = Number(process.env.PORT || 80 )
app.listen(port);
