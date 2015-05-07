

var fs= require("fs");

var xml2js = require("xml2js");
var stream = require('stream');
var util = require('util');
var parser =  new xml2js.Parser();

function iterateCountries(oXml, fct) {
	
oXml.svg.g.forEach(function(g1) {
  if(g1.g) {
      var g = g1.g;
	  g1.g.forEach(function(g) {
		//console.log(g.$.id);
		fct(g && g.$ && g.$.id,g);
	  });
	  g1.path && g1.path.forEach(function(path) {
		//console.log(g.$.id);
		if ( path.$ && path.$.id && !/^path/.exec(path.$.id)) {
		    fct(path && path.$ && path.$.id, path);
		}
	  });
  }}); 
};

// lhs: alias, rhs: Map name!
var aliases = {
'Andorra':	'Andorra',
'Angola':	'Angola',
'Antarctica':	'Antarctica',
'Argentina':	'Argentina',
'Armenia':	'Armenia',
'Australia':	'Australia',
'Austria':	'Austria',
'Azerbaijan':	'Azerbaijan',
'Bahamas, The':	'Bahamas',
'Bahrain':	'Bahrain',
'Bangladesh':	'Bangladesh',
'Barbados':	'Barbados',
'Belarus':	'Belarus',
'Belgium':	'Belgium',
'Belize':	'Belize',
'Benin':	'Benin',
'Bhutan':	'Bhutan',
'Bolivia':	'Bolivia',
'Bosnia and Herzegovina':	'Bosnia_and_Herzegovina',
'Botswana':	'Botswana',
'Brazil':	'Brazil',
'Brunei':	'Brunei',
'Bulgaria':	'Bulgaria',
'Burkina Faso':	'Burkina_Faso',
'Burundi':	'Burundi',
'Cabo Verde':	'Cabo_Verde',
'Cambodia':	'Cambodia',
'Cameroon':	'Cameroon',
'Canada':	'Canada',
'Central African Republic':	'CAR',
'Chad':	'Chad',
'Chile':	'Chile',
'China':	'China',
'Colombia':	'Colombia',
'Comoros':	'Comoros',
'Costa Rica':	'Costa_Rica',
'Cote d\'Ivoire':	'Cote_dIvoire',
'Croatia':	'Croatia',
'Cuba':	'Cuba',
'Cyprus':	'Cyprus',
'Czech Republic':	'Czech_Republic',
'Denmark':	'Denmark',
'Djibouti':	'Djibouti',
'Dominica':	'Dominica',
'Dominican Republic':	'Dominican_Republic',
'Congo, Democratic Republic of the':	'DR_Congo',
'Timor-Leste':	'East_Timor',
'Ecuador':	'Ecuador',
'Egypt':	'Egypt',
'El Salvador':	'El_Salvador',
'Equatorial_Guinea':	'Equatorial_Guinea',
'Eritrea':	'Eritrea',
'Estonia':	'Estonia',
'Ethiopia':	'Ethiopia',
'Fiji':	'Fiji',
'Finland':	'Finland',
'France':	'France',
'Gabon':	'Gabon',
'Gambia, The':	'Gambia',
'Georgia':	'Georgia',
'Germany':	'Germany',
'Ghana':	'Ghana',
'Greece':	'Greece',
'Greenland':	'Greenland',
'Grenada':	'Grenada',
'Guatemala':	'Guatemala',
'Guinea':	'Guinea',
'Guinea-Bissau':	'Guinea_Bissau',
'Guyana':	'Guyana',
'Haiti':	'Haiti',
'Honduras':	'Honduras',
'Hungary':	'Hungary',
'Iceland':	'Iceland',
'India':	'India',
'Indonesia':	'Indonesia',
'Iran':	'Iran',
'Iraq':	'Iraq',
'Ireland':	'Ireland',
'Israel':	'Israel',
'Italy':	'Italy',
'Jamaica':	'Jamaica',
'Japan':	'Japan',
'Jordan':	'Jordan',
'Kashmir_No_mans_land':	'Kashmir_No_mans_land',
'Kazakhstan':	'Kazakhstan',
'Kenya':	'Kenya',
'Kiribati':	'Kiribati',
'Kosovo':	'Kosovo',
'Kuwait':	'Kuwait',
'Kyrgyzstan':	'Kyrgyzstan',
'Laos':	'Laos',
'Latvia':	'Latvia',
'Lebanon':	'Lebanon',
'Lesotho':	'Lesotho',
'Liberia':	'Liberia',
'Libya':	'Libya',
'Liechtenstein':	'Liechtenstein',
'Lithuania':	'Lithuania',
'Luxembourg':	'Luxembourg',
'Macedonia':	'Macedonia',
'Madagascar':	'Madagascar',
'Malawi':	'Malawi',
'Malaysia':	'Malaysia',
'Maldives':	'Maldives',
'Mali':	'Mali',
'Malta':	'Malta',
'Mauritania':	'Mauritania',
'Mauritius':	'Mauritius',
'Mexico':	'Mexico',
'Micronesia':	'Micronesia',
'Moldova':	'Moldova',
'Mongolia':	'Mongolia',
'Montenegro':	'Montenegro',
'Morocco':	'Morocco',
'Mozambique':	'Mozambique',
'Burma':	'Myanmar',
'Nagorno-Karabakh':	'Nagorno-Karabakh',
'Namibia':	'Namibia',
'Nepal':	'Nepal',
'Netherlands':	'Netherlands',
'New Zealand':	'New_Zealand',
'Nicaragua':	'Nicaragua',
'Niger':	'Niger',
'Nigeria':	'Nigeria',
'Korea, North':	'North_Korea',
'Northern_Cyprus':	'Northern_Cyprus',
'Norway':	'Norway',
'Oman':	'Oman',
'Pakistan':	'Pakistan',
'Palestine':	'Palestine',
'Panama':	'Panama',
'Papua New Guinea':	'Papua_New_Guinea',
'Paraguay':	'Paraguay',
'Peru':	'Peru',
'Philippines':	'Philippines',
'Poland':	'Poland',
'Portugal':	'Portugal',
'Quatar':	'Qatar',
'Congo, Republic of the':	'R_Congo',
'Romania':	'Romania',
'Russia':	'Russia',
'Rwanda':	'Rwanda',
'Samoa':	'Samoa',
'San Marino':	'San_Marino',
'Sao Tome and Principe':	'Sao_Tome_and_Principe',
'Saudi Arabia':	'Saudi_Arabia',
'Senegal':	'Senegal',
'Serbia':	'Serbia',
'Seychelles':	'Seychelles',
'Sierra Leone':	'Sierra_Leone',
'Singapore':	'Singapore',
'Slovakia':	'Slovakia',
'Slovenia':	'Slovenia',
'Solomon Islands':	'Solomon_Islands',
'Somalia':	'Somalia',
'Somaliland':	'Somaliland',
'South Africa':	'South_Africa',
'Korea, South':	'South_Korea',
'South_Ossetia':	'South_Ossetia',
'South Sudan':	'South_Sudan',
'Spain':	'Spain',
'Sri Lanka':	'Sri_Lanka',
'St_Kitts_and_Nevis':	'St_Kitts_and_Nevis',
'St_Lucia':	'St_Lucia',
'St_Vincent_and_the_Grenadines':	'St_Vincent_and_the_Grenadines',
'Sudan':	'Sudan',
'Suriname':	'Suriname',
'Swaziland':	'Swaziland',
'Sweden':	'Sweden',
'Switzerland':	'Switzerland',
'Syria':	'Syria',
'Taiwan':	'Taiwan',
'Tajikistan':	'Tajikistan',
'Tanzania':	'Tanzania',
'Thailand':	'Thailand',
'Togo':	'Togo',
'Tonga':	'Tonga',
'Transnistria':	'Transnistria',
'Trinidad and Tobago':	'Trinidad_and_Tobago',
'Tunisia':	'Tunisia',
'Turkey':	'Turkey',
'Turkmenistan':	'Turkmenistan',
'United Arab Emirates':	'UAE',
'Uganda':	'Uganda',
'Ukraine':	'Ukraine',
'United Kingdom':	'United_Kingdom',
'United States':	'United_States',
'Uruguay':	'Uruguay',
'Uzbekistan':	'Uzbekistan',
'Vanuatu':	'Vanuatu',
'Venezuela':	'Venezuela',
'Vietnam':	'Vietnam',
'Western Sahara':	'Western_Sahara',
'Yemen':	'Yemen',
'Zambia':	'Zambia',
'Zimbabwe':	'Zimbabwe'};

/**
 sRGBColor : #ff00ff
*/
function reColor(oXml, sCountry, sRGBColor) {
	iterateCountries(oXml,
	function(name, gorPath) {
		
			if((name === sCountry || sCountry === "*" || (aliases[sCountry] && aliases[sCountry] === name)) && gorPath) {
				var alwaysArr;
                if( gorPath.path) {
				   alwaysArr =(Object.prototype.toString.call(gorPath.path) === "[object Array]") ? gorPath.path : [gorPath.path]; 
				} else {
					alwaysArr = [gorPath];
				}
				alwaysArr.forEach(function(path) 
				{
					if (path.$ && path.$.style) {
						path.$.style = path.$.style.replace(/fill:#[^\;"]*/,"fill:" + sRGBColor);
						//console.log(path.$.style);			
					} else {
						console.log("\n\n\nstrange " + sCountry + (Object.prototype.toString.call(path)) + " " + JSON.stringify(path));
					}
				});
			}
	});
};
	

 function RGB2Color(r,g,b)
  {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
  }

  function byte2Hex(n)
  {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
  }


function makeColorP(frequency1, frequency2, frequency3,
                             phase1, phase2, phase3,
                             center, width, i)
  {
    if (center == undefined)   center = 128;
    if (width == undefined)    width = 127;
       var red = Math.sin(frequency1*i + phase1) * width + center;
       var grn = Math.sin(frequency2*i + phase2) * width + center;
       var blu = Math.sin(frequency3*i + phase3) * width + center;
       return RGB2Color(red,grn,blu);
  }


  
function makeColorGradient(frequency1, frequency2, frequency3,
                             phase1, phase2, phase3,
                             center, width, len)
  {
    if (center == undefined)   center = 128;
    if (width == undefined)    width = 127;
    if (len == undefined)      len = 50;

    for (var i = 0; i < len; ++i)
    {
       var red = Math.sin(frequency1*i + phase1) * width + center;
       var grn = Math.sin(frequency2*i + phase2) * width + center;
       var blu = Math.sin(frequency3*i + phase3) * width + center;
       document.write( '<font color="' + RGB2Color(red,grn,blu) + '">&#9608;</font>');
    }
  }
  var freq = Math.PI/50;
  
  //makeColorGradient(freq,freq,freq,0,2,4,127,127,50);
  //document.write('<br/>');
  //makeColorGradient(freq,freq,freq,0,2,4,200,55,50);
  
  //document.write('<br/>');
    
  function makeColor(sF) {
    var freq = Math.PI/50;
     return makeColorP(freq,freq,freq,0,2,4,127,127, sF *50.0);
  };

var mp = { "India" : makeColor(0.1),
            "Germany" : makeColor(0.2),
            "France" : makeColor(0.3),
            "Norway" : makeColor(0.4),
            "Sweden" : makeColor(0.5),
            "Denmark" : makeColor(0.6),
            "Russia" : makeColor(0.7),
            "Ukraine" : makeColor(0.3),
            "Germany" : makeColor(0.8)			
			};
  
  
fs.readFile(__dirname + "/public/mapofworld.svg", function(err,data) {
	parser.parseString(data, function(err,result) {
//		  console.dir(JSON.stringify(result));
		  console.log('done');
	      iterateCountries(result, function(name,obj) { console.log(name);});
          builder = new xml2js.Builder();
		  reColor(result, "India", "#ffffff");
		  reColor(result, "Germany", "#ff00ff");
		  reColor(result, "Russia", "#ff00ff");
		  for (var name in mp) {
			  if (mp.hasOwnProperty(name)) {
				  console.log("name>" + name);
	 	        reColor(result, name, mp[name]);
				//alert(name);
			  }
			}
			console.log("done1");
		  var xml = builder.buildObject(result);
		  	var wstream = fs.createWriteStream("public/out.svg"); //'rawdata_2122w.txt');
		    wstream.write(xml);
			wstream.end();
			wstream = fs.createWriteStream(__dirname + "/public/out.json"); //'rawdata_2122w.txt');
		    wstream.write(JSON.stringify(result));
			wstream.end();
	});
});

// node v0.10+ use native Transform, else polyfill
var Transform = stream.Transform ||
  require('readable-stream').Transform;

function WinEOL(options) {
  // allow use without new
  if (!(this instanceof WinEOL)) {
    return new WinEOL(options);
  }

  // init Transform
  Transform.call(this, options);
}
util.inherits(WinEOL, Transform);

WinEOL.prototype._transform = function (chunk, enc, cb) {
  //console.log(chunk.toString('utf-8'));
  var upperChunk = chunk.toString('utf-8').replace(/\r/g,'\r\n');//toString().toUpperCase();
//  console.log("upperchunk>>" + upperChunk + "<<<\n");
  this.push(new Buffer(upperChunk), enc);
  cb();
};
var colorgrad = require('./client.js');

function makeSVGMapStream(data,stream) {
	var mp = data;
fs.readFile(__dirname + "/public/mapofworld.svg", function(err,data) {
	parser.parseString(data, function(err,result) {
//		  console.dir(JSON.stringify(result));
		  console.log('==================');
		  console.log('Countries from map');
	      iterateCountries(result, function(name,obj) { console.log(name);});
          builder = new xml2js.Builder();
		  reColor(result, "*", "#ffffff");
		  for (var name in mp) {
			  if (mp.hasOwnProperty(name)) {
				  console.log("recolor name> " + name);
	 	        reColor(result, name, colorgrad.makeColor(mp[name]));
				//alert(name);
			  }
			}
		//	console.log("done1");
		  var xml = builder.buildObject(result);
		  	var wstream = stream; // fs.createWriteStream("public/out.svg"); //'rawdata_2122w.txt');
		    wstream.write(xml);
			wstream.end();
			//wstream = fs.createWriteStream(__dirname + "/public/out.json"); //'rawdata_2122w.txt');
		    //wstream.write(JSON.stringify(result));
			//wstream.end();
	});
});
	

}

// try it out
var upper = new WinEOL();
upper.setEncoding('utf-8');
upper.pipe(process.stdout); // output to stdout
upper.write('hello world\n','utf-8'); // input line 1
//upper.write('another line');  // input line 2
upper.end();  // finish


module.exports = {
	makeSVGMapStream : makeSVGMapStream,
	getCountryAliases : function() { return JSON.parse(JSON.stringify(aliases)); }
}