//blog.wordpress.2015-04-18.xml
//http://validator.w3.org/check
var fs = require('fs');
var parser = require('./index');

var file = __dirname + '/adam/blog.wordpress.2015-04-18.xml';
var xml = fs.readFileSync(file, { encoding: 'utf-8' });

//var xml = "<foo attr=\"value\">bar</foo>";
//console.log("input -> %s", xml)

// xml to json
var json = parser.toJson(xml, {reversible: true});
//console.log("to json -> %s", json);

fs.writeFile(__dirname+"/adam/test.json", json, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});

// json to xml
/*var xml = parser.toXml(json);
console.log("back to xml -> %s", xml)*/
