import Map from 'ol/Map.js';
import View from 'ol/View.js';
//import Popup from '../ol-popup/ol-popup.js';
import olExt from '../ol-ext/dist/ol-ext.js';

export default class OplMap {

    constructor(id, lat, lng, zoom) {
        
        //this.areaSource;
        //this.areaVectorLayer = this.createAreaVectorLayer();

        this.features = [];

        this.pulsateMarkerStyle;

        this.measuringTool;   
        this.removeMeasuringId
        this.popupOverlay;
        this.layers;
        this.vectorSource;
        this.vectorLayer;        
        this.interaction;        
        this.mainbar = new ol.control.Bar({ toggleOne: true, group: true });
                
        this.map;
        this.view;
        this.defaultMapId = id;
        this.defaultLat = lat;
        this.defaultLng = lng;
        this.defaultZoom = zoom;  
        this.createBaseLayer(id, lat, lng, zoom);     
    }

    goToCoord(x, y, zoom) {
        var point = new ol.geom.Point([x, y]).getCoordinates();
        var view = this.map.getView();
        if (zoom != undefined) view.setZoom(zoom);
        view.animate({
            center: point,
            duration: 2000
        });
    }

    setMapCenter(long, lat, zoom) {
        console.log("Long: " + long + " Lat: " + lat);
        this.map.getView().setCenter(ol.proj.transform([long, lat], 'EPSG:4326', 'EPSG:3857'));
        this.map.getView().setZoom(zoom);
    }

    showLayer(layerName) {
        layerName.setVisibility(true);
    }

    hideLayer(layerName) {
        layerName.setVisibility(false);
    }

    toggleLayer(layerName) {
        if (layerName.getVisibility() == true) {
            layerName.setVisibility(false);
        } else {
            layerName.setVisibility(true);
        }
    }

    measurementStyleFunc(feature) {

        var geometry = feature.getGeometry();
        var styles = [
            // linestring style
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#ff0000',
                    width: 2
                })
            })
        ];

        function segmentText(coord, coord2) {
            const coord_t = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
            let coordText = coord_t[1].toFixed(0) + '/' + coord_t[0].toFixed(0);

            if (coord2) {
                const length = ol.sphere.getLength(new ol.geom.LineString([coord2, coord]));
                //const distance = (Math.round(length / 1000 * 100) / 100) + ' km';
                let distance = 0;
                if (length > 100) {
                    distance = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
                } else {
                    distance = (Math.round(length * 100) / 100) + ' ' + 'm';
                }
                coordText = coordText + '\n' + distance;
            } else {
                coordText = coordText + '\n0';
            }

            return new ol.style.Text({
                text: coordText,
                fill: new ol.style.Fill({
                    color: "#00f"
                }),
                offsetY: 25,
                align: 'center',
                scale: 1,
            });
        }

        function createSegmentStyle(coord, coord2, rotation) {            
            return new ol.style.Style({
                geometry: new ol.geom.Point(coord),
                image: new ol.style.Icon({
                    src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAADCAIAAADdv/LVAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBhXY1Da6MPEwMDAxMDAAAALMAEkQYjH8gAAAABJRU5ErkJggg==',
                    anchor: [0.75, 0.5],
                    rotateWithView: true,
                    rotation: -rotation,
                    scale: 4
                }),
                text: segmentText(coord, coord2)
            })
        };

        const firstCoord = geometry.getFirstCoordinate();
        geometry.forEachSegment(function (start, end) {            
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            if (firstCoord[0] === start[0] && firstCoord[1] === start[1]) {
                styles.push(createSegmentStyle(start, null, rotation));
            }

            styles.push(createSegmentStyle(end, firstCoord, rotation));
        });

        return styles;
    }

    //iconStyle() {
    //    var iconStyle = new ol.style.Style({
    //        image: new ol.style.Icon({
    //            anchor: [0.5, 46],
    //            anchorXUnits: 'fraction',
    //            anchorYUnits: 'pixels',
    //            src: 'data/icon.png'
    //        })
    //    });
    //    return iconStyle;
    //}

    //createAreaVectorLayer() {
    //    var features = new ol.Collection();
    //    this.areaSource = new ol.source.Vector({
    //        features: features
    //    });

    //    var areaVectorLayer = new ol.layer.Vector({
    //        source: this.areaSource,
    //        style: new ol.style.Style({
    //            fill: new ol.style.Fill({
    //                color: 'rgba(255, 167, 66, 0.4)'
    //            }),
    //            stroke: new ol.style.Stroke({
    //                color: '#ff7733',
    //                width: 2
    //            }),
    //            image: new ol.style.Circle({
    //                radius: 7,
    //                fill: new ol.style.Fill({
    //                    color: '#ff7733'
    //                })
    //            })
    //        })
    //    });

    //    return areaVectorLayer;
    //}

    // Style
    getStyle(feature) {
        return [new ol.style.Style({
            image: new ol.style.RegularShape({
                fill: new ol.style.Fill({ color: [0, 0, 255, 0.4] }),
                stroke: new ol.style.Stroke({ color: [0, 0, 255, 1], width: 1 }),
                radius: 10,
                points: 3,
                angle: feature.get('angle') || 0
            }),
            fill: new ol.style.Fill({ color: [0, 0, 255, 0.4] }),
            stroke: new ol.style.Stroke({ color: [0, 0, 255, 1], width: 1 })
        })];
    }

    createBaseLayer(id, lat, lng, zoom) { 
        
        this.vectorSource = new ol.source.Vector({ wrapX: false });
        this.vectorLayer = new ol.layer.Vector({
            name: '',
            source: this.vectorSource,
            //style: this.getStyle
            style: function (f) {
                return new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({ width: 1.5, color: [255, 128, 0] }),
                        fill: new ol.style.Fill({ color: [255, 128, 0, .3] })
                    }),
                    stroke: new ol.style.Stroke({ width: 1.5, color: f.get('color') || [255, 128, 0] }),
                    fill: new ol.style.Fill({ color: (f.get('color') || [255, 128, 0]).concat([.3]) })
                })
            }
        });

        // Layers
        this.layers = [
            new ol.layer.Tile({
                name: "Thailand",
                //minResolution: 306,
                source: new ol.source.OSM()
            }),
            this.vectorLayer
            //,this.areaVectorLayer
        ]          

        // Popup overlay
        this.popupOverlay = new ol.Overlay.Popup(
        {
            popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
            closeBox: true,
            //onshow: function () { console.log("You opened the box"); },
            //onclose: function () { console.log("You close the box"); },
            positioning: 'auto', // auto, bottom-auto, bottom-left, bottom-center, bottom-right, top-auto, top-left, top-center, top-right, center-auto, center-left, center-right, center-center
            autoPan: true,
            autoPanAnimation: { duration: 250 }
        });

        // View
        this.view = new ol.View({
            center: ol.proj.fromLonLat([lng, lat]),
            zoom: zoom
        });

        // The map
        this.map = new ol.Map({
            target: id,
            layers: this.layers,
            overlays: [this.popupOverlay],
            view: this.view,
            controls: ol.control.defaults({ "attribution": false })
        });     

        //
        this.pulsateMarkerStyle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: "#fff"
                }),
                stroke: new ol.style.Stroke({
                    color: "blue",
                    width: 2
                }),
            }),
            zIndex: 100
        });

        this.map.addControl(this.mainbar);
    }

    fineLayerByName(name) {
        var layerObj;
        this.map.getLayers().forEach(function (layer) {
            //console.log(layer.get('name'));
            if (layer.get('name') != undefined && layer.get('name') === name) {
                layerObj = layer;
                return;
            }
        });
        return layerObj;
    }

    addMarker(lat, lng, markerId, markerStyle) {
        var markerFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat]))
        });
        if (markerId != "") { markerFeature.setId(markerId); }
        if (markerStyle == "") {
            var selfMarkerStyle = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: "#fff"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "blue",
                        width: 2
                    }),
                }),
                zIndex: 100
            });
            markerFeature.setStyle(selfMarkerStyle);
        } else {
            markerFeature.setStyle(markerStyle);
        }
        this.vectorLayer.getSource().addFeature(markerFeature);
        return markerFeature;
    }

    createScaleControl() {
        // Scale control
        var ctrl = new ol.control.Scale({});
        this.map.addControl(ctrl);
        this.map.addControl(new ol.control.ScaleLine());
    }

    createInteraction() {
        var _map = this.map;

        // Set cursor style
        ol.interaction.Transform.prototype.Cursors['rotate'] = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXAgMAAACdRDwzAAAAAXNSR0IArs4c6QAAAAlQTFRF////////AAAAjvTD7AAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2wwSEgUFmXJDjQAAAEZJREFUCNdjYMAOuCCk6goQpbp0GpRSAFKcqdNmQKgIILUoNAxIMUWFhoKosNDQBKDgVAilCqcaQBogFFNoGNjsqSgUTgAAM3ES8k912EAAAAAASUVORK5CYII=\') 5 5, auto';
        ol.interaction.Transform.prototype.Cursors['rotate0'] = 'url(\'data:image/png;base64,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\') 5 5, auto';

        this.interaction = new ol.interaction.Transform({
            addCondition: ol.events.condition.shiftKeyOnly,
            // filter: function(f,l) { return f.getGeometry().getType()==='Polygon'; },
            // layers: [vector],
            hitTolerance: 2,
            translateFeature: false,
            scale: true,
            rotate: true,
            //keepAspectRatio: undefined,
            translate: true,
            stretch: true
        });

        this.map.addInteraction(this.interaction);

        // Add a snap
        //_map.addInteraction(new ol.interaction.Snap({
        //    source: this.vectorLayer.getSource()
        //}));

        // Events handlers
        var startangle = 0;
        var d = [0, 0];

        // Handle rotate on first point
        var firstPoint = false;
        this.interaction.on(['select'], function (e) {
            if (firstPoint && e.features && e.features.length) {
                interaction.setCenter(e.features[0].getGeometry().getFirstCoordinate());                
            }
        });

        this.interaction.on(['rotatestart', 'translatestart'], function (e) {
            // Rotation
            startangle = e.feature.get('angle') || 0;
            // Translation
            d = [0, 0];
        });
        this.interaction.on('rotating', function (e) {
            $('#info').text("rotate: " + ((e.angle * 180 / Math.PI - 180) % 360 + 180).toFixed(2));
            // Set angle attribute to be used on style !
            e.feature.set('angle', startangle - e.angle);
        });
        this.interaction.on('translating', function (e) {
            d[0] += e.delta[0];
            d[1] += e.delta[1];
            //$('#info').text("translate: " + d[0].toFixed(2) + "," + d[1].toFixed(2));
            $('#info').text("translate: " + d[0] + "," + d[1]);            
        });
        this.interaction.on('scaling', function (e) {
            //$('#info').text("scale: " + e.scale[0].toFixed(2) + "," + e.scale[1].toFixed(2));
            $('#info').text("scale: " + e.scale[0] + "," + e.scale[1]);
        });
        this.interaction.on(['rotateend', 'translateend', 'scaleend'], function (e) {
            $('#info').text("");
        });
    }

    createControlBar(setting) {
        var _self = this;
        var _map = this.map;

        var SelectSetting = false;
        var DeleteSetting = false;
        var InfoSetting = false;
        var DrawPointSetting = false;
        var DrawLineSetting = false;
        var DrawPolygonSetting = false;
        var DrawHoleSetting = false;
        var DrawRegularSetting = false;
        var TransformSetting = false;
        var SplitSetting = false;
        var FillColorSetting = false;
        var UndoSetting = false;
        var ClearMeasuringSetting = false;
        var OffsetSetting = false;

        for (let ele of setting) {
            if (ele == 'Select') {
                SelectSetting = true;
            } else if (ele == 'Delete') {
                DeleteSetting = true;
            } else if (ele == 'Info') {
                InfoSetting = true;
            } else if (ele == 'DrawPoint') {
                DrawPointSetting = true;
            } else if (ele == 'DrawLine') {
                DrawLineSetting = true;
            } else if (ele == 'DrawPolygon') {
                DrawPolygonSetting = true;
            } else if (ele == 'DrawHole') {
                DrawHoleSetting = true;
            } else if (ele == 'DrawRegular') {
                DrawRegularSetting = true;
            } else if (ele == 'Transform') {
                TransformSetting = true;
            } else if (ele == 'Split') {
                SplitSetting = true;
            } else if (ele == 'FillColor') {
                FillColorSetting = true;
            } else if (ele == 'Undo') {
                UndoSetting = true;
            } else if (ele == 'ClearMeasuring') {
                ClearMeasuringSetting = true;
            } else if (ele == 'Offset') {
                OffsetSetting = true;
            }   
        } 

        // Main control bar
        //this.mainbar = new ol.control.Bar();
        _map.addControl(this.mainbar);

        // Editbar
        var editbar = new ol.control.EditBar({
            source: this.vectorLayer.getSource(),
            interactions: {  
                Select: SelectSetting,
                Delete: DeleteSetting,
                Info: InfoSetting,
                DrawPoint: DrawPointSetting,
                DrawLine: DrawLineSetting,
                DrawPolygon: DrawPolygonSetting,
                DrawHole: DrawHoleSetting,
                DrawRegular:DrawRegularSetting,
                Transform: TransformSetting,
                Split: SplitSetting,
                Offset: OffsetSetting
            }
        });
        this.mainbar.addControl(editbar);

        // Set Position
        // top, top-left, left, bottom-left, bottom, bottom-right, right, top-right
        this.mainbar.setPosition('top');

        /* Standard Controls */
        //this.mainbar.addControl(new ol.control.ZoomToExtent({ extent: [265971, 6243397, 273148, 6250665] }));
        //this.mainbar.addControl(new ol.control.Rotate());
        //this.mainbar.addControl(new ol.control.FullScreen());

        if (FillColorSetting == true) {
            // Add a fill interaction toset color attribute
            var fill = new ol.interaction.FillAttribute({}, { color: [255, 0, 0] });
            editbar.addControl(new ol.control.Toggle({
                html: '<i class="fa fa-paint-brush"></i>',
                title: 'fill color attribut',
                interaction: fill,
                bar: new ol.control.Bar({
                    controls: [
                        new ol.control.Button({
                            className: 'red',
                            handleClick: function () {
                                fill.setAttribute('color', [255, 0, 0])
                            }
                        }),
                        new ol.control.Button({
                            className: 'green',
                            handleClick: function () {
                                fill.setAttribute('color', [0, 255, 0])
                            }
                        }),
                        new ol.control.Button({
                            className: 'blue',
                            handleClick: function () {
                                fill.setAttribute('color', [0, 0, 255])
                            }
                        })
                    ]
                })
            }));

        }

        if (UndoSetting == true) {
            // Undo redo interaction
            var undoInteraction = new ol.interaction.UndoRedo();
            _map.addInteraction(undoInteraction);
            // Prevent selection of a deleted feature
            undoInteraction.on('undo', function (e) {
                if (e.action.type === 'addfeature') {
                    editbar.getInteraction('Select').getFeatures().clear();
                    editbar.getInteraction('Transform').select();
                }
            });

            // Add buttons to the bar
            var bar = new ol.control.Bar({
                group: true,
                controls: [
                    new ol.control.Button({
                        html: '<i class="fa fa-undo" ></i>',
                        title: 'undo...',
                        handleClick: function () {
                            undoInteraction.undo();
                        }
                    }),
                    new ol.control.Button({
                        html: '<i class="fa fa-repeat" ></i>',
                        title: 'redo...',
                        handleClick: function () {
                            undoInteraction.redo();
                        }
                    })
                ]
            });
            this.mainbar.addControl(bar);
        }

        if (ClearMeasuringSetting == true) {
            // Clear Measuring
            var clearMeasuring = new ol.control.Button(
                {
                    html: '<i class="fa fa-refresh"></i>',
                    title: "Clear Measuring",
                    handleClick: function (e) {
                        //console.log(_self.removeMeasuringId);
                        $("#" + _self.removeMeasuringId).trigger('click');
                    }
                });
            this.mainbar.addControl(clearMeasuring);
        }

    }

    createGridReference(coordinatesObj, sizeX, sizeY) {

        //var jsonData = [{
        //                lat: 14.070728,
        //                lng: 101.823832
        //            },
        //            {
        //                lat: 14.069471,
        //                lng: 101.824397
        //            }
        //]

        // Set the control grid reference
        var ref;
        var ringPicingArea = [];
        for (var i = 0; i < coordinatesObj.length; i++) {
            //var point = ol.proj.fromLonLat([coordinatesObj[i].lng, coordinatesObj[i].lat]);
            //console.log(point);
            var point = ol.proj.transform([coordinatesObj[i].lng, coordinatesObj[i].lat], "EPSG:4326", "EPSG:3857");
            ringPicingArea.push(point[0]);
            ringPicingArea.push(point[1]);
        }

        ref = new ol.control.GridReference(
            {
                //extent: [11334981.80427845, 1582330.6309750807, 11335035.905550973, 1582198.883627016],
                extent: ringPicingArea,
                size: [sizeX, sizeY],
                target: "",
                //source: this.vectorLayer,
                property: "commune",
                sortFeatures: "",
                indexTitle: ""
            });
        this.map.addControl(ref);

        return ref;
    }

    /*
    contextmenuItems() {
        var _self = this;
        var _map= this.map;

        //var pinIcon = 'https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/pin_drop.png';
        //var centerIcon = 'https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/center.png';
        //var listIcon = 'https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/view_list.png';

        var contextmenuItems = [
            {
                text: 'Select Tag',
                classname: 'some-style-class', // add some CSS rules
                callback: function (f) {
                    console.log('Test...');
                }
            },
            {
                text: 'Measuring',
                icon: '',
                items: [
                    {
                        text: 'Line', // Length (Line String)
                        icon: '',
                        callback: function (f) {
                            _self.enableMeasuringTool('length', 'btResetId', false);
                        }
                    },
                    {
                        text: 'Line/Snap Guide',
                        icon: '',
                        callback: function (f) {
                            _self.enableMeasuringTool('length', 'btResetId', true);
                        }
                    },
                    {
                        text: 'Polygon', // Area (Polygon)
                        icon: '',
                        callback: function (f) {
                            _self.enableMeasuringTool('area', 'btResetId', false);
                        }
                    },
                    {
                        text: 'Polygon/Snap Guide',
                        icon: '',
                        callback: function (f) {
                            _self.enableMeasuringTool('area', 'btResetId', true);
                        }
                    }

                ]
            },
            '-' // this is a separator
        ];

        var contextmenu = new ContextMenu({
            width: 180,
            items: contextmenuItems
        });
        this.map.addControl(contextmenu);

        var removeMarkerItem = {
            text: 'Remove this Marker',
            classname: 'marker',
            //callback: removeMarker
        };

        contextmenu.on('open', function (evt) {
            var feature = _map.forEachFeatureAtPixel(evt.pixel, ft => ft);

            if (feature && feature.get('type') === 'removable') {
                contextmenu.clear();
                removeMarkerItem.data = { marker: feature };
                contextmenu.push(removeMarkerItem);
            } else {
                contextmenu.clear();
                contextmenu.extend(contextmenuItems);
                contextmenu.extend(contextmenu.getDefaultItems());
            }
        });

        this.map.on('pointermove', function (e) {
            if (e.dragging) return;

            var pixel = _map.getEventPixel(e.originalEvent);
            var hit = _map.hasFeatureAtPixel(pixel);

            _map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        });
    }
    */












    
    renderGeoJSonLayer(webServiceUrl, imageUrl, showEventClickOrHover) {
        // GeoJSON layer
        var vectorSource = new ol.source.Vector(
        {
            url: webServiceUrl,
            projection: 'EPSG:3857',
            format: new ol.format.GeoJSON(),
            attributions: [],
            logo: ""
        });

        if (imageUrl !== "") {
            this.map.addLayer(new ol.layer.Vector(
            {
                name: '',
                source: vectorSource,
                style: new ol.style.Style({ image: new ol.style.Icon({ src: imageUrl, scale: 0.8 }) })
            }));
        } else {
            this.map.addLayer(new ol.layer.Vector(
            {
                name: '',
                source: vectorSource
            }));
        }

        // Control Select 
        let select = new ol.interaction.Select({});
        this.map.addInteraction(select);

        var oplMapObj = this;

        if (showEventClickOrHover === 'Hover') {
            // On hover => show/hide popup
            var hover = new ol.interaction.Hover();
            this.map.addInteraction(hover);
            hover.on('leave', function (e) {
                oplMapObj.popupOverlay.hide();
            });
            hover.on('hover', function (e) {
                let content = "";
                if (typeof e.feature.get("text") !== "undefined") {
                    content += "<img src='" + e.feature.get("img") + "'/>";
                    content += e.feature.get("text");
                    oplMapObj.popupOverlay.show(e.feature.getGeometry().getFirstCoordinate(), content);
                }
            });
        } else {
            // On selected => show/hide popup
            select.getFeatures(oplMapObj).on(['add'], function (e) {
                let feature = e.element;
                let content = "";
                if (typeof feature.get("text") !== "undefined") {
                    content += "<img src='" + feature.get("img") + "'/>";
                    content += feature.get("text");
                    oplMapObj.popupOverlay.show(feature.getGeometry().getFirstCoordinate(), content);
                }
            })
            select.getFeatures(oplMapObj).on(['remove'], function (e) {
                oplMapObj.popupOverlay.hide();
            });
        }

        select.getFeatures(oplMapObj).on(['add', 'remove'], function (e) {
            var info = $("#select").html("");
            if (e.type == "add") {
                var el = e.element;
                var ul = $('<ul>').appendTo(info);
                var prop = el.getProperties();
                for (var i in prop) {
                    if (i !== 'geometry') {
                        var li = $('<li>')
                            .html('<i>' + i + "</i>: " + prop[i])
                            .appendTo(ul);
                    }
                }
            }
        });

    }

    //enableMeasuringTool(MeasurementType) {
    //    this.map.removeInteraction(this.measuringTool);

    //    var geometryType = MeasurementType; // Polygon Or LineString
    //    var html = geometryType === 'Polygon' ? '<sup>2</sup>' : '';

    //    this.measuringTool = new ol.interaction.Draw({
    //        type: geometryType,
    //        source: this.vectorLayer.getSource()
    //    });

    //    this.measuringTool.on('drawstart', function (event) {
    //        try { this.vectorLayer.getSource().clear(); } catch (err) { }

    //        event.feature.on('change', function (event) {
    //            var measurement = geometryType === 'Polygon' ? event.target.getGeometry().getArea() : event.target.getGeometry().getLength();
    //            var measurementFormatted = measurement > 100 ? (measurement / 1000).toFixed(2) + 'km' : measurement.toFixed(2) + 'm';

    //            var resultElement = $('#info');
    //            resultElement.html(measurementFormatted + html);
    //        });
    //    });

    //    this.map.addInteraction(this.measuringTool);
    //}

    //removeMeasuringToolEvent() {
    //    this.map.removeInteraction(this.measuringTool);
    //}

    enableMeasuringTool(MeasurementType, RemoveMeasuringId, EnableSnapGuides) {
        var vectorSource = this.vectorSource;
        var vectorLayer = this.vectorLayer;

        var sketch;
        var helpTooltipElement;
        var helpTooltip;
        var measureTooltipElement;
        var measureTooltip;
        var continuePolygonMsg = 'Click to continue drawing the polygon';
        var continueLineMsg = 'Click to continue drawing the line';

        var typeSelect = MeasurementType; // length, area

        var draw;
        var snapi;

        var formatLength = function (line) {
            var length = ol.sphere.getLength(line);
            var output;
            if (length > 100) {
                output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
            } else {
                output = (Math.round(length * 100) / 100) + ' ' + 'm';
            }
            return output;
        };

        var formatArea = function (polygon) {
            var area = ol.sphere.getArea(polygon);
            var output;
            if (area > 10000) {
                output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
            } else {
                output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
            }
            return output;
        };

        var pointerMoveHandler = function (evt) {
            if (evt.dragging) {
                return;
            }

            var helpMsg = 'Click to start drawing';
            if (sketch) {
                var geom = (sketch.getGeometry());
                if (geom instanceof ol.geom.Polygon) {
                    helpMsg = continuePolygonMsg;
                } else if (geom instanceof ol.geom.LineString) {
                    helpMsg = continueLineMsg;
                }
            }

            helpTooltipElement.innerHTML = helpMsg;
            helpTooltip.setPosition(evt.coordinate);

            helpTooltipElement.classList.remove('hidden');
        };

        function createMeasureTooltip(map) {
            if (measureTooltipElement) {
                measureTooltipElement.parentNode.removeChild(measureTooltipElement);
            }
            measureTooltipElement = document.createElement('div');
            measureTooltipElement.className = 'tooltip tooltip-measure';
            measureTooltip = new ol.Overlay({
                element: measureTooltipElement,
                offset: [0, -15],
                positioning: 'bottom-center'
            });
            map.addOverlay(measureTooltip);
        }

        function createHelpTooltip(map) {
            if (helpTooltipElement) {
                helpTooltipElement.parentNode.removeChild(helpTooltipElement);
            }
            helpTooltipElement = document.createElement('div');
            helpTooltipElement.className = 'tooltip hidden';
            helpTooltip = new ol.Overlay({
                element: helpTooltipElement,
                offset: [15, 0],
                positioning: 'center-left'
            });
            map.addOverlay(helpTooltip);            
        }

        function createSnapGuides(map) {
            var modi = new ol.interaction.Modify({ source: vectorLayer.getSource() });
            map.addInteraction(modi);

            snapi = new ol.interaction.SnapGuides();
            snapi.setDrawInteraction(draw);
            snapi.setModifyInteraction(modi);
            map.addInteraction(snapi);
        }

        function addInteraction(map) {
            var _self = map;
            var type = (typeSelect == 'area' ? 'Polygon' : 'LineString');
            draw = new ol.interaction.Draw({
                source: vectorSource,
                type: type,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.5)',
                        lineDash: [10, 10],
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 5,
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.7)'
                        }),
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        })
                    })
                })
            });
            _self.addInteraction(draw);

            createMeasureTooltip(_self);
            createHelpTooltip(_self);

            _self.removeInteraction(snapi);
            if (EnableSnapGuides == true) {
                createSnapGuides(_self);
            }

            var listener;
            draw.on('drawstart',
                function (evt) {
                    // set sketch
                    sketch = evt.feature;

                    var tooltipCoord = evt.coordinate;

                    listener = sketch.getGeometry().on('change', function (evt) {
                        var geom = evt.target;
                        var output;
                        if (geom instanceof ol.geom.Polygon) {
                            output = formatArea(geom);
                            tooltipCoord = geom.getInteriorPoint().getCoordinates();
                        } else if (geom instanceof ol.geom.LineString) {
                            output = formatLength(geom);
                            tooltipCoord = geom.getLastCoordinate();
                        }
                        measureTooltipElement.innerHTML = output;
                        measureTooltip.setPosition(tooltipCoord);
                    });
                }, this);

            draw.on('drawend',
                function () {
                    measureTooltipElement.className = 'tooltip tooltip-static';
                    measureTooltip.setOffset([0, -7]);
                    // unset sketch
                    sketch = null;
                    // unset tooltip so that a new one can be created
                    measureTooltipElement = null;
                    createMeasureTooltip(_self);
                    ol.Observable.unByKey(listener);
                    RemoveMeasuringFunc();
                }, this);
        }

        this.map.on('pointermove', pointerMoveHandler);

        this.map.getViewport().addEventListener('mouseout', function () {
            helpTooltipElement.classList.add('hidden');
        });

        addInteraction(this.map, EnableSnapGuides);   

        // Remove Measuring
        var _self = this.map;
        this.removeMeasuringId = RemoveMeasuringId;
        function RemoveMeasuringFunc() {
            //console.log(draw);
            _self.removeInteraction(draw);
            _self.removeInteraction(snapi);            
            _self.removeOverlay(helpTooltip);
        }

        $("#" + this.removeMeasuringId).remove();
        var $input = $('<input type="button" id="' + this.removeMeasuringId + '" />');
        $input.hide();
        $input.appendTo($("body"));

        var btn = document.getElementById(this.removeMeasuringId);
        btn.addEventListener("click", RemoveMeasuringFunc);
        btn.removeEventListener("click", RemoveMeasuringId);
    }

    pulsate(map, color, feature, duration) {
        var _self = this;

        var start = new Date().getTime();

        var key = map.on('postcompose', function (event) {
            var vectorContext = event.vectorContext;
            var frameState = event.frameState;
            var flashGeom = feature.getGeometry().clone();
            var elapsed = frameState.time - start;
            var elapsedRatio = elapsed / duration;
            var radius = ol.easing.easeOut(elapsedRatio) * 35 + 5;
            var opacity = ol.easing.easeOut(1 - elapsedRatio);
            var fillOpacity = ol.easing.easeOut(0.5 - elapsedRatio)

            vectorContext.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: radius,
                    snapToPixel: false,
                    fill: new ol.style.Fill({
                        color: 'rgba(119, 170, 203, ' + fillOpacity + ')',
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(119, 170, 203, ' + opacity + ')',
                        width: 2 + opacity
                    })
                })
            }));

            vectorContext.drawGeometry(flashGeom);
            vectorContext.setStyle(_self.pulsateMarkerStyle);
            vectorContext.drawGeometry(feature.getGeometry());

            if (elapsed > duration) {
                ol.Observable.unByKey(key);
                _self.pulsate(map, color, feature, duration); // recursive function
            }

            map.render();
        });

    }

    moveFeatureUp(feature) {
        var tmpFeatureId;
        var tmpFeature = feature.clone();        
        if (typeof feature.getId() !== "undefined") {
            tmpFeatureId = feature.getId();
            this.vectorLayer.getSource().removeFeature(feature);
            tmpFeature.setId(tmpFeatureId);
            this.vectorLayer.getSource().addFeature(tmpFeature);
        } else {
            this.vectorLayer.getSource().removeFeature(feature);
            this.vectorLayer.getSource().addFeature(tmpFeature);
        }
        return tmpFeature;
    }

    //openContextMenu(x, y) {

    //    $('.contextMenu').remove();
    //    $('body').append('<div class="contextMenu" style=" top: ' + y + 'px; left:' + x + 'px;">' +
    //        '<div class="menuItem" id="ZoomInId" > Zoom In </div>' +
    //        '<div class="menuItem" id="ZoomOutId" > Zoom Out </div>' +
    //        '<div class="menuItem" id="CenterMapId" > Center Map Here </div>' + '<div class="menuSeparator"> </div>' +
    //        '<div class="menuItem" id="AddMarkerId" > Add Marker </div>' +
    //        '<div class="menuItem" id="AddAreaId" > Add Area </div>' +
    //        '</div>');
         
    //    document.getElementById("ZoomInId").removeEventListener("click", () => { });
    //    document.getElementById('ZoomInId').addEventListener('click', () => {
    //        console.log('Zoom In');
    //        this.handleContexMenuEvent('zoomIn', x, y);
    //    });

    //    document.getElementById("ZoomOutId").removeEventListener("click", () => { });
    //    document.getElementById('ZoomOutId').addEventListener('click', () => {
    //        console.log('Zoom Out');
    //        this.handleContexMenuEvent('zoomOut', x, y);
    //    });

    //    document.getElementById("CenterMapId").removeEventListener("click", () => { });
    //    document.getElementById('CenterMapId').addEventListener('click', () => {
    //        console.log('Center Map');
    //        this.handleContexMenuEvent('centerMap', x, y);
    //    });

    //    document.getElementById("AddMarkerId").removeEventListener("click", () => { });
    //    document.getElementById('AddMarkerId').addEventListener('click', () => {
    //        console.log('Add Marker');
    //        this.handleContexMenuEvent('addMarker', x, y);
    //    });

    //    document.getElementById("AddAreaId").removeEventListener("click", () => { });
    //    document.getElementById('AddAreaId').addEventListener('click', () => {
    //        console.log('Add Area');
    //        this.handleContexMenuEvent('addArea', x, y);
    //    });
    //}

    //handleContexMenuEvent(option, x, y) {
    //    $('.contextMenu').remove();
    //    var location = this.oplMap.getCoordinateFromPixel([x, y]);

    //    if (option == 'zoomIn') {

    //        var view = this.oplMap.getView();
    //        view.setZoom(view.getZoom() + 1);

    //    } else if (option == 'zoomOut') {

    //        var view = this.oplMap.getView();
    //        view.setZoom(view.getZoom() - 1);

    //    } else if (option == 'centerMap') {

    //        console.log(location);
    //        this.goToCoord(location[0], location[1]);

    //    } else if (option == 'addMarker') {

    //        console.log(location);
    //        //var feature = new ol.Feature(new ol.geom.Point(location));
    //        //feature.setStyle(this.iconStyle);
    //        //this.vectorSource.addFeature(feature);

    //    } else if (option == 'addArea') {

    //        var draw; // global so we can remove it later
    //        function geometryFunction(coordinates, geometry) {
    //            if (!geometry) {
    //                geometry = new ol.geom.Polygon(null);
    //            }
    //            var start = coordinates[0];
    //            var end = coordinates[1];
    //            geometry.setCoordinates([
    //                [start, [start[0], end[1]], end, [end[0], start[1]], start]
    //            ]);

    //            return geometry;
    //        };

    //        draw = new ol.interaction.Draw({
    //            source: this.areaSource,
    //            type: 'Polygon',
    //            geometryFunction: this.geometryFunction
    //        });
    //        this.oplMap.addInteraction(draw);

    //        draw.on('drawend', function (event) {
    //            //this.oplMap.removeInteraction(draw);
    //        });

    //        //// Get the array of features
    //        //var features = this.areaVectorLayer.getSource().getFeatures();

    //        //// Go through this array and get coordinates of their geometry.
    //        //features.forEach(function (feature) {
    //        //    console.log(feature.getGeometry().getCoordinates());
    //        //});
    //    }
    //}

    addPoint(lat, lng) {
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
                })]
            }),
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 0.5],
                    anchorXUnits: "fraction",
                    anchorYUnits: "fraction",
                    src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
                })
            })
        });
        this.map.addLayer(vectorLayer);
    }
}