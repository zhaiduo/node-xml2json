//blog.wordpress.2015-04-18.xml
//http://validator.w3.org/check
var fs = require('fs');
var parser = require('./index');

var file = __dirname + '/adam/blog.wordpress.2015-04-18.xml';
var xml = fs.readFileSync(file, {
    encoding: 'utf-8'
});

//var xml = "<foo attr=\"value\">bar</foo>";
//console.log("input -> %s", xml)

// xml to json
var json = parser.toJson(xml, {
    reversible: true
});
//console.log("to json -> %s", json);

//convert to structure required by json servere

var parseJsonStructure = function(jsonStr) {
    var structure = {};
    if (typeof jsonStr !== 'string') {
        console.log("[err] Invalid json string.", typeof jsonStr);
        return structure;
    }
    if (jsonStr.length > 2048 * 1024) {
        console.log("[err] Json object is over 2MB.", jsonStr.length);
        return structure;
    } else {
        console.log("[info] Json object is " + parseInt(jsonStr.length / 1024, 10) + " KB.");
    }

    var obj = JSON.parse(jsonStr);
    var recursiveName = function(obj, parentKey) {
        var debug = false;
        //console.log('recursiveName', parentKey);
        var i, j, k, l, m, n, o, p, q;
        var _findField = function(trg, parentKey) {
            if (obj.hasOwnProperty(i) && trg[parentKey]) {
                if (debug) console.log('trg key', parentKey, i);
                trg[parentKey][i] = {};
                if (typeof obj[i] === 'object') {
                    recursiveName(obj[i], i);
                } else {
                    if (debug) console.log('obj[i]', typeof obj[i], i);
                }
            } else {
                if (debug) console.log('obj.hasOwnProperty(i) not', i);
            }
        };
        if (parentKey !== undefined && typeof parentKey === 'string') {
            for (i in obj) {
                //level one
                _findField(structure, parentKey);

                //level two
                if (typeof structure === 'object') {
                    for (j in structure) {
                        _findField(structure[j], parentKey);
                    }
                    for (j in structure) {
                        if (typeof structure[j] === 'object') {
                            for (k in structure[j]) {
                                //console.log('structure', j, k, parentKey);
                                _findField(structure[j][k], parentKey);
                            }
                        }
                    }
                    for (j in structure) {
                        if (typeof structure[j] === 'object') {
                            for (k in structure[j]) {
                                for (l in structure[j][k]) {
                                    //console.log('structure', j, k, l, parentKey);
                                    _findField(structure[j][k][l], parentKey);
                                }
                            }
                        }
                    }
                }
            }
        } else {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    //console.log('structure i', i);
                    structure[i] = {};
                    if (typeof obj[i] === 'object') {
                        recursiveName(obj[i], i);
                    } else {
                        //console.log('obj[i]', typeof obj[i], i);
                    }
                }
            }
        }
    };
    recursiveName(obj);

    return structure;
};

var testData = JSON.parse(json);
//var testStructure = parseJsonStructure(json);
//console.log('parseJsonStructure', testData.rss.channel.item[0], testStructure);
var newJson = {};
newJson['post'] = [];
for (var i = 0, imax = testData.rss.channel.item.length; i < imax; i++) {
    var tmp = testData.rss.channel.item[i];
    tmp.id = imax - i;
    newJson['post'].push(tmp);
}
newJson = JSON.stringify(newJson);
//console.log('newJson', newJson.post[1]);

fs.writeFile(__dirname + "/adam/test_converted.json", newJson, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});

// json to xml
/*var xml = parser.toXml(json);
console.log("back to xml -> %s", xml)*/
