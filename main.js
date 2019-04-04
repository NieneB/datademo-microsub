
// DEFINE RD NEW
var RDnew = new L.Proj.CRS('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs',
    {
        resolutions: [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210],
        bounds: L.bounds([-285401.920, 22598.08], [595401.9199999999, 903401.9199999999]),
        origin: [-285401.920, 22598.080]
    }
);


// INIT MAP
var map = L.map("map", {
    center: [52.07, 4.306],
    zoom: 6,
    crs: RDnew
    
});

var hash = new L.Hash(map);

var achtergrond = L.tileLayer('https://geodata.nationaalgeoregister.nl/tiles/service/tms/1.0.0/brtachtergrondkaartgrijs/EPSG:28992/{z}/{x}/{y}.png',{
    tms: true
}).addTo(map);


var panelConfig = {
    "baselayers": [
        {
            name: "Mediaan Inkomen (2015) CBS postcode 4",
            layer: {
                type: "tileLayer.wms",
                args: ["https://geodata.nationaalgeoregister.nl/cbspostcode4/ows?service=WMS", {
                    layers: 'postcode42015',
                    format: 'image/png',
                    transparent: true,
                    styles: 'cbs_pc4_mediaan_inkomen_huishouden',
                    opacity: 0.5
                }]
            }
        },
        {
            name: "Percentage huurwoningen (2015) CBS postcode 4",
            layer: {
                type: "tileLayer.wms",
                args: ["https://geodata.nationaalgeoregister.nl/cbspostcode4/ows?service=WMS", {
                    layers: 'postcode42015',
                    format: 'image/png',
                    transparent: true,
                    styles: 'cbs_pc4_perc_huurwon',
                    opacity:0.5
                }]
            }
        },
        {
            name: "Gebouw type, WTA Zuid-Holland (2016?)",
            layer: {
                type: "tileLayer.wms",
                args: ["https://geoservices.zuid-holland.nl/arcgis/services/Bodem/Bodem_wta/MapServer/WmsServer?", {
                    layers: 'WTA Gebouwtype',
                    format: 'image/png',
                    transparent: true,
                    styles: 'default'
                }]
            }
        },
        {
            name: "Gebouw bouwjaar, WTA Zuid-Holland (2016?)",
            layer: {
                type: "tileLayer.wms",
                args: ["https://geoservices.zuid-holland.nl/arcgis/services/Bodem/Bodem_wta/MapServer/WmsServer?", {
                    layers: 'WTA Bouwjaar',
                    format: 'image/png',
                    transparent: true,
                    styles: 'default'
                }
                ]
            }
        },
        {
            name: "Aantal personen met WW uitkering - Buurten CBS (2017) ",
            layer: {
                type: "tileLayer.wms",
                args: ["https://geodata.nationaalgeoregister.nl/wijkenbuurten2017/wms?", {
                    layers: 'cbs_buurten_2017',
                    format: 'image/png',
                    transparent: true,
                    opacity:0.5,
                    styles: 'wijkenbuurten2017:buurt_aantal_personen_met_WW_uitkering_totaal'
                }
                ]
            }
        },
    ]
};

var panelLayers = new L.Control.PanelLayers( panelConfig.baselayers,null,{
    title: "Lagen",
    position: 'topright',
    compact: false,
    collapsed: false,
    autoZIndex: true,
    className:"layerpanel"
});

map.addControl(panelLayers);

let legend = L.wmsLegend();
// Add legend per panel layer selected
panelLayers.on('panel:selected', function(panel){
    legend.remove();
    let url = panel.layer._url;
    url += "&request=GetLegendGraphic&version=1.3.0&format=image/png"
    url += "&width=40&height=40"
    url += "&layer=" + panel.layer.wmsParams.layers ;
    url += "&style=" + panel.layer.wmsParams.styles ;
    legend = L.wmsLegend(url);
    console.log(legend);

});

// Add legend per panel layer selected
panelLayers.on('panel:unselected', function (panel) {
    legend.remove();
});


map.on('click',function(e){

    //do feature request
    featureRequest(e.LatLng)
    //show pop-up with info

    L.popup({ maxWidth: 800 })
        .setLatLng(latlng)
        .setContent(content)
        .openOn(this._map);
});

const featureRequest = function(location,layer){
    var point = this._map.latLngToContainerPoint(location, this._map.getZoom()),
        size = this._map.getSize(),

        params = {
            request: 'GetFeatureInfo',
            service: 'WMS',
            srs: 'EPSG:4326',
            styles: this.wmsParams.styles,
            transparent: this.wmsParams.transparent,
            version: this.wmsParams.version,
            format: this.wmsParams.format,
            bbox: this._map.getBounds().toBBoxString(),
            height: size.y,
            width: size.x,
            layers: this.wmsParams.layers,
            query_layers: this.wmsParams.layers,
            info_format: 'text/html'
        };

};