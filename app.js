L.mapbox.accessToken = 'pk.eyJ1IjoiZGViYWtlbCIsImEiOiJjaWthZGR6MGYwMDI3d2xsdmFveno2dzVqIn0._2PQT_7CyCFzi3Gfs5a_Zw';

// Create map
var map = L.mapbox.map('map', 'mapbox.streets')
        .setView([-4.471483378716517, -56.260213747794005], 7);
    
// Add controls
map.addControl(L.mapbox.infoControl());
map.addControl(L.control.locate());
map.addControl(L.control.scale());
map.addControl(L.control.measure({position: 'topleft'}));
map.removeControl(this.map.attributionControl);

// Add sidebar
var sidebar = L.control.sidebar('sidebar', {position: 'right'});
sidebar.addTo(map);
                
// Add & create Layers
var excavations = L.mapbox.featureLayer().loadURL('data/excavation_sites.json').addTo(map);
var findings = L.mapbox.featureLayer().loadURL('data/findings.json');
var findings_cluster = new L.MarkerClusterGroup();
findings_cluster.addLayer(findings);
findings_cluster.addTo(map);
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

var dists_amazonas = L.mapbox.featureLayer().loadURL('data/dist_ex_sites_river_amazon.json').addTo(map);    
var dists_ww = L.mapbox.featureLayer().loadURL('data/dist_ex_sites_river_ww.json').addTo(map);    
var dists_bw = L.mapbox.featureLayer().loadURL('data/dist_ex_sites_river_bw.json').addTo(map);    

// Group layers
var blackwater = L.layerGroup([black_lakes, black_water]);    
var whitewater = L.layerGroup([white_water, white_lakes]);    
var distances = L.layerGroup([dists_amazonas, dists_ww, dists_bw]);    

// Create Layer Control
var baseMaps = {};
var overlayMaps = {
  "Amazonas River": amazonas,
  "Tributaries of the Amazon River" : tributaries, 
  "Blackwater (rivers & lakes)": blackwater,
  "Whitewater (rivers & lakes)": whitewater,
  "Waterfalls": waterfalls,
  "Distances from rivers to sites": distances,
  "Excavation sites": excavations,
  "Findings": findings
};
L.control.layers(baseMaps, overlayMaps, {position: 'topleft'}).addTo(map);
