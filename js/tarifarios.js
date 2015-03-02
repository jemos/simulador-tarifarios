	

	//
	// Record sample controller gathers sample basic information from SampleProvider service,
	// and stores it in the scope.
	//
	myApp.controller('RecordSampleController', ['$scope', function($scope) {
		console.log("RecordSampleController() called");
		$scope.dataSet = [ 1, 2, 3 ];
		$scope.filterList = [
			{ string: 0, name: "Above 0"},
			{ string: 1, name: "Above 1"},
			{ string: 2, name: "Above 2"},
		];
	}]);

	myApp.controller('RecordFilterController', ['$scope', 'recordFilter', function($scope,recordFilter) {

		console.log("RecordFilterController() called");

		console.log("  filter.string = "+$scope.filterEntry.string);
		var oldSet = $scope.dataSet;
		$scope.dataSet = recordFilter(oldSet,$scope.filterEntry.string);
		console.log("  filtered set has "+$scope.dataSet.length+" entries.");
	}]);

	myApp.factory('recordFilter', function() {
		return function(recordList,filterString) {
			var newList = [];
			recordList.forEach( function(rec) {
				if( rec > filterString )
					newList.push(rec);
			});
			return newList;
		};
	});

	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	var allPhoneRecords = [];
	
	// Function parses 
	function processFileData(fileName,lineList)
	{
		//$('#phoneRecords').append($('<tr><td>#</td><td>Tipo Com.</td><td>Data</td><td>Destino</td><td>Tipo</td><td>Duração (min)</td>'));
		
		for(var i = 0, j = 0 ; i < lineList.length ; i++ ) {
		
			var line = lineList[i].trim();
			var phoneRecord = lineList[i].split("\t");
			
			if( phoneRecord.length < 10 )
				continue;
				
			var recLand = phoneRecord[2];
			var recDate = phoneRecord[5];
			var recDest = phoneRecord[7]+phoneRecord[8]+phoneRecord[9];
			var recType = phoneRecord[10];
			var orgType = recType;
			var recDuration = phoneRecord[11];
			
			if( !isNumber(recDate) || !isNumber(recDest) ) {
				continue;
			}
			
			// Convert record type to shorter identifier
			if( recType.match('SMS *') || recType.match('Mens. Escrita') ) {
				recType = "SMS"; // (" + recType+")";
			} else {
				recType = "CHAMADA"; // (" + recType+")";
			}
			
			if( recType != "SMS" ) {
				var recDurSplit = recDuration.split(':');
				recDuration = parseInt(recDurSplit[0])*3600+parseInt(recDurSplit[1])*60+parseInt(recDurSplit[2]);
			} else {
				recDuration = 0;
			}
			
			if( recLand.length && recType.length && recDate.length && recDest.length ) {
				//newRecord = $('<tr><td>'+(i+1)+'</td><td>'+recLand+'</td><td>'+recDate+'</td><td>'+recDest+'</td><td>'+recType+'</td><td>'+(recDuration/60)+'</td>');
				//$('#phoneRecords').append(newRecord);
				allPhoneRecords.push( {land: recLand, date: parseInt(recDate), destination: recDest, type: recType, duration: recDuration,
					orgType: orgType} );
			}
		}
	}
	
	//
	// The operator plan object, should be created for each existing plan.
	//
	function OperatorPlan(name,costFunc) {
		this.type = "OperatorPlan";

		this.calcCost = costFunc;
		this.name = name;
	}

	// The most important function, calculates the cost based on the plan
	// and the record set provided. Returns the cost value.
	OperatorPlan.prototype.calcCost = function(recordSet) {
		throw "ERROR: trying to call undefined function calcCost!";
	};

	$(document).ready( function() {
	
		
		return;

		// Check for the various File API support.
		if (window.File && window.FileReader && window.FileList && window.Blob) {
		  // Great success! All the File APIs are supported.
		  // 
		} else {
		  alert('The File APIs are not fully supported in this browser.');
		}
		
		$('#files')[0].addEventListener('change', handleFileSelect, false);

		window.netCallDistributionGraph = new Morris.Bar({
		  		element: 'netCallDistributionGraph',
	  			data: [ { op: 'Vodafone', min: 0 }, { op: 'Outros', min: 0 } ],
	  			xkey: 'op',
	  			ykeys: ['min'],
	  			labels: ['Minutos']
			});
		
	});