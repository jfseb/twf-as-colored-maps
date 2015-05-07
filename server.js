var emptygif = require('emptygif');
var express = require('express');
var app = express();
//app.set('port', (process.env.PORT || 5000));
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var tr = 2;
// this sample file. created from ideas in
// https://www.airpair.com/javascript/node-js-tutorial
// installs a small express we driver on
// port 1337
// load http://localhost:1337/index2.html
// then load http://localhost:1337/txp.gif 
// or change a file in public
// 
var fs = require('fs');

var colorgrad = require('./client');

console.log(colorgrad.makeColor(0.1));

fs.watch(__dirname + '/public', function(event, filename) {
console.log('event is: ' + event);
    if (filename) {
        console.log('filename provided: ' + filename);
 io.emit('visit', {
    ip: filename,
    ua: event
  });

    } else {
        console.log('filename not provided');
    }
});


function getCountries(err,cb) {
var  fs  = require("fs");
     readline = require("line-by-line");
 var aCountries =[];
 var LineByLineReader = require('line-by-line'),
     lr = new LineByLineReader('./the-world-factbook/rankorder/rawdata_2001.txt');

lr.on('error', function (err) {
    // 'err' contains error object
});

lr.on('line', function (line) {
	if ( aCountries.length > -1) {
		var countryMatch = /\d+((\s*\t\s*)|(\s\s+))([A-Za-z0-9,-]+([ ][A-Za-z0-9,-]+)*)/.exec(line);
		if (countryMatch) {
			if ( countryMatch[4].indexOf("Gu") === 0) {
				if( tr > 10)  console.log(countryMatch);
			}
			line = countryMatch[4];
			
		}
		//console.log(line);
	}
    if ( line.length > 0) // && aCountries.indexOf(line) === -1)
		aCountries.push(line);  // 'line' contains the current line without the trailing newline character.
});

lr.on('end', function () {
	cb(aCountries);
    ////// All lines are read, file is closed now.
});
}

getCountries(undefined, function(aCountries) { 
//console.log(JSON.stringify(aCountries));
});

app.get('/countries', function(req,res,next) {
	var countries = getCountries(undefined,function(countries) {
	   res.send(JSON.stringify(countries));
	});
});



function readJSON(sFileName, cb) {
	fs.readFile(sFileName,'utf-8', function(err,data) {
		if (err) {
			console.log(err.toString());
			return;
		} 
		var ds = JSON.parse(data);
		cb(undefined,ds);
	});
}

var oFields = [];
var oFieldLabels;

console.log("readit");
readJSON('the-world-factbook/fields/allFields.json', function(err, oData) {
	console.log("reading allFields" + JSON.stringify(oData));
	oFieldLabels = oData;
	for (var name in oData) {
	  if (oData.hasOwnProperty(name)) {
		console.log(name);
		var match = /(\d+)/.exec(name);
		if (match) {
			console.log("match " + match[1] + JSON.stringify(oData[name]));
			oData[name].nr = match[1];
			oFields.push(oData[name]);
		}
	  }
	}
});

app.get('/fields', function(req,res,next) {
	console.log("get fields" + JSON.stringify(oFields));
	   res.send(JSON.stringify(oFields));
});


app.get('/fieldLabels', function(req,res,next) {
	console.log("get fields" + JSON.stringify(oFields));
	   res.send(JSON.stringify(oFieldLabels));
});


/////////////////

function loadFileData(fn, cb) {
var  fs  = require("fs");
     readline = require("line-by-line");
 var aCountries =[];
 var LineByLineReader = require('line-by-line'),
     lr = new LineByLineReader('./the-world-factbook/rankorder/' +  fn ); //"rawdata_2001.txt');

lr.on('error', function (err) {
    // 'err' contains error object
});

lr.on('line', function (line) {
	if ( aCountries.length > -1) {
		console.log("line" + line);
	var countryMatch = /\d+((\s*\t\s*)|(\s\s+))([A-Za-z'0-9,-]+([ ][A-Za-z'0-9,-]+)*)\s\s+(([-]?\$[-]?(\d+[,.]?)+\d*)|([-]?\d+([.,]\d*)*))/.exec(line);
		if (countryMatch) {
			console.log("match");
			if ( countryMatch[4].indexOf("Gu") === 0) {
				console.log(" a match " + countryMatch);
			}
			line = countryMatch[4];
			var valStr = countryMatch[6];
			var rectValStr = valStr.replace(/,/g,"");
			rectValStr = rectValStr.replace(/\$/g,"");
			console.log(countryMatch[4] + ":" + countryMatch[6] + " > " + rectValStr);
			aCountries.push({ country : countryMatch[4], value : Number.parseFloat(rectValStr), valueStr : valStr});
		}
	}
});

lr.on('end', function () {
	cb(aCountries);
    ////// All lines are read, file is closed now.
});
}

app.get('/json*', function(req,res,next) {
	res.send(JSON.stringify({ res: [{country: "Russia", value : "10000"}, { country : "Germany", value : "1234"}]}));
});


	var aColors = [];
	for(var x= 0.0; x <= 1.0; x = x + 0.02) {
		aColors.push(colorgrad.makeColor(x));
	}

	var svg = require("./colorsvg.js");
// serve data as colored svg map
app.get('/svg_*', function(req,res,next) {
	console.log(req.url);
	var match = /svg_([0-9]+)/.exec(req.url);
	var nr = (match && match[1]) || "2018";
	console.log("nr"  + nr);
	loadFileData("rawdata_" + nr + ".txt", function(data) {
	  res.setHeader("content-type", "image/svg+xml");
	  var mp = {};
	  var max = -1.0E20;
	  var min =  1.0E20;
	  data.forEach(function(row) {
		 if( row.value >= max) {
			 max = row.value;
		 }
		 if ( row.value <= min) {
			 min = row.value;
		 }
	  });
	  console.log("svg maximum is " + max);
	  console.log("svg minimum is " + min);
	  var delta = max - min; 
	  if (delta === 0) {
		  delta = 1;
	  }
	  data.forEach(function(row) {
		  mp[row.country] = (row.value  - min)/ delta;
		  console.log(row.country + ":>" + mp[row.country]);
	  });
	  svg.makeSVGMapStream( mp, res); // { "Germany" : 0.1, Russia : 0.2, "Sweden" : 0.1 },res);		
	});
	//res.send(JSON.stringify({ res: [{country: "Russia", value : "10000"}, { country : "Germany", value : "1234"}]}));
});


var aliases = svg.getCountryAliases();

/**
* Serve raw data as read from file
* 
*/
app.get('/datar_*', function(req,res,next) {
	console.log(req.url);
	var match = /datar_([0-9]+)/.exec(req.url);
	var nr = (match && match[1]) || "2018";
	console.log("nr"  + nr);
	loadFileData("rawdata_" + nr + ".txt", function(data) {
		data.forEach(function(datar) {
			datar.svgCountry = aliases[datar.country] || datar.country;
		});
	    res.send(JSON.stringify(data));
	});
});


function roundToNSignificant(fValue, iNr) {
	// shift l
	var fValuex;
	var fValuexNice;
	if ( fValue === 0.0) {
		return fValue;
	}
	var shift = Math.floor(Math.log(Math.abs(fValue)) / Math.LN10);
	fValuex = fValue / Math.pow(10,shift);
	console.log(fValue + " shift " + shift + " value 0-1 ? " + fValuex);
	if ((Math.abs(fValuex) < 1) || (Math.abs(fValuex) > 10)) {
		console.log("Error: unexpected value rank " + fValuex);
	}
	fValuex = fValuex * Math.pow(10, iNr);
	var fValuexNice = Math.round(fValuex);
	fValuexNice = fValuexNice *Math.pow(10,shift - iNr);
	
	console.log(" Value " + fValue + " rectified" + fValuexNice  + " shift: " + (iNr -shift));
	var fValueNice = ((iNr -shift ) >= 0) && ((iNr - shift ) <= 20) ? fValuexNice.toFixed(iNr - shift) : fValuexNice;
	console.log( " niceformat"  + fValueNice ); 
	return  fValueNice; 
}

/** 
* Serve a datascale 
*/
app.get('/datascale_*', function(req,res,next) {
	console.log(req.url);
	var match = /datascale_([0-9]+)/.exec(req.url);
	var nr = (match && match[1]) || "2018";
	console.log("nr:"  + nr);
	loadFileData("rawdata_" + nr + ".txt", function(data) {
	 // res.setHeader("content-type", "application/json");
	  var mp = {};
	  var max = -1.0E10;
	  var min =  1.0E20;
	  console.log("length : " + data.length);
	  data.forEach(function(row) {
		 console.log("typof " + typeof row.value);
		 if( Number.parseFloat(row.value) >= max) {
			 max = Number.parseFloat(row.value);
		 }
		 if ( Number.parseFloat(row.value) <= min) {
			 min = Number.parseFloat(row.value);
		 }
	  });
	  console.log("data maximum is " + max);
	  console.log("data minimum is " + min);
	  var delta = max - min; 
	  if (delta === 0) {
		  delta = 1;
	  }
	  data.forEach(function(row) {
		  mp[row.country] = (row.value  - min)/ delta;
		  console.log(row.country + ":>" + mp[row.country]);
	  });
	var aColorData = [];
	for(var x= 0.0; x <= 1.0; x = x + 0.04) {
		var value = x * delta + min;
		value = roundToNSignificant(value,4);
		aColorData.push({ color : colorgrad.makeColor(x),
		   value : value
		});
	}
	  res.send(JSON.stringify(aColorData));
	});
	//res.send(JSON.stringify({ res: [{country: "Russia", value : "10000"}, { country : "Germany", value : "1234"}]}));
});


	var aColors = [];
	for(var x= 0.0; x <= 1.0; x = x + 0.02) {
		aColors.push(colorgrad.makeColor(x));
	}
	
	

app.get('/colors', function(req,res,next) {
	res.send(JSON.stringify(aColors));
});

app.get('/tpx.gif', function(req, res, next) {
  io.emit('visit', {
    ip: req.ip,
    ua: req.headers['user-agent']
  });

  emptygif.sendEmptyGif(req, res, {
    'Content-Type': 'image/gif',
    'Content-Length': emptygif.emptyGifBufferLength,
    'Cache-Control': 'public, max-age=0' // or specify expiry to make sure it will call everytime
  });
});

app.use(express.static(__dirname + '/public'));

server.listen(process.env.PORT || 5000);
12345678910111213141516171819202122
