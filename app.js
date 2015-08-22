var map;
function onload(){
	L.mapbox.accessToken = 'pk.eyJ1IjoiZGViYWtlbCIsImEiOiJjMWVJWEdFIn0.WtaUd8Rh0rgHRiyEZNzSjQ';
	loadMap();
	JSONload();
}
function loadMap(){
		map = L.map('map').setView([51.505, -0.09], 13);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
			maxZoom: 18,
			id: 'debakel.in6i4ino',
			accessToken: 'pk.eyJ1IjoiZGViYWtlbCIsImEiOiJjMWVJWEdFIn0.WtaUd8Rh0rgHRiyEZNzSjQ'
		}).addTo(map);
		
		L.control.locate().addTo(map);
		var sidebar = L.control.sidebar('sidebar').addTo(map);
}
function JSONload(){
	var featureLayer = L.mapbox.featureLayer()
    .loadURL('top100.geojson')
    .addTo(map);
}

window.onload = onload();   
