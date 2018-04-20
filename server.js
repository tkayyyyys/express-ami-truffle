var express = require("express");
var app     = express();
var path    = require("path");
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');


var fs = require("fs"),
    json;


json = getConfig('narrativeChainy.json');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static('src'));


app.get('/jsoncontent',function(req,res){
  res.send(json);
});

app.get('/invisionapp.html',function(req,res){
  //res.send("https://projects.invisionapp.com/freehand/document/7VY7sGgUi");
  res.redirect("https://projects.invisionapp.com/freehand/document/7VY7sGgUi");
});


function readJsonFileSync(filepath, encoding){

    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function getConfig(file){

    var filepath = __dirname + '/build/contracts/' + file;
    console.dir(filepath);
    console.log("filepath: " + filepath);
    return readJsonFileSync(filepath);
}


app.listen(port);

console.log("Running at Port " + port);