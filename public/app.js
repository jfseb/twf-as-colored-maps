(function(){ 
var app = angular.module('mapDataA', [ 'ngRoute' ], ['$routeProvider', '$locationProvider', 
	function(routeProvider, locationProvider ) {
		
	}

]);



 app.controller('MainController', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;
 })
 
var gem = { name : "x" , button : true};

function getFileSync(sFn) {
var http = new XMLHttpRequest();
http.open("GET",sFn,false);
 http.send();
	//console.log(http.responseText);
	return  JSON.parse(http.responseText);
}

var countries = getFileSync("/countries");
var fields = getFileSync("/fields");
var colors = getFileSync("/colors");

app.controller('StaticData', function() {
	 this.product = gem;
	 this.colors = colors;
	 this.fields = fields;
	 this.countries = countries;
	 this.sortOrder = true;
});

app.controller('NOTINUSE', function($scope, $routeParams) {
	 this.product = gem;
	 console.log("not in use instantiated" + JSON.stringify($routeParams));
	 this.colors = colors;
	 this.fields = fields;
	 this.countries = countries;
	 this.sortOrder = true;
});


var rColorData = getFileSync("/datascale_2018");

app.controller('FieldData', function() {
	 this.product = gem;
	 this.colors = colors;
	 this.fields = fields;
	 this.filterText ="myFilter";
	 this.colorData = rColorData;
	 this.fields = fields;
	 this.countries = countries;
});



app.controller('FieldTableData', function($scope, $routeParams) {
	 console.log("MapFieldData with RouteParams: " + JSON.stringify($routeParams));
	 $scope.fieldIndex = $routeParams.fieldIndex;
	 this.product = gem;
	 this.colors = colors;
	 this.field = fields.filter(function(obj) { return obj.nr === $routeParams.fieldIndex;});
	 if ( this.field.length) {
		 this.field = this.field[0];
	 }
	 $scope.field = this.field;
	 $scope.rawData = getFileSync("/datar_" + $scope.fieldIndex);
	 this.rawData = $scope.rawData;
});

app.controller('MapFieldData', function($scope, $routeParams) {
	 console.log("MapFieldData with RouteParams: " + JSON.stringify($routeParams));
	 $scope.fieldIndex = $routeParams.fieldIndex;
	 this.product = gem;
	 this.colors = colors;
	 this.field = fields.filter(function(obj) { return obj.nr === $routeParams.fieldIndex;});
	 if ( this.field.length) {
		 this.field = this.field[0];
	 }
	 this.filterText ="myFilter";
	 this.colorData = rColorData;
	 $scope.field = this.field;
	 $scope.colorData = getFileSync("/datascale_" + $scope.fieldIndex);
	 $scope.rawData = getFileSync("/datar_" + $scope.fieldIndex);
	 this.colorData = $scope.colorData;
	 this.countries = countries;
	 	 
	 function getPosition(element) {
		 var xPosition = 0;
		 var yPosition = 0;
	  
		while(element) {
			xPosition += (element.offsetLeft - 0 * element.scrollLeft + element.clientLeft);
			yPosition += (element.offsetTop - 0 * element.scrollTop + element.clientTop);
			console.log('offsetTop' + element.offsetTop  + " - scrollTop " + element.scrollTop + " " + element.clientTop );
			element = element.offsetParent;
		}
		return { x: xPosition, y: yPosition };
	} // getPosition


//var tooltip = d3.selectAll(".tooltip:not(.css)");
var HTMLmouseTip = $('#HTMLmouseTip'); 
var onMouseMove = function(oCountry, ev) {    
		var u = getPosition($('#svgobj').get()[0]);		
//console.log('mouse move fctx sCountry '+  oCountry + "  y " + (u.y) + " pageY" + ev.pageY);

        HTMLmouseTip.get()[0]
            .style.left =   Math.max(0, u.x + ev.pageX + 15) + "px";
        HTMLmouseTip.get()[0].style.top = Math.max(0, u.y + ev.pageY - 10) + "px";
        HTMLmouseTip.get()[0].style.opacity = "60";
		HTMLmouseTip.get()[0].innerHTML = oCountry.country + "<br />" + oCountry.valueStr;
};

var onMouseOut = function() {
console.log('mouse out fct');
        HTMLmouseTip.get()[0].style.opacity = "0";
};

$('#svgobj')[0].addEventListener('load', function() {
        console.log("attach events");
		$('#Germany',$('#svgobj').get()[0].contentDocument).on("mousemove", function() {
		   console.log('Mouse move over germany via load');
		});
		$scope.rawData.forEach(function(data) {
			var sCountry = data.country;
			var valueNice = data.value;
			aObj = $('#' + data.svgCountry, $('#svgobj').get()[0].contentDocument);
			if( aObj.length) {
				aObj.on('mousemove', onMouseMove.bind(this,{ country: sCountry,  svgCountry : data.svgCountry, valueStr : data.valueStr, value : valueNice}));
				aObj.on('mouseout', onMouseOut);
			}		
		});
		$('#Iraq',$('#svgobj').get()[0].contentDocument).on("mousemove", onMouseMove);
		$('#Iraq',$('#svgobj').get()[0].contentDocument).on("mouseout", onMouseOut);
});
    
});

app.controller('FieldsData', function($scope, $routeParams) {
	 console.log("got filtertext" + $scope.filterText);
	 //console.log("new fieldsdata url" + JSON.stringify($routeArgsX));
	 this.product = gem;

	console.log("got filtertext" + $scope.filterText);
	 this.product = gem;
	 this.colors = colors;
	 var that = this;
	 $scope.fieldIndex = "1111";
	 $scope.filterText = "GDP";
     var fFilter = function(iEntry) { 
	    var strs = $scope.filterText.split(/\s+/);
		var searchstr = iEntry.description + " " + iEntry.nr + " " + iEntry.fieldName 
		return $scope.filterText === "" || 
		   strs.every(function(str) {  return searchstr.indexOf(str) >= 0});
		//(iEntry.description && iEntry.description.indexOf($scope.filterText) >= 0); 
	};
	var applyFn = function() {
		var fx = fields.filter(fFilter);
		for(i = 0; i < fx.length; ++i) {
			if ($scope.filteredFields[i] !== fx[i]) {
				$scope.filteredFields[i] = fx[i];
			}
		}
		$scope.filteredFields.splice(fx.length, $scope.filteredFields.length - fx.length);
		//that.filteredFields = $scope.filteredFields;
		//$scope.$apply();
		console.log("new length " + $scope.filteredFields.length);
	}
	$scope.filteredFields = [];
	applyFn();
	this.filteredFields = $scope.filteredFields; // fields;
	 //$scope.filteredFiels = applyFn();$scope.filteredFields || fields;
//	$scope.filteredFields = fields.filter(fFilter);
	$scope.$watch("filterText", function() { console.log("new filter value: " + $scope.filterText);
		if ($scope.$$phase) { // most of the time it is "$digest"
		console.log("in digest");
			applyFn();
		} else {
			//$scope.$apply(applyFn);
		}
		//$scope.filteredFields =  fields.filter(function(iEntry) { return $scope.filterText === "" || iEntry.description && iEntry.description.indexOf($scope.filterText) >= 0); });
	 });
	 $scope.filterText = $scope.filterText || "AFilter";
     $scope.longFilter = "*" + $scope.filterText + "more ";
	 this.filterText ="myFilter";
	 this.colorData = rColorData;
	 this.countries = countries;
});


app.controller('FieldsDataS', ['$scope', '$route', '$routeParams', '$location', '$log', function($scope, $route, $routeParams, $location, console) {
	 console.log("got filtertext" + $scope.filterText);
	 //console.log("new fieldsdata url" + JSON.stringify($routeArgsX));
	 console.log("got filtertext" + $scope.filterText);
	 $scope.route = $route; 
	 $scope.$routeParams = $routeParams;
	 $scope.$location = $location;
	 
	  //1. This needs to be enabled for each controller that needs to watch routeParams
    //2. I believe some encapsulation and reuse through a service might be a better way
    //3. The reference to routeParams will not change so we need to enable deep dirty checking, hence the third parameter
    
    $scope.$watch('$routeParams', function(newVal, oldVal) {
      angular.forEach(newVal, function(v, k) {
        $location.search(k, v);
		  if ( k === "filterText") {
        	$scope.filterText = v;
        }
      });
    }, true);
	 
	 this.product = gem;
	 this.colors = colors;
	 var that = this;
	 $scope.fieldIndex = "1111";
	 $scope.filterText = $location.search() && $location.search().filterText  || $scope.filterText || "GDP";
     var fFilter = function(iEntry) { 
	    var strs = $scope.filterText.split(/\s+/);
		var searchstr = iEntry.description + " " + iEntry.nr + " " + iEntry.fieldName 
		return $scope.filterText === "" || 
		   strs.every(function(str) {  return searchstr.indexOf(str) >= 0});
		//(iEntry.description && iEntry.description.indexOf($scope.filterText) >= 0); 
	};
	var applyFn = function() {
		var fx = fields.filter(fFilter);
		for(i = 0; i < fx.length; ++i) {
			if ($scope.filteredFields[i] !== fx[i]) {
				$scope.filteredFields[i] = fx[i];
			}
		}
		$scope.filteredFields.splice(fx.length, $scope.filteredFields.length - fx.length);
		//that.filteredFields = $scope.filteredFields;
		//$scope.$apply();
		console.log("new length " + $scope.filteredFields.length);
	}
	$scope.filteredFields = [];
	applyFn();
	this.filteredFields = $scope.filteredFields; // fields;
	 //$scope.filteredFiels = applyFn();$scope.filteredFields || fields;
//	$scope.filteredFields = fields.filter(fFilter);
	$scope.$watch("filterText", function() { console.log("new filter value: " + $scope.filterText);
		if ($scope.$$phase) { // most of the time it is "$digest"
		console.log("in digest");
			applyFn();
			$location.search("filterText", $scope.filterText);
		} else {
			//$scope.$apply(applyFn);
		}
		//$scope.filteredFields =  fields.filter(function(iEntry) { return $scope.filterText === "" || iEntry.description && iEntry.description.indexOf($scope.filterText) >= 0); });
	 });
	 $scope.filterText = $scope.filterText || "AFilter";
     $scope.longFilter = "*" + $scope.filterText + "more ";
	 this.filterText ="myFilter";
	 this.colorData = rColorData;
	 this.countries = countries;
}]);



app.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.when('/about', {
			controller: 'FieldsData',
			templateUrl : 'partials/about.html'
		}).when('/fields?:filter', {
			controller: 'FieldsData',
			templateUrl : 'partials/fields.html'
		}).when('/fields', {
			controller: 'FieldsData',
			templateUrl : 'partials/fields.html'
		}).when('/fields2/:filterXText', {
			controller: 'FieldsDataS',
			templateUrl : 'partials/fields.html',
			reloadOnSearch : false
		}).when('/fieldmap/:fieldIndex',{
			controller: 'MapFieldData',
			templateUrl : 'partials/colormap.html' 
			//function(oArgs) { console.log("MapFieldData url:" + JSON.stringify(oArgs)); return 
			//    'partials/colormap.html'
			//; }
		}).when('/fieldtopn/:fieldIndex',{
			controller: 'FieldTableData',
			templateUrl : 'partials/topbottomn.html' 
			//function(oArgs) { console.log("MapFieldData url:" + JSON.stringify(oArgs)); return 
			//    'partials/colormap.html'
			//; }
		}).when('/notinuse',{
			controller: 'NOTINUSE',
			template : function(oArgs) { console.log("here we go" + JSON.stringify(oArgs)); return "<div>NOTINUSE</div>"; }
		}).otherwise({
			redirectTo: '/field/2018'
		});
	}
]);

})();

