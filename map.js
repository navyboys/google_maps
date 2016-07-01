$(function () {

  var map;
	var stanleyPark = { lat: 49.3017084, lng: -123.143889 };
	var markers = [];
	var consumerKey = 'qz8mCUnG3TfLROFxKqeX9HL5ziuufsihL0trl97D';
	var imageSize = '2';
	var radius = '50km';
	var rpp = '100';
	var url = '';

	function initialize() {
		var mapDiv = document.getElementById('map-canvas');
		var mapOptions = {
		  center: stanleyPark,
		  zoom: 12,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		google.maps.event.addDomListener(map, 'mouseup', plot500);
		plot500();
	}

	google.maps.event.addDomListener(window, 'load', initialize);

	var clearMarkers = function() {
		for (var i = 0, size = markers.length; i < size; i++) {
			markers[i].setMap(null);
		}
	};

	var plot500 = function() {

    var urlLat = map.getCenter().lat();
		var urlLong = map.getCenter().lng();
		url = 'https://api.500px.com/v1/photos/search?geo=' + urlLat + ',' + urlLong + ',' + radius + '&rpp=' + rpp + '&image_size=' + imageSize + '&consumer_key=' + consumerKey;

		$.getJSON(url, function (data) {
			var imageCollection = [];

			$(data.photos).each(function (index, photo) {
				imageCollection.push({
					lat: photo.latitude,
					lng: photo.longitude,
					url: photo.image_url,
					description: photo.description,
					name: photo.name
				});
			});

			if (markers) {
				clearMarkers();
			}

			$(imageCollection).each(function(index, pin) {
				var myLatlng = new google.maps.LatLng(pin.lat, pin.lng);
				var contentString = '<div id="content">'+
											      '<div id="siteNotice">'+
											      '</div>'+
											      '<h1 id="firstHeading" class="firstHeading">' + pin.name + '</h1>'+
											      '<div id="bodyContent">'+
											      '<img src=' + pin.url + '>'+
											      '<p>' + pin.description + '</p>' +
											      '</div>'+
											      '</div>';
				var marker = new google.maps.Marker({
		      position: myLatlng,
		      map: map,
		      title: pin.description,
		      clickable: true
	  		});

	  		marker.info = new google.maps.InfoWindow({
					content: contentString
				});

				google.maps.event.addDomListener(marker, 'click', function() {
					marker.info.open(map,marker);
				});

		  	markers.push(marker);
				});
			}
		);
	};
});
