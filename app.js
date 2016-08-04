L.mapbox.accessToken = 'pk.eyJ1IjoiZGViYWtlbCIsImEiOiJjaWthZGR6MGYwMDI3d2xsdmFveno2dzVqIn0._2PQT_7CyCFzi3Gfs5a_Zw';

// Create map
var map = L.mapbox.map('map', 'mapbox.streets')
        .setView([-4.471483378716517, -56.260213747794005], 7);
    
// Add controls
map.addControl(L.mapbox.infoControl());
map.addControl(L.control.locate());
map.addControl(L.control.scale());
map.removeControl(this.map.attributionControl);

// Add sidebar
var sidebar = L.control.sidebar('sidebar', {position: 'right'});
sidebar.addTo(map);
                
// Add & create Layers
var amazonas = L.mapbox.featureLayer().loadURL('data/env_amazon.json').addTo(map);
var tributaries = L.mapbox.featureLayer().loadURL('data/env_tributaries.json').addTo(map);    
var white_water = L.mapbox.featureLayer().loadURL('data/env_white_water.json').addTo(map);
var black_water = L.mapbox.featureLayer().loadURL('data/env_black_water.json').addTo(map);    
var white_lakes = L.mapbox.featureLayer().loadURL('data/env_lake_white.json').addTo(map);    
var black_lakes = L.mapbox.featureLayer().loadURL('data/env_lake_black.json').addTo(map);    
var waterfalls = L.mapbox.featureLayer().loadURL('data/env_waterfalls.json');
waterfalls.on('layeradd', function(e){
   e.layer.bindPopup('<b>Waterfall<b><br>' + e.layer.properties); 
});
waterfalls.addTo(map); 

// Group layers
var blackwater = L.layerGroup([black_lakes, black_water]);    
var whitewater = L.layerGroup([white_water, white_lakes]);    

// Create Layer Control
var baseMaps = {};
var overlayMaps = {
  "Amazonas River": amazonas,
  "Tributaries of the Amazon River" : tributaries, 
  "Blackwater (rivers & lakes)": blackwater,
  "Whitewater (rivers & lakes)": whitewater,
  "Waterfalls": waterfalls  
};
L.control.layers(baseMaps, overlayMaps, {position: 'topleft'}).addTo(map);
