L.mapbox.accessToken = 'pk.eyJ1IjoiZGViYWtlbCIsImEiOiJjaWthZGR6MGYwMDI3d2xsdmFveno2dzVqIn0._2PQT_7CyCFzi3Gfs5a_Zw';

// Create map
var map = L.mapbox.map('map', 'mapbox.streets-satellite')
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
//var findings = L.mapbox.featureLayer().loadURL('data/findings.json');
var findings = $.getJSON("data/findings.json");
excavations.on('click', function(e) {
  // open sidebar and show finding details (Tradition, Kultur, Archäologe, Jahr)
  var id = e.layer.feature.properties.excavation_site_id_pk;
  var filtered_findings = $.grep(findings.responseJSON.features, function (finding, i) {
    return finding.properties.excavation_site_id_pk == id;
  });
  var details_content = '';
  $.each(filtered_findings, function(i, finding) {
    var details = finding.properties;
    details_content += 
      (details.tradition_name.length > 0 ? '<p><strong>Tradition:</strong> ' + details.tradition_name + '</p>' : '') +
      (details.culture_name.length > 0 ? '<p><strong>Culture:</strong> ' + details.culture_name + '</p>' : '') +
      (details.archaeologist_name.length > 0 ? '<p><strong>Archaeologist / Year:</strong> ' + details.archaeologist_name + '</p>' : '') +
      '<hr />'
    ;
  });
  $('#details-title').text(e.layer.feature.properties.excavation_site_name);
  $('#details-content').html(
    details_content
  );
  sidebar.open('details');
});

var amazonas = L.mapbox.featureLayer().loadURL('data/env_amazon.json');
var tributaries = L.mapbox.featureLayer().loadURL('data/env_tributaries.json');    
var white_water = L.mapbox.featureLayer().loadURL('data/env_white_water.json');
var black_water = L.mapbox.featureLayer().loadURL('data/env_black_water.json');    
var white_lakes = L.mapbox.featureLayer().loadURL('data/env_lake_white.json');    
var black_lakes = L.mapbox.featureLayer().loadURL('data/env_lake_black.json');    
var waterfalls = L.mapbox.featureLayer().loadURL('data/env_waterfalls.json');
waterfalls.on('layeradd', function(e){
   e.layer.bindPopup('<b>Waterfall<b><br>' + e.layer.properties); 
});

var dists_amazonas = L.mapbox.featureLayer().loadURL('data/dist_ex_sites_river_amazon.json');    
var dists_ww = L.mapbox.featureLayer().loadURL('data/dist_ex_sites_river_ww.json');    
var dists_bw = L.mapbox.featureLayer().loadURL('data/dist_ex_sites_river_bw.json');    

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
  "Excavation sites": excavations
  // "Findings": findings
};
L.control.layers(baseMaps, overlayMaps, {position: 'topleft'}).addTo(map);
