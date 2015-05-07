

  //alert("what");
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
  
//  makeColorGradient(freq,freq,freq,0,2,4,127,127,50);
//  document.write('<br/>');
//  makeColorGradient(freq,freq,freq,0,2,4,200,55,50);
    
  function makeColor(sF) {
    var freq = Math.PI/50;
     return makeColorP(freq,freq,freq,0,2,4,127,127, sF *50.0);
  };

  function makeGradientHTML() {
	var s = "";
	  
	for( var k = 0; k < 1; k += 0.05) {
       s = s + '<font color="' + makeColor(k) + '">&#9608;</font>';
	}
	return s;
  }


/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 */
module.exports = {
  makeColor : makeColor,
  /**
   * Unescape special characters in the given string of html.
   *
   * @param  {String} html
   * @return {String}
   */
  makeGradientHTML : makeGradientHTML
};
