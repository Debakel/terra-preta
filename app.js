// Set access token for mapbox tile service
L.mapbox.accessToken = 'pk.eyJ1IjoiZGViYWtlbCIsImEiOiJjaWthZGR6MGYwMDI3d2xsdmFveno2dzVqIn0._2PQT_7CyCFzi3Gfs5a_Zw';
// Create base map
var map = L.mapbox.map('map', 'mapbox.streets-satellite').setView([-4.471483378716517, -56.260213747794005], 7);
// Add controls to base map
map.addControl(L.mapbox.infoControl());
map.addControl(L.control.locate());
map.addControl(L.control.scale());
map.addControl(L.control.measure({
    position: 'topleft'
}));
map.removeControl(this.map.attributionControl);
// Add sidebar to base map
var sidebar = L.control.sidebar('sidebar', {
    position: 'right'
});
sidebar.addTo(map);
// Create excavation layer
var excavations = L.mapbox.featureLayer(null , {
    pointToLayer: function(f, latlng) {
        return L.marker(latlng, {
            icon: L.mapbox.marker.icon({
                'marker-size': 'small',
                'marker-symbol': 'campsite',
                'marker-color': '#F74558'
            })
        });
    }
});
// Create cluster layer for excavation sites
var excavations_cluster = new L.MarkerClusterGroup({
    showCoverageOnHover: false
}).addTo(map);
function updateCluster() {
    excavations_cluster.clearLayers();
    excavations.eachLayer(function(layer) {
        excavations_cluster.addLayer(layer);
    });
}
// Load excavation sites and and to cluster layer
excavations.loadURL('data/excavation_sites_with_findings.json').on('ready', function(e) {
    updateCluster();
});
// Set excavation sites onClickListener
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
// Create environment layers (not added to map yet)
var amazonas = L.mapbox.featureLayer().loadURL('data/env_amazon.json').on('ready', function() {
    amazonas.setStyle({
        color: 'blue',
        weight: 3,
        opacity: 0.7
    });
});
var tributaries = L.mapbox.featureLayer().loadURL('data/env_tributaries.json').on('ready', function() {
    tributaries.setStyle({
        color: 'blue',
        weight: 0.7,
        opacity: 0.8
    });
});
var white_water = L.mapbox.featureLayer().loadURL('data/env_white_water.json').on('ready', function() {
    white_water.setStyle({
        color: 'white',
        weight: 1,
        opacity: 0.5
    });
});
var black_water = L.mapbox.featureLayer().loadURL('data/env_black_water.json').on('ready', function() {
    black_water.setStyle({
        color: 'black',
        weight: 1,
        opacity: 0.8
    });
});
var white_lakes = L.mapbox.featureLayer().loadURL('data/env_lake_white.json').on('ready', function() {
    white_lakes.setStyle({
        color: 'white',
        weight: 1,
        opacity: 0.5
    });
});
var black_lakes = L.mapbox.featureLayer().loadURL('data/env_lake_black.json').on('ready', function() {
    black_lakes.setStyle({
        color: 'black',
        weight: 1,
        opacity: 0.8
    });
});
var waterfalls = L.mapbox.featureLayer(null , {
    pointToLayer: function(f, latlng) {
        return L.marker(latlng, {
            icon: L.mapbox.marker.icon({
                'marker-size': 'small',
                'marker-symbol': 'water',
                'marker-color': '#3bb2d0'
            })
        });
    }
}).loadURL('data/env_waterfalls.json').on('layeradd', function(e) {
    e.layer.bindPopup('<b>Waterfall<b>');
});
// Create distance layers
var distance_style = {
    color: 'white',
    weight: 0.05
};
var dists_amazonas = L.mapbox.featureLayer().loadURL('data/dist_ex_sites_river_amazon.json').on('ready', function() {
    dists_amazonas.setStyle(distance_style);
});
var dists_ww = L.mapbox.featureLayer().loadURL('data/dist_ex_sites_river_ww.json').on('ready', function() {
    dists_ww.setStyle(distance_style);
});
var dists_bw = L.mapbox.featureLayer().loadURL('data/dist_ex_sites_river_bw.json').on('ready', function() {
    dists_bw.setStyle(distance_style);
});

// Setup Filtering of excavation sites by culture, tradition and archaeologist 
var query = {
    cultures: [],
    traditions: [],
    archaeologists: []
};
function AndFilter(feature) {
    // Returns true if at least one finding matches the criteria given in $query
    var match = false;
    $.each(feature.findings, function(i, finding) {
        if (((query.cultures == null ) || (query.cultures.length == 0) || ($.inArray(finding.culture_name, query.cultures) != -1)) & ((query.archaeologists == null ) || (query.archaeologists.length == 0) || ($.inArray(finding.archaeologist_name, query.archaeologists) != -1)) & ((query.traditions == null ) || (query.traditions.length == 0) || ($.inArray(finding.tradition_name, query.traditions) != -1))) {
            match = true;
        }
    });
    return match;
}
;// Load findings data and create lists with all cultures, archaeologists and traditions
// With the lists, populate the select boxes
var cultures = [];
var archaeologists = [];
var traditions = [];
// Load data
var findings = $.getJSON("data/findings.json");
findings.then(function(data) {
    // Create lists with all cultures, archaeologists and traditions 
    $.each(data.features, function(i, feature) {
        if ($.inArray(feature.properties.culture_name, cultures) == -1) {
            cultures = cultures.concat(feature.properties.culture_name);
        }
        if ($.inArray(feature.properties.tradition_name, traditions) == -1) {
            traditions = traditions.concat(feature.properties.tradition_name);
        }
        if ($.inArray(feature.properties.archaeologist_name, archaeologists) == -1) {
            archaeologists = archaeologists.concat(feature.properties.archaeologist_name);
        }
    });
    // Bind data to select boxes
    var traditions_choices = "";
    $.each(traditions, function(i, t) {
        traditions_choices += "<option>" + t + "</option>";
    });
    var culture_choices = "";
    $.each(cultures, function(i, t) {
        culture_choices += "<option>" + t + "</option>";
    });
    var archaeologist_choices = "";
    $.each(archaeologists, function(i, t) {
        archaeologist_choices += "<option>" + t + "</option>";
    });
    // Re-Filter items when selection changes
    $('#select-tradition').html(traditions_choices).select2();
    $('#select-tradition').change(function() {
        query.traditions = $('#select-tradition').val();
        applyFilter();
    });
    $('#select-culture').html(culture_choices).select2();
    $('#select-culture').change(function() {
        query.cultures = $('#select-culture').val();
        applyFilter();
    });
    $('#select-archaeologist').html(archaeologist_choices).select2();
    $('#select-archaeologist').change(function() {
        query.archaeologists = $('#select-archaeologist').val();
        applyFilter();
    });
});

function applyFilter(){
        excavations.setFilter(AndFilter);
        updateCluster();
        updateHeatmap(); // re-create heatmap with filtered items only; 
};

// Create heatmap for excavation sites
var cfg = {
    "radius": 0.9,
    "maxOpacity": .8,
    "scaleRadius": true,
    "useLocalExtrema": true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'value'
};
var heatmap = new HeatmapOverlay(cfg).addTo(map);
excavations.on('ready', updateHeatmap);
function updateHeatmap() {
    var points = [];
    excavations.eachLayer(function(layer) {
        var coords = layer.getLatLng();
        var point = {
            lat: coords.lat,
            lng: coords.lng,
            value: layer.feature.findings.length
        };
        points.push(point);
    });
    var data = {
        max: 14, //maximal amount of findings per excavation site
        data: points
    }
    heatmap.setData(data);
};


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
    "Excavation sites": excavations_cluster,
    "Heatmap": heatmap
};
L.control.layers(baseMaps, overlayMaps, {
    position: 'topleft'
}).addTo(map);