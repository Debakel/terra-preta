L.mapbox.accessToken = 'pk.eyJ1IjoiZGViYWtlbCIsImEiOiJjaWthZGR6MGYwMDI3d2xsdmFveno2dzVqIn0._2PQT_7CyCFzi3Gfs5a_Zw';
// Create map
var map = L.mapbox.map('map', 'mapbox.streets-satellite').setView([-4.471483378716517, -56.260213747794005], 7);
// Add controls
map.addControl(L.mapbox.infoControl());
map.addControl(L.control.locate());
map.addControl(L.control.scale());
map.addControl(L.control.measure({
    position: 'topleft'
}));
map.removeControl(this.map.attributionControl);

// Add sidebar
var sidebar = L.control.sidebar('sidebar', {
    position: 'right'
});
sidebar.addTo(map);

// Add excavation sites to map 
var excavations = L.mapbox.featureLayer().loadURL('data/excavation_sites_with_findings.json').addTo(map);

// Load findings
excavations.on('click', function(e) {
    // open sidebar and show finding details (Tradition, Kultur, Archäologe, Jahr)
    var details_content = '';
    $.each(e.layer.feature.findings, function(i, finding) {
        details_content += (finding.tradition_name.length > 0 ? '<p><strong>Tradition:</strong> ' + finding.tradition_name + '</p>' : '') + (finding.culture_name.length > 0 ? '<p><strong>Culture:</strong> ' + finding.culture_name + '</p>' : '') + (finding.archaeologist_name.length > 0 ? '<p><strong>Archaeologist / Year:</strong> ' + finding.archaeologist_name + '</p>' : '') + '<hr />';
    });
    var details_title = e.layer.feature.properties.excavation_site_name + ' (' + e.layer.feature.properties.excavation_site_id_pk + ')'
    $('#details-title').text(details_title);
    $('#details-content').html(details_content);
    sidebar.open('details');
});

// Add other layers to map
var amazonas = L.mapbox.featureLayer().loadURL('data/env_amazon.json');
var tributaries = L.mapbox.featureLayer().loadURL('data/env_tributaries.json');
var white_water = L.mapbox.featureLayer().loadURL('data/env_white_water.json');
var black_water = L.mapbox.featureLayer().loadURL('data/env_black_water.json');
var white_lakes = L.mapbox.featureLayer().loadURL('data/env_lake_white.json');
var black_lakes = L.mapbox.featureLayer().loadURL('data/env_lake_black.json');
var waterfalls = L.mapbox.featureLayer().loadURL('data/env_waterfalls.json');
waterfalls.on('layeradd', function(e) {
    e.layer.bindPopup('<b>Waterfall<b>');
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
    "Tributaries of the Amazon River": tributaries,
    "Blackwater (rivers & lakes)": blackwater,
    "Whitewater (rivers & lakes)": whitewater,
    "Waterfalls": waterfalls,
    "Distances from rivers to sites": distances,
    "Excavation sites": excavations // "Findings": findings
};
L.control.layers(baseMaps, overlayMaps, {
    position: 'topleft'
}).addTo(map);

/*
    Filtering of excavation sites by culture, tradition and archaeologist  ''' 
*/

var query = {

};

NoFilter = function(){return true;};
OrFilter = function(feature) {
    var match = false;
    $.each(feature.findings, function(i, finding) {
        if(query.cultures != null & ($.inArray(finding.culture_name, query.cultures) != -1)){
            match = true;
        }
        if(query.archaeologists != null & ($.inArray(finding.archaeologist_name, query.archaeologists) != -1)){
            match = true;
        }
        if(query.traditions != null & ($.inArray(finding.tradition_name, query.traditions) != -1)){
            match = true;
        }
    });
    return match;
};
AndFilter = function(feature) {
    var match = false;
    $.each(feature.findings, function(i, finding) {
        if(
            ((query.cultures == null) || ($.inArray(finding.culture_name, query.cultures) != -1)) & 
            ((query.archaeologists == null) || ($.inArray(finding.archaeologist_name, query.archaeologists) != -1)) &
            ((query.traditions == null) || ($.inArray(finding.tradition_name, query.traditions) !=-1)))
            {
                match = true;
            }
        
    });
    return match;
};

var cultures = [];
var archaeologists = [];
var traditions = [];
var findings = $.getJSON("data/findings.json");
findings.then(function(data){
   $.each(data.features, function(i, feature){ 
   if($.inArray(feature.properties.culture_name, cultures) == -1){
    cultures = cultures.concat(feature.properties.culture_name);
   } 
   if($.inArray(feature.properties.tradition_name, traditions) == -1){
    traditions = traditions.concat(feature.properties.tradition_name);
   } 
   if($.inArray(feature.properties.archaeologist_name, archaeologists) == -1){
    archaeologists = archaeologists.concat(feature.properties.archaeologist_name);
   } 
});

var traditions_choices = "";
$.each(traditions, function(i, t){
    traditions_choices += "<option>" + t + "</option>";
})

$('#select-tradition').html(traditions_choices);
$('#select-tradition').change(function(){
    query.traditions = $('#select-tradition').val()
    excavations.setFilter(AndFilter);
});
});
