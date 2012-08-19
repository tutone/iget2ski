/*An example of using the MQA.EventUtil to hook into the window load event and execute defined function 
    passed in as the last parameter. You could alternatively create a plain function here and have it 
    executed whenever you like (e.g. <body onload="yourfunction">).*/ 

    function loadMap() {
	
	
		
      /*Create an object for options*/ 
      var options={
        elt:document.getElementById('map_canvas'),       /*ID of element on the page where you want the map added*/ 
        zoom:10,                                  /*initial zoom level of the map*/ 
        latLng:{lat:39.7425, lng:-105.513062},   /*center of map in latitude/longitude -105.513062,"lat":39.7425 */ 
        mtype:'osm',                              /*map type (osm)*/ 
        bestFitMargin:0,                          /*margin offset from the map viewport when applying a bestfit on shapes*/ 
        zoomOnDoubleClick:true                    /*zoom in when double-clicking on map*/ 
      };
      
	  /*Construct an instance of MQA.TileMap with the options object*/ 
      window.map = new MQA.TileMap(options);
      
      MQA.withModule('largezoom', function() {
      map.addControl(
       new MQA.LargeZoom(),
       new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5))
      );
      });
      
      MQA.withModule('geolocationcontrol', function() {
        
        map.addControl(
          new MQA.GeolocationControl()
        );
    
      });

      console.log('map loaded');
    }
    
    function loadWebcams() {
    
    	/*Using the MQA.Poi constructor*/ 
  		var berthoud_cam=new MQA.Poi({lat:40.320969, lng:-104.980774});
  		var camIcon=new MQA.Icon("http://cotrip.org/theme/cotrip.org/images/cameraTour/icon_camera_still_22x20.gif",22,20);

  		/*Sets the rollover content of the POI.*/ 
		berthoud_cam.setRolloverContent('View the BERTHOUD station web camera');
	
		/*Sets the InfoWindow contents for the POI. By default, when the POI receives a mouseclick 
		event, the InfoWindow will be displayed with the HTML passed in to MQA.POI.setInfoContentHTML method.*/ 
		berthoud_cam.setInfoContentHTML('Camera type: Still. Images Courtesy of ITS <img style="width:300px; height:200px;" src="http://cotrip.org/images/ws/camera?imageURL=77"/>');
		berthoud_cam.setIcon(camIcon);
		berthoud_cam.maxInfoWindowWidth = 420;
	
		/*This will add the POI to the map in the map's default shape collection.*/ 
		map.addShape(berthoud_cam);
    }
    
    function addStationToMap(station) {
		console.log(station);
		var lat = station.geometry.coordinates[1];
		var lon = station.geometry.coordinates[0];
		var stationPoi = new MQA.Poi({lat:lat, lng:lon});
		var stationIcon = new MQA.Icon("http://cotrip.org/theme/cotrip.org/images/devices/icon_device_weather_station_with_cam_16x23.gif",16,23);
		stationPoi.setRolloverContent(station.id + "<br/>Current Temp: " + station.properties.CurrentTemp + "<br/>");
		var stationContent = "<div style='overflow: scroll;'>" + station.id + "<br/><br/>";
        stationContent += "Current Temp: " + station.properties.CurrentTemp + "<br/>";
        stationContent += "Max Temp: " + station.properties.MaxTemp + "<br/>";
        stationContent += "Min Temp: " + station.properties.MinTemp + "<br/>";
        stationContent += "Average WS: " + station.properties.AvgWS + "<br/>";
        stationContent += "Est Precip: " + station.properties.EstPrecip + "<br/>";


		if (station.properties.NorthImage != null) {
			console.log('adding station image');
			stationContent += "NorthImage: ";
			stationContent += "<img src='";
			stationContent += station.properties.NorthImage;
			stationContent += "' style='width:200px; height:200px;' />";
		}
		if (station.properties.EastImage != null) {
			console.log('adding station image');
			stationContent += "EastImage: ";
			stationContent += "<img src='";
			stationContent += station.properties.EastImage;
			stationContent += "' style='width:200px; height:200px;' />";
		}
		if (station.properties.SouthImage != null) {
			console.log('adding station image');
			stationContent += "SouthImage: ";
			stationContent += "<img src='";
			stationContent += station.properties.SouthImage;
			stationContent += "' style='width:200px; height:200px;' />";
		}
		if (station.properties.WestImage != null) {
			console.log('adding station image');
			stationContent += "WestImage: ";
			stationContent += "<img src='";
			stationContent += station.properties.WestImage;
			stationContent += "' style='width:200px; height:200px;' />";
		}
		stationContent += "</div>";
		stationPoi.setInfoContentHTML(stationContent);
		stationPoi.setIcon(stationIcon);
		map.addShape(stationPoi);
		//{"type":"Feature","geometry":{"type":"Point","coordinates":[-104.631233,37.417255]},"properties":{"NorthImage":"http://cotrip.org/images/ws/camera?imageURL=243","SouthImage":"http://cotrip.org/images/ws/camera?imageURL=244","WestImage":"http://cotrip.org/images/ws/camera?imageURL=245"},"id":"025N033 AGUILAR"},

	}
	
	function loadWeatherStations() {
		// $.ajax({url: url,
// 				dataType: 'json',
// 				data: data,
// 				success: success
// 		});
		console.log('show weather stations');
		$.getJSON('stations.json', function(data) {
			console.log(" data.length: " + data.length);
			var numStations = data.length;
			for (var i=0; i < data.length; i++) {
				addStationToMap(data[i]);
			}
			//$('.result').html('<p>' + data.foo + '</p>'
			//+ '<p>' + data.baz[1] + '</p>');
		});

	}
	
	function eventRaised(evt){
		console.log('mapquest event raised: ',evt);
//     	var e=document.createElement('div');
//     	e.innerHTML=evt.eventName;
//     	var eDiv=document.getElementById('showEvents');
//     	eDiv.insertBefore(e, eDiv.firstChild)
  	}
  	
  	function addResortToMap(fcdata, textStatus, errorThrown) {
  		var resorts = [{name:'Breckenridge',"lng":-106.037804,"lat":39.481701},
						{name:'Keystone','lat':39.605,'lng': -105.954167},
						{name:'Winter Park','lat': 39.886944,'lng': -105.7625},
						{name:'Vail','lat': 39.6391, 'lng': -106.3738}];
		var resortLat = 0, resortLon = 0; 
		var resort = {};
		var resortName = "";
		fcdata.locations.map(function(fcPlace) {
			if (fcPlace.state.code === 'CO') {
				resortName = fcPlace.city + ', ' + fcPlace.state.name;
				console.log('resort name: ', resortName);
				switch (true) {
      				case /Breckenridge/.test(resortName):
        			 resort.name = resortName;
        			 resort.lat = 39.481701;
        			 resort.lng = -106.037804;
        			break;
        			case /Keystone/.test(resortName):
        			 resort.name = resortName;
        			 resort.lat = 39.605;
        			 resort.lng = -105.954167;
        			break;
        			case /Winter/.test(resortName):
        			 resort.name = resortName;
        			 resort.lat = 39.886944;
        			 resort.lng = -105.7625;
        			break;
        			case /Vail/.test(resortName):
        			 resort.name = resortName;
        			 resort.lat = 39.6391;
        			 resort.lng = -106.3738;
        			break;
        			default:
        			 console.warn("Didn't match any locations");
        			break;
        		}		  
			}
		});
		
		resortLat = resort.lat;
		resortLon = resort.lng;
		//console.log('resortName(',resort.name,'): ', resortName,' at ',resortLat,',',resortLon);
						
		//http://www.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluua25utl1%2Crg%3Do5-962slw&callback=renderOptions&inFormat=kvp&outFormat=json&location=Breckenridge,%20CO
		var resortPoi=new MQA.Poi({lat:resortLat, lng:resortLon});
		//-106.037804,"lat":39.481701
		var resortIcon=new MQA.Icon("img/sport_skiing_downhill.p.24.png",24,24);

		/*Sets the rollover content of the POI.*/ 
		resortName = (resortName === "" ? resort.name : resortName);
		resortPoi.setRolloverContent('<strong>' + resortName + '</strong>');

		/*Sets the InfoWindow contents for the POI. By default, when the POI receives a mouseclick 
		event, the InfoWindow will be displayed with the HTML passed in to MQA.POI.setInfoContentHTML method.*/ 
		//resortPoi.setInfoContentHTML('Camera type: Still. Images Courtesy of ITS <img style="width:300px; height:200px;" src="http://cotrip.org/images/ws/camera?imageURL=77"/>');
		resortPoi.setIcon(resortIcon);
		resortPoi.maxInfoWindowWidth = 420;

		/*This will add the POI to the map in the map's default shape collection.*/ 
		map.addShape(resortPoi);
		
		MQA.EventManager.addListener(map, 'infowindowopen', eventRaised);
		
		MQA.withModule('directions', function() {
			map.addRoute([
			  {latLng: {lat: 39.739167, lng: -104.984722}},
			  {latLng: {lat: resortLat, lng: resortLon}}
			]);
		});
  	}
  	
  	function loadResort() {
  		
		var fullContactAPI = "https://api.fullcontact.com/v2/address/locationEnrichment.json";
		var fcApiKey = "4c15158dd13e774d";
		var resortName = "";
		//document.title = "Vail Map";
		console.log("doc title: " + document.title.split(" ")[0]);
		var titleStrings = document.title.split(" ");
		resortName = titleStrings[0];
		
		$.ajax({url: fullContactAPI, 
					cache: false, 
					async: false,
					dataType: 'jsonp', 
					data: { 
						apiKey: fcApiKey, 
						place: encodeURI(resortName)
					}, 	
					error: function(jqXHR, textStatus, errorThrown){
						console.warn("There was an error on the FullContact call, status is:" + textStatus);
					},
					success: function(fcdata, textStatus, errorThrown) {
						addResortToMap(fcdata, textStatus, errorThrown);
					}
		});	
  	}
	
	function loadResorts() {
		// mq key Fmjtd%7Cluua25utl1%2Crg%3Do5-962slw
		var resorts = [{name:'Breckenridge',"lng":-106.037804,"lat":39.481701},
						{name:'Keystone','lat':39.605,'lng': -105.954167},
						{name:'Winter Park','lat': 39.886944,'lng': -105.7625},
						{name:'Vail','lat': 39.6391, 'lng': -106.3738}]; 
		//['Breckenridge','Keystone','Winter Park','Vail'];
		var fullContactAPI = "https://api.fullcontact.com/v2/address/locationEnrichment.json";
		var fcApiKey = "4c15158dd13e774d";
		var resortName = "";
		var resortLat = 0, resortLon = 0;
		resorts.map(function(resort) {
			// hit FC 
			var fcUrl = fullContactAPI;
			$.ajax({url: fcUrl, 
					cache: false, 
					async: false,
					dataType: 'jsonp', 
					data: { 
						apiKey: fcApiKey, 
						place: resort.name
					}, 	
					error: function(jqXHR, textStatus, errorThrown){
						console.warn("There was an error on the FullContact call, status is:" + textStatus);
					},
					success: function(fcdata, textStatus, errorThrown) {
						//console.log('fc returns ', fcdata);
						fcdata.locations.map(function(fcPlace) {
							if (fcPlace.state.code === 'CO') {
								resortName = fcPlace.city + ', ' + fcPlace.state.name;
								console.log('resort name: ', resortName);
							}
						});
						
						resortLat = resort.lat;
						resortLon = resort.lng;
						console.log('resortName(',resort.name,'): ', resortName,' at ',resortLat,',',resortLon);
						
						//http://www.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluua25utl1%2Crg%3Do5-962slw&callback=renderOptions&inFormat=kvp&outFormat=json&location=Breckenridge,%20CO
						var resortPoi=new MQA.Poi({lat:resortLat, lng:resortLon});
						//-106.037804,"lat":39.481701
						var resortIcon=new MQA.Icon("../img/sport_skiing_downhill.p.24.png",24,24);
				
						/*Sets the rollover content of the POI.*/ 
						resortName = (resortName === "" ? resort.name : resortName);
						resortPoi.setRolloverContent('<strong>' + resortName + '</strong>');
				
						/*Sets the InfoWindow contents for the POI. By default, when the POI receives a mouseclick 
						event, the InfoWindow will be displayed with the HTML passed in to MQA.POI.setInfoContentHTML method.*/ 
						//resortPoi.setInfoContentHTML('Camera type: Still. Images Courtesy of ITS <img style="width:300px; height:200px;" src="http://cotrip.org/images/ws/camera?imageURL=77"/>');
						resortPoi.setIcon(resortIcon);
						resortPoi.maxInfoWindowWidth = 420;
				
						/*This will add the POI to the map in the map's default shape collection.*/ 
						map.addShape(resortPoi);
						
						MQA.EventManager.addListener(map, 'infowindowopen', eventRaised);
						
						MQA.withModule('directions', function() {
							map.addRoute([
							  {latLng: {lat: 39.739167, lng: -104.984722}},
							  {latLng: {lat: resortLat, lng: resortLon}}
							]);
						});
						
						// 
// 						
// 						navigator.geolocation.getCurrentPosition(function(position) {
// 							map.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
// 						
	
						/*Uses the MQA.TileMap.addRoute function (added to the TileMap with the directions module) 
						passing in an array of location objects as the only parameter.*/ 
												
					}
			});
			
		});
				
	}
    
    function findDeviceWidthAndHeight() {
    	var h = $(window).height();
		var rh = h+10;
		console.log('h: ', h, ' rh: ', rh);
		var w = $(window).width();
		$("#map_canvas").css('width',w+'px');
		console.log(' width: ',w);
		$("#map_canvas").css('height',rh+'px');
		//document.getElementById("map_canvas").style.width=window.innerWidth;
		//document.getElementById("map_canvas").style.height=window.innerHeight;

	}
    
    $(document).bind('pageinit', function(event) {
    	console.log('page loaded');
    	findDeviceWidthAndHeight();
    	loadMap();
    	loadResort();
    	//loadResorts();
    	loadWebcams();
    	$('#loadWeather').live('click', loadWeatherStations);

    });
    
    console.log('page downloaded');
    
    
    