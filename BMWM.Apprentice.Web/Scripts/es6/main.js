import OplMap from './OplMap';
import WmsOplMap from './WmsOplMap';
import PPOplMap from './PPOplMap'
import Popup from './JsUtility.js';
import { fail } from 'assert';

$(function () {
    
    console.log(CurrentController + " : " + CurrentAction);

    var Warehouser = 10;
    var Zone = 20;
    var Rack = 30;
    var Location = 40;
    var Polygon = 50;
    var Marker = 60;
    var ShowMapToggle = 0;

    var DefaultMapId = 'map';
    //var DefaultLat = 14.0701111;
    //var DefaultLng = 101.8244247;
    //var DefaultZoom = 18;
    var DefaultLat = 13.736717;
    var DefaultLng = 100.523186;
    var DefaultZoom = 5;

    var DefaultPartLng = 101.82597231469116;
    var DefaultPartLat = 14.070416903148072;
    var DefaultPartZoom = 21;

    if ((CurrentController.toUpperCase() == "OLMAP") && (CurrentAction.toUpperCase() == "MANAGEAREAS")) {

        var OplMapObj = new OplMap(DefaultMapId, DefaultLat, DefaultLng, DefaultZoom);

        // Scale control
        OplMapObj.createScaleControl();

        // Interaction
        //OplMapObj.createInteraction();

        // Main control bar
        var settingArray = [/*'Select', 'Delete',*/ /*'Info',*/ /*'DrawPoint',*/ /*'DrawLine',*/
                        /*'DrawPolygon',*/ /*'DrawHole',*/ /*'DrawRegular', 'Transform',*/ /*'Split',*/
                        /*'FillColor',*/ /*'Offset',*/ /*'UndoSetting',*/ 'ClearMeasuring'];
        OplMapObj.createControlBar(settingArray);

        // render Geo Json layer
        //OplMapObj.renderGeoJSonLayer('http://localhost:2256/OLMap/GetGeoJSON', 'http://localhost:2256/Content/Images/arrow_down.png', 'Hover');
        //OplMapObj.renderGeoJSonLayer('http://localhost:2256/OLMap/GetGeoJSON', '', ''); // Hover, default Click

        // Create WMS map.
        var WmsOplMapObj = new WmsOplMap(OplMapObj);

        // Create PP map.
        //var PPOplMapObj = new PPOplMap(OplMapObj, WmsOplMapObj);
        //var ppSettingArray = ['ShowPPGeoBookmark'];
        //PPOplMapObj.createPPOplMap(ppSettingArray);

        var wmsSettingArray = ['SearchTag', 'SearchGrpTag', 'SelectMoveFeatures', 'CreatePlacemark', 'RemovePlacemark',
            'MoveFeature', 'ScaleToggle', 'GridRef', 'DeleteFeature', 'PrintControl',
            'TransferConfirm', 'Clear', 'FullScreenControl', 'SelectGeoMarker'];
        WmsOplMapObj.createWmsOplMap(wmsSettingArray);

        WmsOplMapObj.createInteraction(false);

        let MarkerEnableSelect = false;
        let MarkerEnableDelete = false;
        let PolygonEnableSelect = false;
        let PolygonEnableDelete = false;
        WmsOplMapObj.renderGeometryByLocation(GlobalRenderGeometryByLocationUrl, Warehouser, 
                                              MarkerEnableSelect, MarkerEnableDelete,
                                              PolygonEnableSelect, PolygonEnableDelete); 

        WmsOplMapObj.renderLocationMarker(GlobalGetLocationMvToLngLatUrl);
        WmsOplMapObj.renderSketchGeometry(GlobalRenderSketchGeometryUrl);
        WmsOplMapObj.initialSketchGeometryLocation(GlobalGetInitialSketchGeometryLocationUrl, GlobalSetSketchGeometryMvtLngLatUrl);
        //WmsOplMapObj.setPendingTransferConfirm();

        // Show popup infomation.
        var TogglePopup = 0;
        var LastOverFeatureId;
        OplMapObj.map.on(['pointermove'], function (e) {
            //console.log(TogglePopup);
            if (e.dragging) { return; }
            var pixel = OplMapObj.map.getEventPixel(e.originalEvent);
            var hit = OplMapObj.map.hasFeatureAtPixel(pixel);
            var feature = OplMapObj.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) { return feature; });

            if (hit) {
                //console.log("hit");             
                if (typeof feature.get('Id') !== 'undefined') {
                    if (LastOverFeatureId != feature.get('Id')) { TogglePopup = 0; }
                    if (TogglePopup == 0) {
                        //console.log("Call web service...");        

                        //var fPoint = e.coordinate;
                        var fPoint = feature.getGeometry().getCoordinates();

                        var PostData = new FormData();
                        PostData.append("Container", feature.get('Container'));
                        WmsOplMapObj.ShowSketchGeometryPopup(GlobalGetPopupSketchGeometryUrl, PostData, fPoint[0][0]);

                        TogglePopup = "1"
                        LastOverFeatureId = feature.get('Id');
                    }
                }
            } else {
                //console.log(".");
                TogglePopup = 0;
                OplMapObj.popupOverlay.hide();
            }
        });

        $("#DrawObjId").click(function (e) {
            e.preventDefault();

            var GetdGeometryUrl = GlobalGetdGeometryUrl;
            var GeometryId = $("#GeometrySelectListId").val();
            WmsOplMapObj.createPartGeometry(GetdGeometryUrl, GeometryId);
            //OplMapObj.view.fit(OplMapObj.vectorLayer.getSource().getExtent(), { duration: 1000 });
        });

        $("#SearchBtId").click(function (e) {
            e.preventDefault();

            var SearchId = $("#SearchId").val();
            //console.log(SearchId);

            OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                var featureId = feature.getId();
                var refKey = feature.get("RefKey");
                if (featureId == SearchId) {
                    feature = OplMapObj.moveFeatureUp(feature);
                    WmsOplMapObj.ActiveFeatures = feature;

                    var fPoint = feature.getGeometry().getCoordinates();
                    //console.log(fPoint[0][0]);

                    var PostData = new FormData();
                    PostData.append("SketchGeometryId", feature.get('Id'));
                    PostData.append("RefGrpKey", "");
                    PostData.append("RefKey", feature.get('RefKey'));
                    WmsOplMapObj.ShowSketchGeometryPopup(GlobalGetPopupSketchGeometryUrl, PostData, fPoint[0][0]);
                } // end if
            });

        });

        $("#GrpSearchBtId").click(function (e) {
            e.preventDefault();

            $(".placemarkClass").remove();

            var GrpSearchId = $("#GrpSearchId").val();
            //console.log(GrpSearchId);

            WmsOplMapObj.ActiveFeatureGroup = [];
            OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                var featureId = feature.getId();
                var refGrpKey = feature.get("RefGrpKey");
                if (refGrpKey == GrpSearchId) {
                    WmsOplMapObj.ActiveFeatureGroup.push(feature);
                }
            });
            //console.log(WmsOplMapObj.ActiveFeatureGroup.length);

            for (var i = 0; i < WmsOplMapObj.ActiveFeatureGroup.length; i++) {
                let feature = WmsOplMapObj.ActiveFeatureGroup[i];
                var fPoint = feature.getGeometry().getCoordinates();

                var PostData = new FormData();
                PostData.append("SketchGeometryId", feature.get('Id'));
                PostData.append("RefKey", feature.get('RefKey'));

                var placemark = new ol.Overlay.Placemark({
                    color: '#369',
                    popupClass: 'placemarkClass',
                    //backgroundColor : 'yellow',
                    position: fPoint[0][0],
                    autoPan: true,
                    onshow: function () { /*console.log("You opened a placemark");*/ },
                    autoPanAnimation: { duration: 250 }
                });
                OplMapObj.map.addOverlay(placemark);
                //placemark.show(placemark.getPosition(), "<i class=\"fa fa-qrcode\"></i>");

                OplMapObj.view.fit(OplMapObj.vectorLayer.getSource().getExtent(), { duration: 1000 });
            }
        });

        $("#MoveGrpBtId").click(function (e) {
            e.preventDefault();

            var GrpSelectId = $("#GrpSelectId").val();
            //console.log(GrpSelectId);

            if (typeof WmsOplMapObj.PlacemarkLngLatValue === 'undefined') return true;

            var toLngLat = WmsOplMapObj.PlacemarkLngLatValue;
            //console.log(toLngLat);

            WmsOplMapObj.ActiveFeatureGroup = [];
            var GrpSelectIdArray = GrpSelectId.split(",");
            for (var i = 0; i < GrpSelectIdArray.length; i++) {
                var inputFeatureAttrId = GrpSelectIdArray[i];
                OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                    var featureAttrId = feature.get("Id");
                    if (typeof feature.get('Id') !== 'undefined') {
                        if ("DRAWID" + featureAttrId.toString() == inputFeatureAttrId) {
                            //console.log("true... DRAWID" + featureAttrId.toString() + " " + inputFeatureAttrId);                      
                            WmsOplMapObj.ActiveFeatureGroup.push(feature);
                            return true;
                        }
                    } // end if               
                });
            }
            //console.log(WmsOplMapObj.ActiveFeatureGroup);

            var destinationPoint = ol.proj.fromLonLat([toLngLat[0], toLngLat[1]]);
            OplMapObj.goToCoord(destinationPoint[0], destinationPoint[1]);

            // Move...
            for (var i = 0; i < WmsOplMapObj.ActiveFeatureGroup.length; i++) {
                var feature = WmsOplMapObj.ActiveFeatureGroup[i];
                var fPoint = feature.getGeometry().getCoordinates();
                WmsOplMapObj.moveSingleFeature(feature, fPoint[0][0], toLngLat);
            }

        });

        $("#ClearMarkerBtId").click(function (e) {
            $(".placemarkClass").remove();
            $(".placemarkLngLatClass").remove();
            //OplMapObj.view.fit(OplMapObj.vectorLayer.getSource().getExtent(), { duration: 1000 });
        });

        $("#DeleteBtId").click(function (e) {
            e.preventDefault();
            let source = OplMapObj.vectorLayer.getSource();
            source.removeFeature(WmsOplMapObj.ActiveFeatures);
            WmsOplMapObj.deleteSketchGeometry(GlobalDeleteSketchGeometryUrl, WmsOplMapObj.ActiveFeatures.get('Id'));
            $(".deleteFeatureButtonClass").hide();
            //OplMapObj.view.fit(OplMapObj.vectorLayer.getSource().getExtent(), { duration: 1000 });
        });

        //var jsonLatLng = [
        //    { lat: 14.070088700532338, lng: 101.82443468712182 },
        //    { lat: 14.070088700532338, lng: 101.82435308702374 },
        //    { lat: 14.070007512865388, lng: 101.82435308702374 },
        //    { lat: 14.070007512865388, lng: 101.82443468712182 },
        //    { lat: 14.070088700532338, lng: 101.82443468712182 }
        //]

        //var lineStringArray = [];
        //for (var i = 0; i < jsonLatLng.length; i++) {
        //    //var coordinate = ol.proj.fromLonLat([jsonLatLng[i].lng, jsonLatLng[i].lat]);
        //    //lineStringArray.push(coordinate);

        //    var lnglat = [jsonLatLng[i].lng, jsonLatLng[i].lat];
        //    lineStringArray.push(lnglat);
        //}
        ////console.log(lineStringArray);

        //var line2 = new ol.geom.LineString(lineStringArray);
        //line2.transform('EPSG:4326', 'EPSG:3857');

        //var lineFeature2 = new ol.Feature(line2);

        //var lineSource2 = new ol.source.Vector({
        //    features: [lineFeature2]
        //});

        //var measureVector2 = new ol.layer.Vector({
        //    source: lineSource2,
        //    style: OplMapObj.measurementStyleFunc
        //})

        //OplMapObj.map.addLayer(measureVector2);
    }

    if ((CurrentController.toUpperCase() == "INVENTORY") && (CurrentAction.toUpperCase() == "INDEX")) {
            
        //override dialog's title function to allow for HTML titles
        $.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
            _title: function(title) {
                var $title = this.options.title || '&nbsp;'
                if( ("title_html" in this.options) && this.options.title_html == true )
                    title.html($title);
                else title.text($title);
            }
        }));

        $('#ListTagId').chosen({ width: '100%', allow_single_deselect:true, display_selected_options: true, display_disabled_options: false });        
        $('#ListMarkerId').chosen({ width: '100%', allow_single_deselect:true, display_selected_options: true, display_disabled_options: false });
        $('#dialogListTagId').chosen({ width: '100%', allow_single_deselect:true, display_selected_options: false, display_disabled_options: false });

        var OplMapObj = new OplMap(DefaultMapId, DefaultLat, DefaultLng, DefaultZoom);

        // Add print control
        var printControl = new ol.control.Print({ className: "printControlButtonClass" });
        OplMapObj.map.addControl(printControl);

        // Scale control
        OplMapObj.createScaleControl();

        // Load default Warehouse marker.
        let WhPostData = new FormData();
        CallServicesWithFormData(GlobalGetWarehouserMarkerUrl, false, WhPostData, function (data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);
            $.each(jsonObj, function (key, val) {
                let Name = val.Name;
                let Latitude = 0;
                let Longitude = 0;
                let Zoom = 0;
                if (val.GeoCoordinates.length > 0) {
                    Latitude = val.GeoCoordinates[0].Latitude;
                    Longitude = val.GeoCoordinates[0].Longitude;
                }
                if (val.GeoProperties.length > 0) {
                    Zoom = val.GeoProperties[0].Zoom;
                }

                var html = "<li>";
                html += "<a href='#' class='WarehouserMarkerClass' ";
                html += "id = 'Marker" + val.Id + "' ";
                html += "attrLatitude = '" + Latitude + "' ";
                html += "attrLongitude = '" + Longitude + "' ";
                html += "attrZoom = '" + Zoom + "' ";
                html += "attrName = '" + Name + "' ";
                html += "> " + Name + "</a >";
                html += "</li>";
                $('#WarehouseMarkerId').append(html);
            });

            $.each($(".WarehouserMarkerClass"), function () {
                let Id = $(this).attr("Id");
                let attrLatitude = $(this).attr("attrLatitude");
                let attrLongitude = $(this).attr("attrLongitude");
                let attrZoom = $(this).attr("attrZoom");
                let attrName = $(this).attr("attrName");
                //console.log(Id + "|" + attrLatitude + "|" + attrLongitude + "|" + attrZoom);

                $("#" + Id).bind("click", function () {
                    $("#WarehouseBtId").html(attrName);
                    let Latitude = parseFloat(attrLatitude);
                    let Longitude = parseFloat(attrLongitude);
                    let Zoom = parseFloat(attrZoom);
                    var destinationPoint = ol.proj.fromLonLat([Longitude, Latitude]);
                    OplMapObj.goToCoord(destinationPoint[0], destinationPoint[1], Zoom);
                    goToByScroll('DivLoactionFormId');
                    //var destinationPoint = ol.proj.fromLonLat([parseFloat(attrLongitude), parseFloat(attrLatitude)]);
                    //OplMapObj.map.getView().setCenter(destinationPoint, 'EPSG:4326', 'EPSG:3857');
                });
            });

        });

        // Create WMS map.
        var WmsOplMapObj = new WmsOplMap(OplMapObj);

        //console.log("Debug...");
        //var jsonAreaB2 = [{ lat: 13.453461841957179, lng: 100.60750438812147 },
        //    { lat: 13.453461841957179, lng: 100.60750531812148 },
        //    { lat: 13.453460941957161, lng: 100.60750531812148 },
        //    { lat: 13.453460941957161, lng: 100.60750438812147 }];
        //WmsOplMapObj.createPolygonArea(OplMapObj, jsonAreaB2, "");
        //console.log("End Debug..");

        // Create PP map.
        //var PPOplMapObj = new PPOplMap(OplMapObj, WmsOplMapObj);
        //var ppSettingArray = ['ShowPPGeoBookmark'];
        //PPOplMapObj.createPPOplMap(ppSettingArray);

        var wmsSettingArray = [];
        WmsOplMapObj.createWmsOplMap(wmsSettingArray);
        let createInteractionObj = WmsOplMapObj.createInteraction(true);

        // Remove main bar...
        OplMapObj.map.removeControl(OplMapObj.mainbar);

        /*
        // Show popup infomation.
        var TogglePopup = 0;
        var LastOverFeatureId;
        OplMapObj.map.on(['pointermove'], function (e) {
            //console.log(TogglePopup);
            if (e.dragging) { return; }
            var pixel = OplMapObj.map.getEventPixel(e.originalEvent);
            var hit = OplMapObj.map.hasFeatureAtPixel(pixel);
            var feature = OplMapObj.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) { return feature; });

            if (hit) {
                console.log("hit");             
                if (typeof feature.get('Id') !== 'undefined') {
                    if (LastOverFeatureId != feature.get('Id')) { TogglePopup = 0; }
                    if (TogglePopup == 0) {
                        //console.log("Call web service...");        

                        //var fPoint = e.coordinate;
                        var fPoint = feature.getGeometry().getCoordinates();

                        var PostData = new FormData();
                        PostData.append("Container", feature.get('Container'));
                        WmsOplMapObj.ShowSketchGeometryPopup(GlobalGetPopupSketchGeometryUrl, PostData, fPoint[0][0]);

                        TogglePopup = "1"
                        LastOverFeatureId = feature.get('Id');
                    }
                }
            } else {
                console.log(".");
                TogglePopup = 0;
                OplMapObj.popupOverlay.hide();
            }
        });
        */

        // Start : Create custom bar menu.
        let mainbar = new ol.control.Bar({ toggleOne: true, group: true });
        OplMapObj.map.addControl(mainbar);

        function ListTagInfo() {
            var dialog = $( "#dialog-message" ).removeClass('hide')
            .dialog({
                title: "Tag",
                position: {
                    my: 'right-3 top+35',
                    at: 'right top',
                    of: $('#map')
                },  
                width: 300,
                height: 250,
                resizable: true,              
                modal: false,               
                title_html: true,
                appendTo: "#map",
                autoOpen: false
            })
            .parent().draggable({
                containment: '#map'
            }); 
        }          
            
        var scaleToggleBt = new ol.control.Toggle({
            html: '<i class="fa fa-qrcode"></i>',
            className: "enableTagInfoBtClass",
            title: "Tag",
            interaction: new ol.interaction.Select(),
            active: false,
            onToggle: function (active) {
                if (active == true) {
                    //console.log("activated...");
                    ListTagInfo();
                    $('#dialog-message').dialog('open');
                } else if (active == false) {
                    //console.log("deactivated...");
                    $('#dialog-message').dialog('close')
                }
            }
        });
        mainbar.addControl(scaleToggleBt); 

        // Set Position
        // top, top-left, left, bottom-left, bottom, bottom-right, right, top-right
        mainbar.setPosition('top-right');
        //End : Create custom bar menu.

        function IntInventory() {
            $('#DivLoactionFormId').css('visibility', 'hidden');
            $('#DivLoactionFormId').hide();
            $('#manage-map').hide();
        }
        IntInventory();

        function FindTagInOnMap(TagName) {
            OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                var featureId = feature.getId();
                var Container = feature.get("Container");
                if (Container == TagName) {
                    //console.log("Found object...");
                    feature = OplMapObj.moveFeatureUp(feature);
                    WmsOplMapObj.ActiveFeatures = feature;

                    var fPoint = feature.getGeometry().getCoordinates();
                    var PostData = new FormData();
                    PostData.append("Container", feature.get('Container'));
                    WmsOplMapObj.ShowSketchGeometryPopup(GlobalGetPopupSketchGeometryUrl, PostData, fPoint[0][0]);

                    WmsOplMapObj.ActiveFeatures = feature;

                    OplMapObj.map.getView().setZoom(19);

                    var destinationPoint = fPoint[0][0];
                    OplMapObj.goToCoord(destinationPoint[0], destinationPoint[1]);
                   
                    return true;
                } // end if
            });
        }

        function LoadMarkerToSelectBox()
        {
            var PostData = new FormData();
            PostData.append("GeoType", 60);
            PostData.append("RefKey", '');
            CallServicesWithFormData(GlobalRenderGeometryByLocationUrl, true, PostData, handleData);

            function handleData(data) {
                var jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj); 
                //$('#ListMarkerId').append('<option value="">  </option>');               
                $.each(jsonObj, function (key, val) {
                    //console.log(key + " : " + val.Id + " : " + val.Name);
                    if (val.Name != '') {
                        let Longitude = val.GeoCoordinates[0].Longitude;
                        let Latitude = val.GeoCoordinates[0].Latitude;
                        let strLngLat = Longitude +"|"+ Latitude;                    
                        $('#ListMarkerId').append('<option value="'+ strLngLat +'">'+ val.Name +'</option>');  
                    }                     
                });                
                $('#ListMarkerId').trigger("chosen:updated"); 
            }
        }
        LoadMarkerToSelectBox();
        
        function RenderGeometryStorageLocations() {
        
            let MarkerEnableSelect = false;
            let MarkerEnableDelete = false;
            let LineStringEnableSelect = false;
            let LineStringEnableDelete = false;
            let PolygonEnableSelect = false;
            let PolygonEnableDelete = false;

            // Render geometry storage locations : Marker
            WmsOplMapObj.renderGeometryStorageLocations(GlobalRenderGeometryByLocationUrl, Marker, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);

            // Render geometry storage locations : Warehouse
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Warehouser, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);

            // Render geometry storage locations : Zone
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Zone, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);

            // Render geometry storage locations : Rack
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Rack, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);

            // Render geometry storage locations : Location
            MarkerEnableSelect = false;
            MarkerEnableDelete = false;
            PolygonEnableSelect = false;
            PolygonEnableDelete = false;
            WmsOplMapObj.renderGeometryByLocation(GlobalRenderGeometryByLocationUrl, Location,
                                                  MarkerEnableSelect, MarkerEnableDelete,
                                                  PolygonEnableSelect, PolygonEnableDelete);

            WmsOplMapObj.renderLocationMarker(GlobalGetLocationMvToLngLatUrl);
            WmsOplMapObj.renderTempLocationMarker(GlobalGetMvToLngLatInLocationTableUrl);
            WmsOplMapObj.renderSketchGeometry(GlobalRenderSketchGeometryUrl);
            WmsOplMapObj.initialSketchGeometryLocation(GlobalGetInitialSketchGeometryLocationUrl, GlobalSetSketchGeometryMvtLngLatUrl);

            //WmsOplMapObj.setPendingTransferConfirm();               
        }

        function enableMapFeatureFunc()
        {
            var enableMapFeature = readCookie('EnableMapFeature');
            //console.log(enableMapFeature);
            if (enableMapFeature == 'false') {
                $('#DivLoactionFormId').hide();
            } else {
                $('#DivLoactionFormId').css('visibility', 'visible'); // visible : hidden
                $('#DivLoactionFormId').show();
                $('#SelectBtId').addClass('btn-danger');
            }
        }

        function contextmenuItems() {
            var _map = OplMapObj.map;

            //var pinIcon = 'https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/pin_drop.png';
            //var centerIcon = 'https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/center.png';
            //var listIcon = 'https://cdn.jsdelivr.net/gh/jonataswalker/ol-contextmenu@604befc46d737d814505b5d90fc171932f747043/examples/img/view_list.png';

            var contextmenuItems = [
                {
                    text: 'Select Tag',
                    classname: 'some-style-class', // add some CSS rules
                    callback: function (f) {

                        if (typeof WmsOplMapObj.ActiveFeatures == 'undefined') return;
                        if (typeof WmsOplMapObj.ActiveFeatures.get('Container') == '') return;

                        // Check Id duplication...
                        let checkDuplicationItem = false;
                        let featuresArray = WmsOplMapObj.SelectFeatures;
                        for (var i = 0; i < featuresArray.length; i++) {
                            let featureObj = featuresArray[i];
                            if (featureObj.get("Container") == WmsOplMapObj.ActiveFeatures.get('Container')) {
                                //console.log('Duplicat item.');
                                checkDuplicationItem = true;
                                break;
                            }
                        } // exit for

                        if (checkDuplicationItem == false) {
                            //console.log('Add item.');
                            WmsOplMapObj.SelectFeatures.push(WmsOplMapObj.ActiveFeatures);  
                            WmsOplMapObj.addListTag();
                        }

                    }
                },                
                '-' // this is a separator
            ];

            var contextmenu = new ContextMenu({
                width: 180,
                items: contextmenuItems
            });
            OplMapObj.map.addControl(contextmenu);

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

            OplMapObj.map.on('pointermove', function (e) {
                if (e.dragging) return;

                var pixel = _map.getEventPixel(e.originalEvent);
                var hit = _map.hasFeatureAtPixel(pixel);

                _map.getTargetElement().style.cursor = hit ? 'pointer' : '';
            });
        }
        contextmenuItems();

        function PartSortingByGroup(grpResult) 
        {                
          console.log(grpResult);  
          let SysMsg = "" ;
            
           // Move part mulitple.
           let InitRow = false;
           let refFeatureIndex;
           for (let i = 0; i < grpResult.length; i++) {
               let partName = grpResult[i];
               SysMsg += "<strong>" + (i+1) + ") " + partName + "</strong><br/>";
               WmsOplMapObj.SelectFeatures = [];
               let items = $('#ListTagId').val();
               let iRow = 0;
               $.each(items, function(index, elem){
                   let TagName = elem;
                   OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                       let Container = feature.get("Container");
                       let RefKey = feature.get("RefKey");
                       if ((Container == TagName) && (partName == RefKey)) { 
                           SysMsg += (i+1) + "." + (iRow+1) + " : " + TagName + "<br/>";          
                           WmsOplMapObj.SelectFeatures.push(feature); 
                           iRow++;
                           return true;
                       } // end if
                   });
               }); // end each
               SysMsg += "<br/>";
               //console.log(WmsOplMapObj.SelectFeatures);

               if (InitRow == false) {
                   for (let iLoop = 0; iLoop < WmsOplMapObj.SelectFeatures.length; iLoop++) {                   
                       let toLngLat = WmsOplMapObj.PlacemarkLngLatValue;                        
                       let feature = WmsOplMapObj.SelectFeatures[iLoop];
                       let fPoint = feature.getGeometry().getCoordinates();
                       WmsOplMapObj.moveSingleFeature(feature, fPoint[0][0], toLngLat); 
                   }                    
                   InitRow = true;              
               } else {
                   for (let iLoop = 0; iLoop < WmsOplMapObj.SelectFeatures.length; iLoop++) {
                       let refFeature = refFeatureIndex.getGeometry().getCoordinates();
                       let toLngLat = ol.proj.transform(refFeature[0][1], 'EPSG:3857', 'EPSG:4326');
                       let feature = WmsOplMapObj.SelectFeatures[iLoop];
                       let fPoint = feature.getGeometry().getCoordinates();
                       WmsOplMapObj.moveSingleFeature(feature, fPoint[0][0], toLngLat); 
                   }
               }

               let refContainerName = WmsOplMapObj.SelectFeatures[0].get("Container");;
               OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                    var featureId = feature.getId();
                    var Container = feature.get("Container");
                    if (Container == refContainerName) {
                        refFeatureIndex = feature;
                        return true;
                    } // end if
                });

           }// end for
           $("#MapInfoId").summernote("code", SysMsg);
        }

        function PartSortingByParameter()
        {
            WmsOplMapObj.SelectFeatures = [];
            //var items = $('[name="SortingTag[]"]').val();
            var items = $('#ListTagId').val();
            //console.log(items);
            $.each(items, function(index, elem){
                let TagName = elem;
                OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                    //var featureId = feature.getId();
                    var Container = feature.get("Container");
                    if (Container == TagName) {            
                        WmsOplMapObj.SelectFeatures.push(feature); 
                        return true;
                    } // end if
                });
            }); // end each

            //console.log(WmsOplMapObj.SelectFeatures);
            //console.log("Sort data...");

            let propColumnVal = $('#PropColumnId').val();
            let propStackVal = $('#PropStackId').val();
            let propRowVal = $('#PropRowId').val();
            if (propColumnVal == "") { propColumnVal = 0; }
            if (propStackVal == "") { propStackVal = 0; }
            if (propRowVal == "") { propRowVal = 0; }

            let totalColumn = parseInt(propColumnVal) - 1;    
            let row = parseInt(propRowVal) - 1;
            let stack = parseInt(propStackVal) - 1;
            
            let rowIndex = 0;
            let stackIndex = 0;            
            let columnIndex = 0;
            let refFeatureIndex = 0;
            for (var iIndex = 0; iIndex < WmsOplMapObj.SelectFeatures.length; iIndex++) {

                if (iIndex == 0) {
                    let toLngLat = WmsOplMapObj.PlacemarkLngLatValue;
                    let feature = WmsOplMapObj.SelectFeatures[iIndex];
                    let fPoint = feature.getGeometry().getCoordinates();
                    WmsOplMapObj.moveSingleFeature(feature, fPoint[0][0], toLngLat);                    
                    //console.log(iIndex + " : " +  feature.get('Container') + " : A : Create ["+ rowIndex +"]["+ columnIndex +"] Ref. : " + refFeatureIndex);
                    stackIndex++;
                    continue; 
                }
                
                if (stack < stackIndex) {
                    //console.log("Stack Full...");
                    stackIndex = 0;
                    columnIndex++;
                       
                    if (totalColumn < columnIndex) {                        
                        //console.log("Create new row...");
                        rowIndex++;
                        columnIndex = 0;
                        refFeatureIndex = iIndex - ((stack+1) * (totalColumn+1)); 

                        if (row < rowIndex) { break; }
               
                        // set refernce position.
                        let refFeature = WmsOplMapObj.SelectFeatures[refFeatureIndex];

                        let refCoord = refFeature.getGeometry().getCoordinates(); 
                        let coord = ol.proj.transform(refCoord[0][3], 'EPSG:3857', 'EPSG:4326');
                        let feature = WmsOplMapObj.SelectFeatures[iIndex];
                        let Point = feature.getGeometry().getCoordinates();

                        //console.log(iIndex + " : " +  feature.get('Container') + " : C : Create ["+ rowIndex +"]["+ columnIndex +"] Ref. : " + refFeatureIndex);
                        WmsOplMapObj.moveSingleFeature(feature, Point[0][0], coord);    
                        
                        // set current position.
                        refFeatureIndex = iIndex;
                    } else {
                        // set refernce position.
                        refFeatureIndex = (iIndex-1) - stack;  
                        
                        let refFeature = WmsOplMapObj.SelectFeatures[refFeatureIndex];
                        let refCoord = refFeature.getGeometry().getCoordinates(); 
                        let coord = ol.proj.transform(refCoord[0][1], 'EPSG:3857', 'EPSG:4326');                                       
                        let feature = WmsOplMapObj.SelectFeatures[iIndex];
                        let Point = feature.getGeometry().getCoordinates();

                        //console.log(iIndex + " : " +  feature.get('Container') + " : D : Create ["+ rowIndex +"]["+ columnIndex +"] Ref. : " + refFeatureIndex);
                        WmsOplMapObj.moveSingleFeature(feature, Point[0][0], coord); 

                        // set current position.
                        refFeatureIndex = iIndex;
                    }

                } else { 
                    // set refernce position.                   
                    let refFeature = WmsOplMapObj.SelectFeatures[refFeatureIndex];

                    let refCoord = refFeature.getGeometry().getCoordinates(); 
                    let coord = ol.proj.transform(refCoord[0][0], 'EPSG:3857', 'EPSG:4326');                                       
                    let feature = WmsOplMapObj.SelectFeatures[iIndex];
                    let Point = feature.getGeometry().getCoordinates();

                    //console.log(iIndex + " : " +  feature.get('Container') + " : B : Create ["+ rowIndex +"]["+ columnIndex +"] Ref. : " + refFeatureIndex); 
                    WmsOplMapObj.moveSingleFeature(feature, Point[0][0], coord); 
                }
                stackIndex++;

            } // end for lop
        }

        let grpResult = [];
        function sortingGroups() {

            if (WmsOplMapObj.SelectFeatures.length == 0) { return; }              
            if ((typeof WmsOplMapObj.PlacemarkLngLatValue === 'undefined') || (WmsOplMapObj.PlacemarkLngLatValue == null)) {                                 
                WmsOplMapObj.ClearMap();
                WmsOplMapObj.PlacemarkLngLatValue = null;             
                var modal = bootbox.dialog({
                    message: "Please pin new location to transfer the selected tags.",
                    title: "Warning",
                    buttons: {
                        ok: {
                            label: "OK",
                            className: 'btn-info',
                            callback: function () {
                                
                            } // end callback
                        }
                    },
                    onEscape: function () {
                        
                    }
                });
                modal.modal("show"); 
                return true;
            }            
            
            // Check select part multiple.
            let fArray = WmsOplMapObj.SelectFeatures;
            grpResult = [];        
            for (let i = 0; i < fArray.length; i++) {
                let featureObj = fArray[i];
                let dataKey = '';
                if ((featureObj.getProperties().Container !== '') && (typeof featureObj.getProperties().Container !== 'undefined')) {
                    dataKey = featureObj.getProperties().RefKey;               
                }
                
                if (dataKey != '') {
                    if (grpResult.length == 0) { 
                        grpResult.push(dataKey);                    
                    } else {
                        let checkResult = false;
                        for (let iLoop = 0; iLoop < grpResult.length; iLoop++) {
                            let tempData = grpResult[iLoop];
                            if (tempData == dataKey) {
                                checkResult = true;
                                break;
                            }
                        }
                        if (checkResult == false) {
                            grpResult.push(dataKey);
                        }
                    } // end if
                } // end if            
            }
            console.log("Part Grp. : " + grpResult);
            
            if (grpResult.length == 1) {
                $('#mdSortingPropertyId').modal('show');
            } else {
                var modal = bootbox.dialog({
                    message: "There are more than one part found in selection. Do you want to sort tag and grouping by part number ?",
                    title: "Warning",
                    buttons: {
                        cancel: {
                            label: "Cancel",
                            callback: function () {
                            }
                        },
                        ok: {
                            label: "OK",
                            className: 'btn-info',
                            callback: function () {                            
                                PartSortingByGroup(grpResult); 
                                grpResult = [];
                                $('#ClearBtId').trigger('click');
                                $('#SelectBtId').trigger('click');
                            }
                        }
                    },
                    onEscape: function () {
    
                    }
                });
                modal.modal("show");                              
            } // end if            
        }        

        function confirmPlacemark()
        {
            if (WmsOplMapObj.PlacemarkLngLatValue == null) return;
            if (WmsOplMapObj.PlacemarkLngLatValue.length == 0) return;
            WmsOplMapObj.ActivePlacemarkLngLat = false;
            var point = ol.proj.fromLonLat([WmsOplMapObj.PlacemarkLngLatValue[0], WmsOplMapObj.PlacemarkLngLatValue[1]]);
            var PlacemarkLngLat = new ol.Overlay.Placemark({
                //color: '#369',
                popupClass: 'placemarkLngLatClass',
                //backgroundColor : 'yellow',
                position: point,
                autoPan: true,
                onshow: function () { /*console.log("You opened a placemark");*/ },
                autoPanAnimation: { duration: 250 }
            });
            OplMapObj.map.addOverlay(PlacemarkLngLat);
            //OplMapObj.PlacemarkLngLat.show(placemark.getPosition(), "<i class=\"fa fa-qrcode\"></i>");
        }

        function confirmLocation()
        {
            //console.log(WmsOplMapObj.ActiveFeatures);
            //console.log(WmsOplMapObj.SelectFeatures.length);

            let modal = bootbox.dialog({
                message: "Please click OK button to confirm transfer item.",
                title: "Confirm",
                buttons: {
                    cancel: {
                        label: "Cancel",
                        callback: function () {
                        }
                    },
                    ok: {
                        label: "OK",
                        className: 'btn-info',
                        callback: function () {

                            //let Container = WmsOplMapObj.ActiveFeatures.get('Container');
                            //WmsOplMapObj.transferConfirm(Container, WmsOplMapObj.ActiveFeatures);

                            $('#ClearBtId').trigger('click'); 
                            $('#SelectBtId').trigger('click'); 

                            var PostData = { ContainerName: $('#ListTagId').val() };
                            //console.log(PostData);
                            $.ajax({
                                type: "POST",
                                url: GlobalConfirmLocationByListContainerUrl,
                                data: PostData,
                                success: function (data) {
                                    //console.log(data);

                                    // Remove all features.
                                    OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                                        OplMapObj.vectorLayer.getSource().removeFeature(feature);;
                                    });	
                                    RenderGeometryStorageLocations();                                                                                                               
                                },
                                dataType: "json",
                                traditional: true
                            });

                        } // end callback
                    }
                },
                onEscape: function () {

                }                
            });

            if (WmsOplMapObj.SelectFeatures.length > 0) {
                modal.modal("show");
            } else if (WmsOplMapObj.SelectFeatures.length == 0) {
                return true;
            } else if (typeof WmsOplMapObj.ActiveFeatures === 'undefined') {
                return true;
            } else {
                modal.modal("show");
            }        
        }

        function tagTransfer()
        {
            //console.log(WmsOplMapObj.PlacemarkLngLatValue);
            //console.log(WmsOplMapObj.SelectFeatures);
            //console.log( $('#ListMarkerId').val() );

            let selectMarker = $('#ListMarkerId').val();
            if (selectMarker !== "") {
                var LngLat = selectMarker.split("|");
                //console.log(LngLat);
                let LngLatArray = [];
                LngLatArray.push(parseFloat(LngLat[0]));
                LngLatArray.push(parseFloat(LngLat[1]));
                //console.log(LngLatArray);
                WmsOplMapObj.PlacemarkLngLatValue = LngLatArray;
            }
            
            if ((typeof WmsOplMapObj.PlacemarkLngLatValue === 'undefined') || (WmsOplMapObj.PlacemarkLngLatValue == null)) {                                 
                WmsOplMapObj.ClearMap();
                WmsOplMapObj.PlacemarkLngLatValue = null;             
                var modal = bootbox.dialog({
                    message: "Please pin new location to transfer the selected tags.",
                    title: "Warning",
                    buttons: {
                        ok: {
                            label: "OK",
                            className: 'btn-info',
                            callback: function () {
                                
                            } // end callback
                        }
                    },
                    onEscape: function () {
                        
                    }
                });
                modal.modal("show"); 
                return false;
            }   

            if (WmsOplMapObj.PlacemarkLngLatValue == null) return;
            if (WmsOplMapObj.SelectFeatures.length > 0) {
                if (typeof WmsOplMapObj.PlacemarkLngLatValue === 'undefined') return true;
                let toLngLat = WmsOplMapObj.PlacemarkLngLatValue;
                //console.log(toLngLat);

                var destinationPoint = ol.proj.fromLonLat([toLngLat[0], toLngLat[1]]);
                OplMapObj.goToCoord(destinationPoint[0], destinationPoint[1]);

                // Move...
                for (var i = 0; i < WmsOplMapObj.SelectFeatures.length; i++) {
                    let feature = WmsOplMapObj.SelectFeatures[i];
                    let fPoint = feature.getGeometry().getCoordinates();
                    WmsOplMapObj.moveSingleFeature(feature, fPoint[0][0], toLngLat);
                }
            } else if (WmsOplMapObj.SelectFeaturesId.length > 0) {
                if (typeof WmsOplMapObj.PlacemarkLngLatValue === 'undefined') return true;
                let toLngLat = WmsOplMapObj.PlacemarkLngLatValue;
                //console.log(toLngLat);

                WmsOplMapObj.ActiveFeatureGroup = [];
                var GrpSelectIdArray = WmsOplMapObj.SelectFeaturesId;
                for (var i = 0; i < GrpSelectIdArray.length; i++) {
                    let inputFeatureAttrId = GrpSelectIdArray[i];
                    OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                        var featureAttrId = feature.get("Id");
                        if (typeof feature.get('Id') !== 'undefined') {
                            if ("DRAWID" + featureAttrId.toString() == inputFeatureAttrId) {
                                //console.log("true... DRAWID" + featureAttrId.toString() + " " + inputFeatureAttrId);                      
                                WmsOplMapObj.ActiveFeatureGroup.push(feature);
                                return true;
                            }
                        } // end if               
                    });
                }
                //console.log(WmsOplMapObj.ActiveFeatureGroup);

                var destinationPoint = ol.proj.fromLonLat([toLngLat[0], toLngLat[1]]);
                OplMapObj.goToCoord(destinationPoint[0], destinationPoint[1]);

                // Move...
                for (var i = 0; i < WmsOplMapObj.ActiveFeatureGroup.length; i++) {
                    let feature = WmsOplMapObj.ActiveFeatureGroup[i];
                    let fPoint = feature.getGeometry().getCoordinates();
                    WmsOplMapObj.moveSingleFeature(feature, fPoint[0][0], toLngLat);
                }
            } else if (typeof WmsOplMapObj.ActiveFeatures !== 'undefined') {
                let destinationPoint = ol.proj.fromLonLat([WmsOplMapObj.PlacemarkLngLatValue[0], WmsOplMapObj.PlacemarkLngLatValue[1]]);
                OplMapObj.goToCoord(destinationPoint[0], destinationPoint[1]);
                WmsOplMapObj.moveSingleFeature(WmsOplMapObj.ActiveFeatures, WmsOplMapObj.ActiveFeaturesCoordinate, WmsOplMapObj.PlacemarkLngLatValue);
            } 
            return true;
        }

        $('#TransferBtId').removeClass('btn-info');
        $('#TransferBtId').removeClass('btn-danger');
        $('#TransferBtId').prop('disabled', true);

        $('#ConfirmLocationBtId').removeClass('btn-info');
        $('#ConfirmLocationBtId').removeClass('btn-danger');
        $('#ConfirmLocationBtId').prop('disabled', true);

        $('#SortingBtId').removeClass('btn-info');
        $('#SortingBtId').removeClass('btn-danger');
        $('#SortingBtId').prop('disabled', true);

        $('#DeleteBtId').removeClass('btn-info');
        $('#DeleteBtId').removeClass('btn-danger');
        $('#DeleteBtId').prop('disabled', true);
    
        let evnetControl = {
            Select: function() {

                //console.log(WmsOplMapObj.PlacemarkLngLatValue);
                //console.log(WmsOplMapObj.PlacemarkLngLatValue);
                //console.log(WmsOplMapObj.SelectFeatures.length);

                $("[data-rel=popover]").popover('hide');

                $('#SelectBtId').addClass('btn-danger' );
                $('#SelectBtId').removeClass('btn-info');
                $('#SelectBtId').prop('disabled', false);

                $('#MultiselectBtId').addClass('btn-info');
                $('#MultiselectBtId').removeClass('btn-danger');
                $('#MultiselectBtId').prop('disabled', false);

                $('#PlacemarkBtId').addClass('btn-info');
                $('#PlacemarkBtId').removeClass('btn-danger');
                $('#PlacemarkBtId').prop('disabled', false);
                
                if(WmsOplMapObj.SelectFeatures.length == 0) {
                    // Transfer 
                    $('#TransferBtId').removeClass('btn-info');
                    $('#TransferBtId').removeClass('btn-danger');
                    $('#TransferBtId').prop('disabled', true);

                    // Confirm
                    $('#ConfirmLocationBtId').removeClass('btn-info');
                    $('#ConfirmLocationBtId').removeClass('btn-danger');
                    $('#ConfirmLocationBtId').prop('disabled', true);

                    //Sorting 
                    $('#SortingBtId').removeClass('btn-info');
                    $('#SortingBtId').removeClass('btn-danger');  
                    $('#SortingBtId').prop('disabled', true);  
                    
                    //Delete
                    $('#DeleteBtId').removeClass('btn-info');
                    $('#DeleteBtId').removeClass('btn-danger');
                    $('#DeleteBtId').prop('disabled', true);
                } else {
                    // Transfer 
                    $('#TransferBtId').addClass('btn-info');
                    $('#TransferBtId').removeClass('btn-danger');
                    $('#TransferBtId').prop('disabled', false);

                    // Confirm
                    $('#ConfirmLocationBtId').addClass('btn-info');
                    $('#ConfirmLocationBtId').removeClass('btn-danger');
                    $('#ConfirmLocationBtId').prop('disabled', false);

                    //Sorting 
                    $('#SortingBtId').addClass('btn-info');
                    $('#SortingBtId').removeClass('btn-danger');  
                    $('#SortingBtId').prop('disabled', false); 
                    
                    //Delete
                    $('#DeleteBtId').addClass('btn-info');
                    $('#DeleteBtId').removeClass('btn-danger');
                    $('#DeleteBtId').prop('disabled', false);
                }
                
                $('#DragBoxBtId').addClass('btn-info');
                $('#DragBoxBtId').removeClass('btn-danger');
                $('#DragBoxBtId').prop('disabled', false);                                            

                $('#DownloadPDFBtId').addClass('btn-info');
                $('#DownloadPDFBtId').removeClass('btn-danger');
                $('#DownloadPDFBtId').prop('disabled', false);
                
                // Confirm create marker.
                confirmPlacemark()
            },
            MultiSelect: function() {
                $('#SelectBtId').addClass('btn-info' );
                $('#SelectBtId').removeClass('btn-danger');
                $('#SelectBtId').prop('disabled', false);

                $('#MultiselectBtId').addClass('btn-danger');
                $('#MultiselectBtId').removeClass('btn-info');
                $('#MultiselectBtId').prop('disabled', false);

                $('#PlacemarkBtId').removeClass('btn-info');
                $('#PlacemarkBtId').removeClass('btn-danger');
                $('#PlacemarkBtId').prop('disabled', true);

                $('#TransferBtId').removeClass('btn-info');
                $('#TransferBtId').removeClass('btn-danger');
                $('#TransferBtId').prop('disabled', true);

                $('#ConfirmLocationBtId').removeClass('btn-info');
                $('#ConfirmLocationBtId').removeClass('btn-danger');
                $('#ConfirmLocationBtId').prop('disabled', true);

                $('#DragBoxBtId').removeClass('btn-info');
                $('#DragBoxBtId').removeClass('btn-danger');
                $('#DragBoxBtId').prop('disabled', true);

                $('#SortingBtId').removeClass('btn-info');
                $('#SortingBtId').removeClass('btn-danger');
                $('#SortingBtId').prop('disabled', true);

                $('#DeleteBtId').removeClass('btn-info');
                $('#DeleteBtId').removeClass('btn-danger');
                $('#DeleteBtId').prop('disabled', true);

                $('#DownloadPDFBtId').addClass('btn-info');
                $('#DownloadPDFBtId').removeClass('btn-danger');
                $('#DownloadPDFBtId').prop('disabled', false);

            },
            Placemark: function() {
                $("[data-rel=popover]").popover('hide');

                $('#SelectBtId').addClass('btn-info' );
                $('#SelectBtId').removeClass('btn-danger');
                $('#SelectBtId').prop('disabled', false);

                $('#MultiselectBtId').removeClass('btn-info');
                $('#MultiselectBtId').removeClass('btn-danger');
                $('#MultiselectBtId').prop('disabled', true);

                $('#PlacemarkBtId').addClass('btn-danger');
                $('#PlacemarkBtId').removeClass('btn-info');
                $('#PlacemarkBtId').prop('disabled', false);

                $('#TransferBtId').removeClass('btn-info');
                $('#TransferBtId').removeClass('btn-danger');
                $('#TransferBtId').prop('disabled', true);

                $('#ConfirmLocationBtId').removeClass('btn-info');
                $('#ConfirmLocationBtId').removeClass('btn-danger');
                $('#ConfirmLocationBtId').prop('disabled', true);

                $('#DragBoxBtId').removeClass('btn-info');
                $('#DragBoxBtId').removeClass('btn-danger');
                $('#DragBoxBtId').prop('disabled', true);

                $('#SortingBtId').removeClass('btn-info');
                $('#SortingBtId').removeClass('btn-danger');
                $('#SortingBtId').prop('disabled', true);

                $('#DeleteBtId').removeClass('btn-info');
                $('#DeleteBtId').removeClass('btn-danger');
                $('#DeleteBtId').prop('disabled', true);

                $('#DownloadPDFBtId').addClass('btn-info');
                $('#DownloadPDFBtId').removeClass('btn-danger');
                $('#DownloadPDFBtId').prop('disabled', false);
            },
            Transfer: function() {
                $("[data-rel=popover]").popover('hide');

                $('#SelectBtId').addClass('btn-info' );
                $('#SelectBtId').removeClass('btn-danger');
                $('#SelectBtId').prop('disabled', false);

                $('#MultiselectBtId').removeClass('btn-info');
                $('#MultiselectBtId').removeClass('btn-danger');
                $('#MultiselectBtId').prop('disabled', true);

                $('#PlacemarkBtId').addClass('btn-info');
                $('#PlacemarkBtId').removeClass('btn-danger');
                $('#PlacemarkBtId').prop('disabled', false);

                $('#TransferBtId').addClass('btn-danger');
                $('#TransferBtId').removeClass('btn-info');
                $('#TransferBtId').prop('disabled', false);

                $('#ConfirmLocationBtId').removeClass('btn-info');
                $('#ConfirmLocationBtId').removeClass('btn-danger');
                $('#ConfirmLocationBtId').prop('disabled', true);

                $('#DragBoxBtId').removeClass('btn-info');
                $('#DragBoxBtId').removeClass('btn-danger');
                $('#DragBoxBtId').prop('disabled', true);

                $('#SortingBtId').removeClass('btn-info');
                $('#SortingBtId').removeClass('btn-danger');
                $('#SortingBtId').prop('disabled', true);

                $('#DeleteBtId').removeClass('btn-info');
                $('#DeleteBtId').removeClass('btn-danger');
                $('#DeleteBtId').prop('disabled', true);

                $('#DownloadPDFBtId').addClass('btn-info');
                $('#DownloadPDFBtId').removeClass('btn-danger');
                $('#DownloadPDFBtId').prop('disabled', false);
            },
            Confirm: function() {
                $("[data-rel=popover]").popover('hide');

                $('#SelectBtId').addClass('btn-info' );
                $('#SelectBtId').removeClass('btn-danger');
                $('#SelectBtId').prop('disabled', false);

                $('#MultiselectBtId').addClass('btn-info');
                $('#MultiselectBtId').removeClass('btn-danger');
                $('#MultiselectBtId').prop('disabled', false);

                $('#PlacemarkBtId').addClass('btn-info');
                $('#PlacemarkBtId').removeClass('btn-danger');
                $('#PlacemarkBtId').prop('disabled', false);

                $('#TransferBtId').addClass('btn-info');
                $('#TransferBtId').removeClass('btn-danger');
                $('#TransferBtId').prop('disabled', false);

                $('#ConfirmLocationBtId').addClass('btn-danger');
                $('#ConfirmLocationBtId').removeClass('btn-info');
                $('#ConfirmLocationBtId').prop('disabled', false);

                $('#DragBoxBtId').addClass('btn-info');
                $('#DragBoxBtId').removeClass('btn-danger');
                $('#DragBoxBtId').prop('disabled', false);

                $('#SortingBtId').addClass('btn-info');
                $('#SortingBtId').removeClass('btn-danger');
                $('#SortingBtId').prop('disabled', false);

                $('#DeleteBtId').addClass('btn-info');
                $('#DeleteBtId').removeClass('btn-danger');
                $('#DeleteBtId').prop('disabled', false);

                $('#DownloadPDFBtId').addClass('btn-info');
                $('#DownloadPDFBtId').removeClass('btn-danger');
                $('#DownloadPDFBtId').prop('disabled', false);
            },
            DragBox: function() {
                $('#SelectBtId').addClass('btn-info' );
                $('#SelectBtId').removeClass('btn-danger');
                $('#SelectBtId').prop('disabled', false);

                $('#MultiselectBtId').removeClass('btn-info');
                $('#MultiselectBtId').removeClass('btn-danger');
                $('#MultiselectBtId').prop('disabled', true);

                $('#PlacemarkBtId').removeClass('btn-info');
                $('#PlacemarkBtId').removeClass('btn-danger');
                $('#PlacemarkBtId').prop('disabled', true);

                $('#TransferBtId').removeClass('btn-info');
                $('#TransferBtId').removeClass('btn-danger');
                $('#TransferBtId').prop('disabled', true);

                $('#ConfirmLocationBtId').removeClass('btn-info');
                $('#ConfirmLocationBtId').removeClass('btn-danger');
                $('#ConfirmLocationBtId').prop('disabled', true);

                $('#DragBoxBtId').addClass('btn-danger');
                $('#DragBoxBtId').removeClass('btn-info');
                $('#DragBoxBtId').prop('disabled', false);

                $('#SortingBtId').removeClass('btn-info');
                $('#SortingBtId').removeClass('btn-danger');
                $('#SortingBtId').prop('disabled', true);

                $('#DeleteBtId').removeClass('btn-info');
                $('#DeleteBtId').removeClass('btn-danger');
                $('#DeleteBtId').prop('disabled', true);

                $('#DownloadPDFBtId').addClass('btn-info');
                $('#DownloadPDFBtId').removeClass('btn-danger');
                $('#DownloadPDFBtId').prop('disabled', false);
            },
            Sorting: function() {
                $("[data-rel=popover]").popover('hide');

                $('#SelectBtId').addClass('btn-info' );
                $('#SelectBtId').removeClass('btn-danger');
                $('#SelectBtId').prop('disabled', false);

                $('#MultiselectBtId').addClass('btn-info');
                $('#MultiselectBtId').removeClass('btn-danger');
                $('#MultiselectBtId').prop('disabled', false);

                $('#PlacemarkBtId').addClass('btn-info');
                $('#PlacemarkBtId').removeClass('btn-danger');
                $('#PlacemarkBtId').prop('disabled', false);

                $('#TransferBtId').removeClass('btn-info');
                $('#TransferBtId').removeClass('btn-danger');
                $('#TransferBtId').prop('disabled', true);

                $('#ConfirmLocationBtId').removeClass('btn-info');
                $('#ConfirmLocationBtId').removeClass('btn-danger');
                $('#ConfirmLocationBtId').prop('disabled', true);

                $('#DragBoxBtId').addClass('btn-info');
                $('#DragBoxBtId').removeClass('btn-danger');
                $('#DragBoxBtId').prop('disabled', false);

                $('#SortingBtId').addClass('btn-danger');
                $('#SortingBtId').removeClass('btn-info');
                $('#SortingBtId').prop('disabled', false);

                $('#DeleteBtId').removeClass('btn-info');
                $('#DeleteBtId').removeClass('btn-danger');
                $('#DeleteBtId').prop('disabled', true);

                $('#DownloadPDFBtId').addClass('btn-info');
                $('#DownloadPDFBtId').removeClass('btn-danger');
                $('#DownloadPDFBtId').prop('disabled', false);
            },
            Delete: function() {
                $("[data-rel=popover]").popover('hide');

                $('#SelectBtId').addClass('btn-info' );
                $('#SelectBtId').removeClass('btn-danger');
                $('#SelectBtId').prop('disabled', false);

                $('#MultiselectBtId').addClass('btn-info');
                $('#MultiselectBtId').removeClass('btn-danger');
                $('#MultiselectBtId').prop('disabled', false);

                $('#PlacemarkBtId').addClass('btn-info');
                $('#PlacemarkBtId').removeClass('btn-danger');
                $('#PlacemarkBtId').prop('disabled', false);

                $('#TransferBtId').addClass('btn-info');
                $('#TransferBtId').removeClass('btn-danger');
                $('#TransferBtId').prop('disabled', false);

                $('#ConfirmLocationBtId').addClass('btn-info');
                $('#ConfirmLocationBtId').removeClass('btn-danger');
                $('#ConfirmLocationBtId').prop('disabled', false);

                $('#DragBoxBtId').addClass('btn-info');
                $('#DragBoxBtId').removeClass('btn-danger');
                $('#DragBoxBtId').prop('disabled', false);

                $('#SortingBtId').addClass('btn-info');
                $('#SortingBtId').removeClass('btn-danger');
                $('#SortingBtId').prop('disabled', false);

                $('#DeleteBtId').addClass('btn-danger');
                $('#DeleteBtId').removeClass('btn-info');
                $('#DeleteBtId').prop('disabled', false);

                $('#DownloadPDFBtId').addClass('btn-info');
                $('#DownloadPDFBtId').removeClass('btn-danger');
                $('#DownloadPDFBtId').prop('disabled', false);
            },
            DownloadPDF: function() {
                $("[data-rel=popover]").popover('hide');

                $('#SelectBtId').addClass('btn-info' );
                $('#SelectBtId').removeClass('btn-danger');
                $('#SelectBtId').prop('disabled', false);

                $('#MultiselectBtId').addClass('btn-info');
                $('#MultiselectBtId').removeClass('btn-danger');
                $('#MultiselectBtId').prop('disabled', false);

                $('#PlacemarkBtId').addClass('btn-info');
                $('#PlacemarkBtId').removeClass('btn-danger');
                $('#PlacemarkBtId').prop('disabled', false);

                $('#TransferBtId').addClass('btn-info');
                $('#TransferBtId').removeClass('btn-danger');
                $('#TransferBtId').prop('disabled', false);

                $('#ConfirmLocationBtId').addClass('btn-info');
                $('#ConfirmLocationBtId').removeClass('btn-danger');
                $('#ConfirmLocationBtId').prop('disabled', false);

                $('#DragBoxBtId').addClass('btn-info');
                $('#DragBoxBtId').removeClass('btn-danger');
                $('#DragBoxBtId').prop('disabled', false);

                $('#SortingBtId').addClass('btn-info');
                $('#SortingBtId').removeClass('btn-danger');
                $('#SortingBtId').prop('disabled', false);

                $('#DeleteBtId').addClass('btn-info');
                $('#DeleteBtId').removeClass('btn-danger');
                $('#DeleteBtId').prop('disabled', false);

                $('#DownloadPDFBtId').addClass('btn-danger');
                $('#DownloadPDFBtId').removeClass('btn-info');
                $('#DownloadPDFBtId').prop('disabled', false);
            }
        }

        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            e.preventDefault();              
            var tabActiveIndex = $($(this).attr('href')).index();
            //console.log(tabActiveIndex);
            if (tabActiveIndex == 1) {
                createCookie('EnableMapFeature', 'true', 1);
                enableMapFeatureFunc();
                if (ShowMapToggle == 0) {
                    RenderGeometryStorageLocations();
                    ShowMapToggle = 1;
                }  
            }
        });

        function UpdateFeaturesByChangeSelectList(data)
        {
            let featuresArray = WmsOplMapObj.SelectFeatures;
            for (var i = 0; i < featuresArray.length; i++) {
                let featureObj = featuresArray[i];
                if (featureObj.get("Container") == data.deselected) {
                    //console.log('Found Item.');
                    WmsOplMapObj.SelectFeatures.splice(i, 1);
                    break;
                }
            } // exit for
            //console.log(WmsOplMapObj.SelectFeatures);
            WmsOplMapObj.addListTag();
        }

        // Extend a Function of dragBox event.
        createInteractionObj.Interactions.dragBox.on('boxend', function(e) {
            //console.log('OnBoxEnd...');
            ListTagInfo();
            $('#dialog-message').dialog('open');
         });
    
        $("#ListTagId").chosen().change(function (e, data) {
            //console.log(data);
            UpdateFeaturesByChangeSelectList(data);
        });
        
        $("#dialogListTagId").chosen().change(function (e, data) {
            //console.log(data);
            UpdateFeaturesByChangeSelectList(data);
        });

        //$("#InitDelegateEventId").click(function (e) {
        //    e.preventDefault();
        //    $.each($(".TagNameClass"), function () {
        //        var attrId = $(this).attr("Id");
        //        var attrTagName = $(this).attr("attrTagName");
        //        //console.log(attrId);
        //        //console.log(attrTagName);

        //        $("#" + attrId).unbind('click');
        //        $("#" + attrId).bind("click", function () {
        //            goToByScroll('map');
        //            FindTagInOnMap(attrTagName);                    
        //        });
        //    });
        //});

        $("#InitDelegateEventId").on('click', function (e, data) {
            e.preventDefault();
            console.log("Find tag : " + data.TagName);
            goToByScroll('map');
            FindTagInOnMap(data.TagName); 
        });
        
        $('#SelectBtId').click(function (e) {
            e.preventDefault();
            evnetControl.Select();

            WmsOplMapObj.setInteraction('transform');
            WmsOplMapObj.Interactions.transform.set('scale', false);
            WmsOplMapObj.MultiSelect = false;   
        });

        //let MultiselectToggle = 0;
        $('#MultiselectBtId').click(function (e) {
            e.preventDefault();
            evnetControl.MultiSelect();

            WmsOplMapObj.MultiSelect = true;
        });

        $('#PlacemarkBtId').click(function (e) {
            e.preventDefault();
            evnetControl.Placemark();

            WmsOplMapObj.ActivePlacemarkLngLat = true;
        });

        $('#TransferBtId').click(function (e) {
            e.preventDefault();
            evnetControl.Transfer();

            let result = tagTransfer();
            if (result == true) {
                $('#ClearBtId').trigger('click');
                $('#SelectBtId').trigger('click');
            }
        });

        $('#DeleteBtId').click(function (e) {
            e.preventDefault();
            evnetControl.Delete();

            if (WmsOplMapObj.SelectFeatures.length == 0) { return; }  

            var modal = bootbox.dialog({
                message: "Are you sure you want to delete this item?",
                title: "Delete",
                buttons: {
                    cancel: {
                        label: "Cancel",
                        callback: function () {
                        }
                    },
                    ok: {
                        label: "OK",
                        className: 'btn-info',
                        callback: function () {
                            //console.log("Remove features... " + WmsOplMapObj.ActiveFeatures.get('Id'));
                            
                            let featuresArray = WmsOplMapObj.SelectFeatures;
                            for (var i = 0; i < featuresArray.length; i++) {
                                let featureObj = featuresArray[i];
                                WmsOplMapObj.deleteSketchGeometry(GlobalDeleteSketchGeometryUrl, featureObj.get('Id'));
                            } // exit for

                            $('#ClearBtId').trigger('click');
                            $('#SelectBtId').trigger('click');

                        } // end callback
                    }
                },
                onEscape: function () {

                }
            });

            modal.modal("show");

        });

        $('#DownloadPDFBtId').click(function (e) {
            e.preventDefault();
            evnetControl.DownloadPDF();
            
            /* On print > save image file */
            printControl.on('print', function (e) {
                $('body').css('opacity', 1);
                if (e.canvas) {
                    if (e.pdf) {
                        // Export pdf using the print info
                        var pdf = new jsPDF({
                            orientation: e.print.orientation,
                            unit: e.print.unit,
                            format: e.print.format
                        });
                        pdf.addImage(e.image, 'JPEG', e.print.position[0], e.print.position[0], e.print.imageWidth, e.print.imageHeight);
                        pdf.save();
                    }
                } else {
                    console.warn('No canvas to export');
                }
            });

            printControl.print({ imageType: 'image/jpeg', pdf: true });
        });

        $('#ConfirmLocationBtId').click(function (e) {
            e.preventDefault();
            evnetControl.Confirm();

            confirmLocation();
        });

        $('#ClearBtId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.ClearMap();
            WmsOplMapObj.PlacemarkLngLatValue = null;                              
            WmsOplMapObj.MultiSelect = false;
            WmsOplMapObj.SelectFeatures = [];
            WmsOplMapObj.setInteraction('transform');

            $("#ListTagId").find('option').remove();
            $('#ListTagId').trigger("chosen:updated");  
            $("#dialogListTagId").find('option').remove();
            $('#dialogListTagId').trigger("chosen:updated");              
            $('#MapInfoId').summernote('code', '');
            $('#ListMarkerId').val('').trigger("chosen:updated"); 
            $('#SelectBtId').trigger('click');
        });

        let DragBoxToggle = 0;
        $('#DragBoxBtId').click(function(e) {
            e.preventDefault();
            evnetControl.DragBox();

            WmsOplMapObj.setInteraction('dragBox');
        });

        $('#SortingBtId').click(function(e){  
            e.preventDefault();   
            evnetControl.Sorting();  
            
            sortingGroups();            
        });

        $('#ConfirmSortingPropertyId').click(function(e) {
            e.preventDefault();
            $('#mdSortingPropertyId').modal('hide');
            PartSortingByParameter();
            $('#ClearBtId').trigger('click');
            $('#SelectBtId').trigger('click');
        });

        $('#SearchTagBtId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.showSearchObject();
        });

        $('#SearchTagGroupBtId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.showSearchGroupObject();
        });

        $('#SelectTagBtId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.showMoveGroupObject();
        });   
        
        $('#LocationTransferBtId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.showActiveGeoMarker();
        });

        $('#ScaleBtId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.Interactions.transform.set('scale', true);
        });

        $('#RemoveGridBtId').hide();
        $('#GridBtId').click(function (e) {
            e.preventDefault();
            $('#GridBtId').hide();
            $('#RemoveGridBtId').show();
            WmsOplMapObj.createStoreAreaGridReference();
        });

        $('#RemoveGridBtId').click(function (e) {
            e.preventDefault();
            $('#GridBtId').show();
            $('#RemoveGridBtId').hide();
            WmsOplMapObj.removeStoreAreaGridReference();
        });
    
        let HKToggle = 0;
        $('#SelectMarkerId').hide();
        $('#SelectListTagId').hide();
        $('#ScaleBtId').hide();
        $('#SearchTagBtId').hide(); 
        $('#SearchTagGroupBtId').hide();     
        $('#DeleteBtId').hide(); 
        $('body').bind('keydown', 'Alt+/',function (evt){
            HKToggle = swap(HKToggle);            
            if (HKToggle == 1){
                $('#SelectMarkerId').show();
                $('#SelectMarkerId').css('visibility', 'visible');                 

                $('#SelectListTagId').show();
                $('#SelectListTagId').css('visibility', 'visible');                 

                $('#ScaleBtId').show();
                $('#ScaleBtId').css('visibility', 'visible');

                $('#SearchTagBtId').show();
                $('#SearchTagBtId').css('visibility', 'visible');

                $('#SearchTagGroupBtId').show();
                $('#SearchTagGroupBtId').css('visibility', 'visible');

                $('#DeleteBtId').show();
                $('#DeleteBtId').css('visibility', 'visible');
            } else {
                $('#SelectMarkerId').hide();
                $('#SelectMarkerId').css('visibility', 'hidden'); 
                
                $('#SelectListTagId').hide();
                $('#SelectListTagId').css('visibility', 'hidden'); 
                                                  
                $('#ScaleBtId').hide();
                $('#ScaleBtId').css('visibility', 'hidden');

                $('#SearchTagBtId').css('visibility', 'hidden');
                $('#SearchTagBtId').hide();
                
                $('#SearchTagGroupBtId').css('visibility', 'hidden');
                $('#SearchTagGroupBtId').hide();
                
                $('#DeleteBtId').css('visibility', 'hidden');
                $('#DeleteBtId').hide();                
            }          
        });
        
        var $div = $('<div />').appendTo('body');
        $div.attr('id', 'fullScreenControlId');
        $div.hide();
        var divFullScreenControl = document.querySelector('#fullScreenControlId');
        var fullScreenControl = new ol.control.FullScreen({ target: divFullScreenControl });
        OplMapObj.map.addControl(fullScreenControl);
        $('#FullScreenBtId').click(function (e) {
            e.preventDefault();
            $('.ol-full-screen-false').trigger("click");
        });

    }

    if ((CurrentController.toUpperCase() == "PART") && (CurrentAction.toUpperCase() == "MANAGE")) {

        let lngOrg = DefaultPartLng;
        let latOrg = DefaultPartLat;
        let zoomOrg = DefaultPartZoom;
        let OplMapObj = new OplMap(DefaultMapId, latOrg, lngOrg, zoomOrg);  //id, lat, lng, zoom

        let ShowMapToggle = 0;

        // Scale control
        OplMapObj.createScaleControl();

        // Main control bar
        //var settingArray = [];
        //OplMapObj.createControlBar(settingArray);

        // ol-contextmenu
        //OplMapObj.contextmenuItems();

        // Create PP Location on map.
        var WmsOplMapObj = new WmsOplMap(OplMapObj);

        // Create PP map.
        //var PPOplMapObj = new PPOplMap(OplMapObj, WmsOplMapObj);
        //var ppSettingArray = [];
        //PPOplMapObj.createPPOplMap(ppSettingArray);

        var wmsSettingArray = ['FullScreenControl'];
        WmsOplMapObj.createWmsOplMap(wmsSettingArray);

        // Set tool bar location.
        OplMapObj.mainbar.setPosition('top-left');

        WmsOplMapObj.createInteraction(false);

        $('#DivMapId').hide();

        // Add a fill color.        
        var fillColorToggleBt = new ol.control.Toggle({
            html: '<div id="chgcolor"><i class="fa fa-paint-brush"></i></div>',
            title: 'Select color',
            interaction: new ol.interaction.Select(),
            active: false,
            onToggle: function (active) {
                if (active == true) {
                    //console.log("activated...");
                } else if (active == false) {
                    //console.log("deactivated...");
                    $(".colorpicker").removeClass("colorpicker-visible");
                    let Feature = WmsOplMapObj.ActiveFeatures;
                    if (Feature != null) {
                        //console.log("Change color..." + $("#PnColorId").val());
                        let StrokeColor = $("#PnColorId").val();
                        let FillColor = $("#PnColorId").val();
                        RenderFunc(StrokeColor, FillColor);
                    }
                }
            },
            bar: new ol.control.Bar({
                controls: [
                    new ol.control.Button({
                        html: '<div id="cpId" class="input-group colorpicker-component" style="margin-top:0px"><input type="text" name="PnColor" id="PnColorId" value="" class="form-control" style="width: 80px;" /><span class="input-group-addon"><i></i></span></div>',
                        //className: 'red',
                        handleClick: function () {
                        }
                    })
                ]
            })
        });
        OplMapObj.mainbar.addControl(fillColorToggleBt);

        $("#cpId").colorpicker({
            format: 'hex',
            colorSelectors: {
                'black': '#000000',
                'white': '#ffffff',
                'red': '#FF0000',
                'default': '#777777',
                'primary': '#337ab7',
                'success': '#5cb85c',
                'info': '#5bc0de',
                'warning': '#f0ad4e',
                'danger': '#d9534f'
            }
        })
       .on('changeColor', function (e) {
           $('#chgcolor')[0].style.backgroundColor = e.color.toHex();                        
       });

        function RenderDimension(Id, StrokeColor, FillR, FillG, FillB, Width, Length, DimensionUpdate) {

            if ((Width != "") && (Length != "")) {

                let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
                let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
                if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
                if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }

                let source = OplMapObj.vectorLayer.getSource();
                let squareObj = source.getFeatureById("DRAWID" + Id);
                if (squareObj != null) { source.removeFeature(squareObj); }

                let jsonLatLng = [{ lat: 13.453461841957179, lng: 100.60750438812147 }];
                let lng = parseFloat(jsonLatLng[0].lng);
                let lat = parseFloat(jsonLatLng[0].lat);
                let accLng = 0;
                let accLat = 0;
                let zoomVal = 1;
                if (Width <= 49) {
                    zoomVal = 28;
                    accLng = (lng + (0.0000001 * 20)); // cm
                    accLat = (lat - (0.0000001 * 10)); // cm
                } else if ((Width >= 50) && (Width <= 99)) {
                    zoomVal = 25;
                    accLng = (lng + (0.0000001 * 150)); // cm
                    accLat = (lat - (0.0000001 * 80)); // cm
                } else if ((Width >= 100) && (Width <= 499)) {
                    zoomVal = 24;
                    accLng = (lng + (0.0000001 * 300)); // cm
                    accLat = (lat - (0.0000001 * 150)); // cm
                } else if ((Width >= 500) && (Width <= 999)) {
                    zoomVal = 22;
                    accLng = (lng + (0.0000001 * 1200)); // cm
                    accLat = (lat - (0.0000001 * 600)); // cm
                } else if ((Width >= 1000) && (Width <= 1499)) {
                    zoomVal = 21;
                    accLng = (lng + (0.0000001 * 2400)); // cm
                    accLat = (lat - (0.0000001 * 1200)); // cm
                } else if ((Width >= 1500) && (Width <= 1999)) {
                    zoomVal = 20;
                    accLng = (lng + (0.0000001 * 4700)); // cm
                    accLat = (lat - (0.0000001 * 2500)); // cm
                } else if (Width >= 2000) {
                    zoomVal = 19;
                    accLng = (lng + (0.0000001 * 10000)); // cm
                    accLat = (lat - (0.0000001 * 5000)); // cm
                }
                var destinationPoint = ol.proj.fromLonLat([accLng, accLat]);
                OplMapObj.map.getView().setCenter(destinationPoint, 'EPSG:4326', 'EPSG:3857');

                OplMapObj.map.getView().setZoom(zoomVal);	
                WmsOplMapObj.createSquare(jsonLatLng, "DRAWID" + Id, Width, Length, "", StrokeColor, 2, FillR, FillG, FillB, 0.5);

                if (DimensionUpdate == true) {

                    squareObj = source.getFeatureById("DRAWID" + Id);
                    if (squareObj != null) {
                        //console.log(squareObj.getGeometry().getCoordinates());  

                        let GeoCoordinates = squareObj.getGeometry().getCoordinates();
                        let strGeoCoordinates = "";
                        for (var i = 0; i < GeoCoordinates.length; i++) {
                            var coord = GeoCoordinates[i];
                            for (var j = 0; j < coord.length; j++) {
                                let coordItem = ol.proj.transform(coord[j], 'EPSG:3857', 'EPSG:4326');
                                let lng = coordItem[0];
                                let lat = coordItem[1];
                                strGeoCoordinates += "," + lng + ":" + lat;
                            }
                        }
                        strGeoCoordinates = strGeoCoordinates.substring(1, strGeoCoordinates.length);
                        //console.log(strGeoCoordinates);

                        let PostData = new FormData();
                        PostData.append("PartId", Id);
                        PostData.append("StrokeColor", StrokeColor);
                        PostData.append("FillR", FillR);
                        PostData.append("FillG", FillG);
                        PostData.append("FillB", FillB);
                        PostData.append("GeoCoordinates", strGeoCoordinates);

                        CallServicesWithFormData(GlobalCreateOrUpdatePartDimensionUrl, false, PostData, function (data) {
                            let jsonObj = jQuery.parseJSON(data);
                            //console.log(jsonObj);

                            // Render Geometry via web service.
                            //let source = OplMapObj.vectorLayer.getSource();
                            //let squareObj = source.getFeatureById("DRAWID" + Id);
                            //if (squareObj != null) { source.removeFeature(squareObj); }
                            //WmsOplMapObj.renderGeometry(Id, jsonObj);

                            //let destinationPoint = ol.proj.fromLonLat([jsonObj.Geometry.GeoCoordinates[0].Longitude, jsonObj.Geometry.GeoCoordinates[0].Latitude]);
                            //OplMapObj.goToCoord(destinationPoint[0], destinationPoint[1], 28);
                        });
                    }
                } // Dimension Update 
            }
        }

        function RenderGeometryStorageLocations() {
            let MarkerEnableSelect = false;
            let MarkerEnableDelete = false;
            let LineStringEnableSelect = false;
            let LineStringEnableDelete = false;
            let PolygonEnableSelect = false;
            let PolygonEnableDelete = false;

            // Render geometry storage locations : Warehouse
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Warehouser, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Zone
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Zone, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Rack
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Rack, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Location
            MarkerEnableSelect = false;
            MarkerEnableDelete = false;
            PolygonEnableSelect = false;
            PolygonEnableDelete = false;            
            WmsOplMapObj.renderGeometryByLocation(GlobalRenderGeometryByLocationUrl, Location,
                                                  MarkerEnableSelect, MarkerEnableDelete,
                                                  PolygonEnableSelect, PolygonEnableDelete);

            WmsOplMapObj.renderLocationMarker(GlobalGetLocationMvToLngLatUrl);
        }

        function enableMapFeatureFunc() {
            var enableMapFeature = readCookie('EnableMapFeature');
            //console.log(enableMapFeature);
            if (enableMapFeature == 'false') {
                $('#DivDimensionId').hide();
                $('#ShowMapBtId').show();
                $('#HideMapBtId').hide();
            } else {
                $('#DivDimensionId').css('visibility', 'visible'); // visible : hidden
                $('#DivDimensionId').show();
                $('#ShowMapBtId').hide();
                $('#HideMapBtId').show();              
            }           
        }

        function RenderFunc(StrokeColorParm, FillColorParm) {

            let rdStorageObj = $("input[name='rdStorage']:checked");
            let attrStorageTypeId = rdStorageObj.attr("attrStorageTypeId");
            let attrPn = rdStorageObj.attr("attrPn");
            let attrWidth = rdStorageObj.attr("attrWidth");
            let attrLength = rdStorageObj.attr("attrLength");
            let attrHeight = rdStorageObj.attr("attrHeight");
            let attrStatusDefault = rdStorageObj.attr("attrStatusDefault");
            //console.log(attrStorageTypeId + "," + attrPn + "," + attrWidth + "," + attrLength + "," + attrHeight + "," + attrStatusDefault);

            let PartId = $("#Id").val();
            let Width = attrWidth;
            let Length = attrLength;
            let Height = attrHeight;
            let LengthUnit = 0;
            let StrokeColor = StrokeColorParm;
            let FillColor = FillColorParm;

            let FillR = hexToRgb(FillColor).r;
            let FillG = hexToRgb(FillColor).g;
            let FillB = hexToRgb(FillColor).b;

            let StatusDefaultVal = false;
            if (attrStatusDefault == "Yes") { StatusDefaultVal = true; }
            RenderDimension(PartId, StrokeColor, FillR, FillG, FillB, Width, Length, StatusDefaultVal);
        }

        //$('#DivDimensionId').hide();
        $('#ShowMapBtId').click(function (e) {
            e.preventDefault();
            createCookie('EnableMapFeature', 'true', 1);
            enableMapFeatureFunc();
            if (ShowMapToggle == 0) {
                RenderGeometryStorageLocations();
                ShowMapToggle = 1;
            }
        });

        $('#HideMapBtId').click(function (e) {
            e.preventDefault();
            createCookie('EnableMapFeature', 'false', 1);
            enableMapFeatureFunc();
        });    

        $("#RenderBtId").click(function (e) {
            e.preventDefault();

            // init data...
            var StrokeColor = "#6f79e0";
            var FillColor = "#6f79e0";
            var PostData = new FormData();
            PostData.append("RefKey", $("#Name").val());
            CallServicesWithFormData(GlobalGetGeometryByRefKeyUrl, false, PostData, function (data) {
                let jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);
                if (jsonObj != null) {
                    StrokeColor = jsonObj.GeoProperties[0].StrokeColor;
                    FillColor = jsonObj.GeoProperties[0].StrokeColor;
                }
            });

            $.each($(".classMapBt"), function () {
                var attrStorageTypeId = $(this).attr("attrStorageTypeId");
                //console.log(attrStorageTypeId);

                $("#MapId" + attrStorageTypeId).bind("click", function (event, param) {                    
                    if (param == "SetDefault") {
                        RenderFunc(StrokeColor, FillColor);
                    } else {
                        ShowMapToggle = swap(ShowMapToggle);
                        if (ShowMapToggle == 1) {
                            var isChecked = $("input[name='rdStorage']:checked").val();
                            if (isChecked == "on") {
                                $('#DivMapId').css('visibility', 'visible'); // visible : hidden
                                $('#DivMapId').show();
                                RenderFunc(StrokeColor, FillColor);
                            }
                        } else {
                            $('#DivMapId').css('visibility', 'hidden'); // visible : hidden
                            $('#DivMapId').hide();
                        }
                    }                    
                });
            });
        });
    }

    if ((CurrentController.toUpperCase() == "WAREHOUSE") && (CurrentAction.toUpperCase() == "MANAGE")) {

        // Set map center.
        let PostData = new FormData();
        PostData.append("RefKey", $("input[name='Id']").val());
        CallServicesWithFormData(GlobalGetMarkerCenterUrl, false, PostData, function (data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);
            if (jsonObj.GeoCoordinates != null)
            {
                if (jsonObj.GeoCoordinates.length > 0)
                {
                    DefaultLat = jsonObj.GeoCoordinates[0].Latitude;
                    DefaultLng = jsonObj.GeoCoordinates[0].Longitude;
                    //console.log(DefaultLat, DefaultLng);
                }
            }
            if (jsonObj.GeoProperties != null)
            {
                if (jsonObj.GeoProperties.length > 0)
                {
                    DefaultZoom = jsonObj.GeoProperties[0].Zoom;
                }
            }
        });

        var OplMapObj = new OplMap(DefaultMapId, DefaultLat, DefaultLng, DefaultZoom);

        // Scale control
        OplMapObj.createScaleControl();

        // Main control bar
        //var settingArray = [];
        //OplMapObj.createControlBar(settingArray);

        // Create WMS map.
        var WmsOplMapObj = new WmsOplMap(OplMapObj);

        // Create PP map.
        //var PPOplMapObj = new PPOplMap(OplMapObj, WmsOplMapObj);
        //var ppSettingArray = ['ShowPPGeoBookmark'];
        //PPOplMapObj.createPPOplMap(ppSettingArray);

        var wmsSettingArray = [];
        WmsOplMapObj.createWmsOplMap(wmsSettingArray);
        let createInteractionObj = WmsOplMapObj.createInteraction(false);

        // Remove main bar...
        OplMapObj.map.removeControl(OplMapObj.mainbar);

        function RenderGeometryStorageLocations() {
            let MarkerEnableSelect = true;
            let MarkerEnableDelete = true;
            let LineStringEnableSelect = true;
            let LineStringEnableDelete = true;
            let PolygonEnableSelect = true;
            let PolygonEnableDelete = true;

            // Render geometry storage locations.
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Warehouser, $("input[name='Id']").val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);
            // Render geometry storage locations : Marker
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Marker, $("input[name='Id']").val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);
        }

        function enableMapFeatureFunc() {
            var enableMapFeature = readCookie('EnableMapFeature');
            //console.log(enableMapFeature);
            if (enableMapFeature == 'false') {
                $('#DivWarehouseLoactionId').hide();
                $('#ShowMapBtId').show();
                $('#HideMapBtId').hide();
            } else {
                $('#DivWarehouseLoactionId').css('visibility', 'visible'); // visible : hidden
                $('#DivWarehouseLoactionId').show();
                $('#ShowMapBtId').hide();
                $('#HideMapBtId').show();
            }
        }

        // Extend a Function of dragBox event.
        createInteractionObj.Interactions.transform.on('select', function(e) {
            let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
            let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
            if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
            if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }

            let activeFeatureObj = WmsOplMapObj.ActiveFeatures;
            if (activeFeatureObj == null) { return; }
            if (activeFeatureObj.get('RefGrpKey') != "Square") { return; }

            let geoCoordinates = activeFeatureObj.getGeometry().getCoordinates();
            if (geoCoordinates == null) { return; }
            if (geoCoordinates[0].length <= 3)  { return; }

            let coord0 = geoCoordinates[0][0];
            let coord1 = geoCoordinates[0][1];
            let coord2 = geoCoordinates[0][2];
            let coord3 = geoCoordinates[0][3];
            let coord4 = geoCoordinates[0][4];

            let MeasureWidth = WmsOplMapObj.measureCoord(coord0, coord1);
            let MeasureLength = WmsOplMapObj.measureCoord(coord1, coord2);
            //console.log(MeasureWidth);
            //console.log(MeasureLength);

            let GeometryId = activeFeatureObj.get("Id");
            let PostData = new FormData();
            PostData.append("GeometryId", GeometryId);
            CallServicesWithFormData(GlobalGetGeometryUrl, false, PostData, function (data) {
                var jsonObj = jQuery.parseJSON(data);

                let StrokeColor = jsonObj.GeoProperties[0].StrokeColor;
                let StrokeWidth = jsonObj.GeoProperties[0].StrokeWidth;
                let FillR = jsonObj.GeoProperties[0].FillR;
                let FillG = jsonObj.GeoProperties[0].FillG;
                let FillB = jsonObj.GeoProperties[0].FillB;
                let FillOpacity = jsonObj.GeoProperties[0].FillOpacity;

                // get Latitude and Longitude                
                let lnglat;
                if (geoCoordinates[0].length == 4) 
                {
                    lnglat = ol.proj.transform(geoCoordinates[0][0], 'EPSG:3857', 'EPSG:4326');
                } else if  (geoCoordinates[0].length == 5) {
                    lnglat = ol.proj.transform(geoCoordinates[0][2], 'EPSG:3857', 'EPSG:4326');                    
                }                                
                let jsonLatLng = [{ lat: lnglat[1], lng: lnglat[0] }];   
                let featureObj = WmsOplMapObj.createSquare(jsonLatLng, activeFeatureObj.getId(), MeasureWidth, MeasureLength, "", StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);
            });
        });

        //$('#DivWarehouseLoactionId').hide();
        $('#ShowMapBtId').click(function (e) {
            e.preventDefault();
            ajaxindicatorstart();
            createCookie('EnableMapFeature', 'true', 1);
            enableMapFeatureFunc();
            if (ShowMapToggle == 0) {
                RenderGeometryStorageLocations();
                ShowMapToggle = 1;
            }
            ajaxindicatorstop();
        });

        $('#HideMapBtId').click(function (e) {
            e.preventDefault();
            createCookie('EnableMapFeature', 'false', 1);
            enableMapFeatureFunc();
        });  

        $('#MeasureId').click(function (e) {
            let InpuData = { }
            WmsOplMapObj.setInteraction('lineMeasureTooltip', InpuData);
        });

        $('#SelectId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.setInteraction('transform');
            WmsOplMapObj.Interactions.transform.set('scale', false);
            $('#PlacemarkBtId').show();
            $('#ConfirmPlacemarkBtId').hide();

            let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
            let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
            if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
            if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }

            WmsOplMapObj.ActivePlacemarkLngLat = false;
            WmsOplMapObj.ClearMap();
        });

        $('#LineStringId').click(function (e) {
            e.preventDefault();

            let InpuData = {
                GeometryId: '',
                GeoType: Warehouser,
                RefGrpKey: 'LineString',
                RefKey: $("input[name='Id']").val(),
                Name: $('#Name').val(),
                Description: $('#Description').val(),
                IsActive: true,
                StrokeColor: '',
                FillR: '',
                FillG: '',
                FillB: '',
                GeoCoordinates: ''
            }
            WmsOplMapObj.setInteraction('draw', InpuData);

        });

        $('#PolygonId').click(function (e) {
            e.preventDefault();

            let InpuData = {
                GeometryId: '',
                GeoType: Warehouser,
                RefGrpKey: 'Polygon',
                RefKey: $("input[name='Id']").val(),
                Name: $('#Name').val(),
                Description: $('#Description').val(),
                IsActive: true,
                StrokeColor: '',
                FillR: '',
                FillG: '',
                FillB: '',
                GeoCoordinates: ''
            }
            WmsOplMapObj.setInteraction('drawPolygon', InpuData);

        });

        $('#SquareId').click(function (e) {
            e.preventDefault();

            let InpuData = {
                GeometryId: '',
                GeoType: Warehouser,
                RefGrpKey: 'Square',
                RefKey: $("input[name='Id']").val(),
                Name: $('#Name').val(),
                Description: $('#Description').val(),
                IsActive: true,
                StrokeColor: '',
                FillR: '',
                FillG: '',
                FillB: '',
                GeoCoordinates: ''
            }
            WmsOplMapObj.setInteraction('drawRegular', InpuData);

        });

        $('#OffSetId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.setInteraction('offset');
        });

        $('#FillColorId').click(function (e) {
            e.preventDefault();

            let GeometryId = WmsOplMapObj.ActiveFeatures.get('Id');
            let StrokeColor = $("#FillFeatureColorColorId").val();
            let FillColor = $("#FillFeatureColorColorId").val();
            if ((StrokeColor == "") || (FillColor == "")) return false;
            let FillR = hexToRgb(FillColor).r;
            let FillG = hexToRgb(FillColor).g;
            let FillB = hexToRgb(FillColor).b;
            let Feature = WmsOplMapObj.ActiveFeatures;
            let Type = WmsOplMapObj.ActiveFeatures.get('RefGrpKey');
            let FillOpacity = 0.5;
            let StrokeWidth = 1;
            WmsOplMapObj.setFeatureColor(Feature, Type, "", StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);

            let PostData = new FormData();
            PostData.append("GeometryId", GeometryId);
            PostData.append("StrokeColor", StrokeColor);
            PostData.append("StrokeWidth", StrokeWidth);
            PostData.append("FillR", FillR);
            PostData.append("FillG", FillG);
            PostData.append("FillB", FillB);
            PostData.append("FillOpacity", FillOpacity);

            CallServicesWithFormData(GlobalUpdateGeoPropertiesUrl, false, PostData, function (data) {
                var jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);
            });

        });

        $('#TransformId').click(function (e) {
            e.preventDefault();

            WmsOplMapObj.setInteraction('transform');
            WmsOplMapObj.Interactions.transform.set('scale', true);
        });

        $('#ModifyId').click(function (e) {
            e.preventDefault();

            WmsOplMapObj.setInteraction('modifyfeature');
        });

        $('#DeleteId').click(function (e) {
            e.preventDefault();

            WmsOplMapObj.deleteGeometryActiveFeatures();
        });

        $('#ConfirmPlacemarkBtId').hide();
        $('#PlacemarkBtId').click(function (e) {
            e.preventDefault();
            $('#PlacemarkBtId').hide();
            $('#ConfirmPlacemarkBtId').show();
            WmsOplMapObj.ActivePlacemarkLngLat = true;
        });

        $('#ConfirmPlacemarkBtId').click(function (e) {
            e.preventDefault();
            $('#PlacemarkBtId').show();
            $('#ConfirmPlacemarkBtId').hide();
            WmsOplMapObj.ActivePlacemarkLngLat = false;

            if (WmsOplMapObj.PlacemarkLngLatValue == null) return;
            let MarkerLng = WmsOplMapObj.PlacemarkLngLatValue[0];
            let MarkLat = WmsOplMapObj.PlacemarkLngLatValue[1];

            let GeometryId = '';
            let GeoType = Marker;
            let RefGrpKey = 'Marker';
            let RefKey = $("input[name='Id']").val();
            let Name = '';
            let Description = '';
            let IsActive = true;
            let StrokeColor = '';
            let FillR = '';
            let FillG = '';
            let FillB = '';
            let GeoCoordinates = [[MarkerLng, MarkLat]];
            let jsonObj = WmsOplMapObj.createOrUpdateDraw(GeometryId, GeoType, RefGrpKey, RefKey, Name, Description, IsActive, StrokeColor, FillR, FillG, FillB, GeoCoordinates);
            //console.log(jsonObj);
            if (jsonObj.Result == true) {
                let DrawId = "DRAWID" + jsonObj.Geometry.Id;
                var markerObj = OplMapObj.addMarker(MarkLat, MarkerLng, DrawId, "");
                markerObj.setProperties({
                    'Id': jsonObj.Geometry.Id,
                    'Type': 'Marker',
                    'EnableDelete': true,
                    'RefGrpKey': jsonObj.Geometry.RefGrpKey,
                    'RefKey': jsonObj.Geometry.RefKey,
                    'Container': '',
                    'SketchGeoCoordinates': ''
                });
            }

            $(".placemarkLngLatClass").remove();
        });

        $("#MapPropertyId").click(function (e) {
            e.preventDefault();

            let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
            let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
            if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
            if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }

            if (WmsOplMapObj.ActiveFeatures == null) return;

            // Clear interface...
            $("#PropNameId").val('');
            $("#PropDescId").val('');
            $("#PropStrokeColorId").val('');
            $("#PropStrokeWidthId").val('');
            $("#PropFillColorId").val('');
            $("#PropOpacityId").val('');
            $("#PropZoomId").val('');
            $("#PropIsDefaultId").prop("checked", false);
            $("#PropWidthId").val('');
            $("#PropLengthId").val('');            

            //$(".input-group-addon > i").removeAttr('style');  

            $('#mdMapPropertyId').modal('show');
            let GeometryId = WmsOplMapObj.ActiveFeatures.get('Id');
            //console.log(GeometryId);

            if (GeometryId != "") {
                NProgress.configure({ parent: "#mdBodyMapPropertyId" });
                NProgress.configure({ showSpinner: false });
                NProgress.start();

                let PostData = new FormData();
                PostData.append("GeometryId", GeometryId);
                CallServicesWithFormData(GlobalGetGeometryUrl, false, PostData, function (data) {
                    var jsonObj = jQuery.parseJSON(data);
                    //console.log(jsonObj);

                    $('#DivPropIsDefaultId').hide();
                    $('#DivPropZoomId').hide();
                    $('#HPropResizeId').hide();
                    $('#DivPropWidthId').hide();
                    $('#DivPropLengthId').hide();                    
                    if (jsonObj.RefGrpKey == "Marker") {
                        $('#DivPropIsDefaultId').show();
                        $('#DivPropZoomId').show();

                        if (jsonObj.GeoProperties[0].IsDefault == true) {
                            $("#PropIsDefaultId").prop("checked", true);
                        } else {
                            $("#PropIsDefaultId").prop("checked", false);
                        }
                    } else if (jsonObj.RefGrpKey == "Square") {
                        $('#HPropResizeId').show();	
                        $('#DivPropWidthId').show();
                        $('#DivPropLengthId').show();  
                        
                        let source = OplMapObj.vectorLayer.getSource();
                        let squareObj = source.getFeatureById("DRAWID" + jsonObj.Id);    
                        let coord = squareObj.getGeometry().getCoordinates();
                        //console.log(coord);

                        let coord0 = coord[0][0];
                        let coord1 = coord[0][1];
                        let coord2 = coord[0][2];
                        let coord3 = coord[0][3];
                        //console.log(coord0);
                        //console.log(coord1);
                        //console.log(coord2);
                        //console.log(coord3);

                        let MeasureWidth = WmsOplMapObj.measureCoord(coord0, coord1);
                        let MeasureLength = WmsOplMapObj.measureCoord(coord1, coord2);
                        //console.log(MeasureWidth);
                        //console.log(MeasureLength);

                        $("#PropWidthId").val(MeasureWidth);
                        $("#PropLengthId").val(MeasureLength); 
                    } else {
                        $("#PropIsDefaultId").prop("checked", false);
                    } 

                    let Name = jsonObj.Name;
                    let Description = jsonObj.Description;
                    let StrokeColor = jsonObj.GeoProperties[0].StrokeColor;
                    let StrokeWidth = jsonObj.GeoProperties[0].StrokeWidth;
                    let FillR = jsonObj.GeoProperties[0].FillR;
                    let FillG = jsonObj.GeoProperties[0].FillG;
                    let FillB = jsonObj.GeoProperties[0].FillB;
                    let FillOpacity = jsonObj.GeoProperties[0].FillOpacity;
                    let HexFillColor = rgbToHex(FillR, FillG, FillB);
                    let Zoom = jsonObj.GeoProperties[0].Zoom;
                    if ((Zoom == '') || (Zoom == null)) { Zoom = 18; }                    

                    $("#PropNameId").val(Name);
                    $("#PropDescId").val(Description);
                    $("#PropStrokeColorId").colorpicker('setValue', StrokeColor);
                    $("#PropStrokeWidthId").val(StrokeWidth);
                    $("#PropFillColorId").colorpicker('setValue', HexFillColor);
                    $("#PropOpacityId").val(FillOpacity);
                    $("#PropZoomId").val(Zoom);
                });

                NProgress.done();
                NProgress.remove();
            }

        });

        $("#SavePropertyId").click(function (e) {
            e.preventDefault();

            let GeometryId = WmsOplMapObj.ActiveFeatures.get('Id');
            //console.log(GeometryId);

            NProgress.configure({ parent: "#mdBodyMapPropertyId" });
            NProgress.configure({ showSpinner: false });
            NProgress.start();

            if (GeometryId != "") {
                // Get geometry object.
                let GeometryObj;
                let PostData = new FormData();
                PostData.append("GeometryId", GeometryId);
                CallServicesWithFormData(GlobalGetGeometryUrl, false, PostData, function (data) {
                    GeometryObj = jQuery.parseJSON(data);
                });
                //console.log(GeometryObj);

                // Save geometry header.
                let PostData1 = new FormData();
                PostData1.append("GeometryId", GeometryId);
                PostData1.append("Name", $("#PropNameId").val());
                PostData1.append("Description", $("#PropDescId").val());
                CallServicesWithFormData(GlobalSaveGeometryDescUrl, false, PostData1, function (data) {
                    var jsonObj = jQuery.parseJSON(data);
                    //console.log(jsonObj);
                });

                let ChkIsDefault = $("#PropIsDefaultId").is(":checked");
                //console.log(ChkIsDefault);

                // Save and set object properties.
                let StrokeColor = $("#PropStrokeColorId").val();
                let FillColor = $("#PropFillColorId").val();
                let FillR = hexToRgb(FillColor).r;
                let FillG = hexToRgb(FillColor).g;
                let FillB = hexToRgb(FillColor).b;
                let Feature = WmsOplMapObj.ActiveFeatures;
                let Type = GeometryObj.RefGrpKey;
                let FillOpacity = $("#PropOpacityId").val();
                let StrokeWidth = $("#PropStrokeWidthId").val();
                WmsOplMapObj.setFeatureColor(Feature, Type, $("#PropNameId").val(), StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);

                let PostData2 = new FormData();
                PostData2.append("GeometryId", GeometryId);
                PostData2.append("StrokeColor", StrokeColor);
                PostData2.append("StrokeWidth", StrokeWidth);
                PostData2.append("FillR", FillR);
                PostData2.append("FillG", FillG);
                PostData2.append("FillB", FillB);
                PostData2.append("FillOpacity", FillOpacity);
                PostData2.append("Zoom", $("#PropZoomId").val());
                PostData2.append("IsDefault", ChkIsDefault);

                CallServicesWithFormData(GlobalUpdateGeoPropertiesUrl, false, PostData2, function (data) {
                    var jsonObj = jQuery.parseJSON(data);
                    //console.log(jsonObj);
                });

                // Resize...
                let Width = $("#PropWidthId").val();
                let Length = $("#PropLengthId").val();
                if ((Width !== null) && (Length !== null))
                {
                    if ((Width !== "") && (Length !== ""))
                    {
                        Width = parseFloat(Width);
                        Length = parseFloat(Length);
                        WmsOplMapObj.resizeRectangle(GeometryId, Width, Length, "", StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity); 
                    }
                }
            }

            NProgress.done();
            NProgress.remove();
            $('#mdMapPropertyId').modal('hide');
        });

        $("#RenderCurrentLocationId").hide();
        $("#RenderLocationId").click(function (e) {
            e.preventDefault();

            $("#RenderLocationId").hide();
            $("#RenderCurrentLocationId").show();

            // Remove all features.
            OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                OplMapObj.vectorLayer.getSource().removeFeature(feature);;
            });

            let MarkerEnableSelect = true;
            let MarkerEnableDelete = true;
            let LineStringEnableSelect = true;
            let LineStringEnableDelete = true;
            let PolygonEnableSelect = true;
            let PolygonEnableDelete = true;            

            // Render geometry storage locations : Marker
            WmsOplMapObj.renderGeometryStorageLocations(GlobalRenderGeometryByLocationUrl, Marker, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Warehouse
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Warehouser, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Zone
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Zone, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Rack
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Rack, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Location
            MarkerEnableSelect = true;
            MarkerEnableDelete = true;
            PolygonEnableSelect = true;
            PolygonEnableDelete = true;              
            WmsOplMapObj.renderGeometryByLocation(GlobalRenderGeometryByLocationUrl, Location,
                                                  MarkerEnableSelect, MarkerEnableDelete,
                                                  PolygonEnableSelect, PolygonEnableDelete);
        });

        $("#RenderCurrentLocationId").click(function (e) {
            e.preventDefault();

            $("#RenderLocationId").show();
            $("#RenderCurrentLocationId").hide();

            // Remove all features.
            OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                OplMapObj.vectorLayer.getSource().removeFeature(feature);;
            });

            RenderGeometryStorageLocations();
        });

        var $div = $('<div />').appendTo('body');
        $div.attr('id', 'fullScreenControlId');
        $div.hide();
        var divFullScreenControl = document.querySelector('#fullScreenControlId');
        var fullScreenControl = new ol.control.FullScreen({ target: divFullScreenControl });
        OplMapObj.map.addControl(fullScreenControl);
        $('#FullScreenId').click(function (e) {
            e.preventDefault();
            $('.ol-full-screen-false').trigger("click");
        });

    }

    if ((CurrentController.toUpperCase() == "ZONE") && (CurrentAction.toUpperCase() == "MANAGE")) {

        let OplMapObj;
        let SetMapCenterFlag = false;

        // Set map center.
        // get zone center...       
        let PostZoneData = new FormData();
        PostZoneData.append("RefKey", $("input[name='Id']").val());
        CallServicesWithFormData(GlobalGetMarkerCenterUrl, false, PostZoneData, function (data) {
            let jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);            
            if (jsonObj.GeoCoordinates != null)
            {
                if (jsonObj.GeoCoordinates.length > 0)
                {
                    DefaultLat = jsonObj.GeoCoordinates[0].Latitude;
                    DefaultLng = jsonObj.GeoCoordinates[0].Longitude;
                    SetMapCenterFlag = true;
                    //console.log(DefaultLat, DefaultLng);                    
                }
            }
            if (jsonObj.GeoProperties != null)
            {
                if (jsonObj.GeoProperties.length > 0)
                {
                    DefaultZoom = jsonObj.GeoProperties[0].Zoom;
                }
            }
            if (SetMapCenterFlag == true){
                OplMapObj = new OplMap(DefaultMapId, DefaultLat, DefaultLng, DefaultZoom);
            }
            //console.log(DefaultLat +" : "+ DefaultLng +" : "+ SetMapCenterFlag);
        });
        
        // get warehouse center
        if (SetMapCenterFlag == false){
            let PostWarehouseData = new FormData();
            PostWarehouseData.append("RefKey", $("input[name='WarehouseId']").val());
            CallServicesWithFormData(GlobalGetMarkerCenterUrl, false, PostWarehouseData, function (data) {
                let jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);            
                if (jsonObj.GeoCoordinates != null)
                {
                    if (jsonObj.GeoCoordinates.length > 0)
                    {
                        DefaultLat = jsonObj.GeoCoordinates[0].Latitude;
                        DefaultLng = jsonObj.GeoCoordinates[0].Longitude;
                        SetMapCenterFlag = true;
                        //console.log(DefaultLat, DefaultLng);                    
                    }
                }
                if (jsonObj.GeoProperties != null)
                {
                    if (jsonObj.GeoProperties.length > 0)
                    {
                        DefaultZoom = jsonObj.GeoProperties[0].Zoom;
                    }
                }
                //console.log(DefaultLat +" : "+ DefaultLng +" : "+ SetMapCenterFlag);
            }); 
            OplMapObj = new OplMap(DefaultMapId, DefaultLat, DefaultLng, DefaultZoom);           
        }
         
        // Scale control
        OplMapObj.createScaleControl();

        // Main control bar
        //var settingArray = [];
        //OplMapObj.createControlBar(settingArray);

        // Create WMS map.
        var WmsOplMapObj = new WmsOplMap(OplMapObj);

        // Create PP map.
        //var PPOplMapObj = new PPOplMap(OplMapObj, WmsOplMapObj);
        //var ppSettingArray = ['ShowPPGeoBookmark'];
        //PPOplMapObj.createPPOplMap(ppSettingArray);

        var wmsSettingArray = [];
        WmsOplMapObj.createWmsOplMap(wmsSettingArray);
        let createInteractionObj = WmsOplMapObj.createInteraction(false);

        // Remove main bar...
        OplMapObj.map.removeControl(OplMapObj.mainbar);

        function RenderGeometryStorageLocations() {
            let MarkerEnableSelect = true;
            let MarkerEnableDelete = true;
            let LineStringEnableSelect = true;
            let LineStringEnableDelete = true;
            let PolygonEnableSelect = true;
            let PolygonEnableDelete = true;

            // Render geometry storage locations : Warehouse
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Warehouser, $('#WarehouseId').val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Zone
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Zone, $("input[name='Id']").val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Marker
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Marker, $("input[name='Id']").val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
        }

        function enableMapFeatureFunc() {
            var enableMapFeature = readCookie('EnableMapFeature');
            //console.log(enableMapFeature);
            if (enableMapFeature == 'false') {
                $('#DivZoneLoactionId').hide();
                $('#ShowMapBtId').show();
                $('#HideMapBtId').hide();
            } else {
                $('#DivZoneLoactionId').css('visibility', 'visible'); // visible : hidden
                $('#DivZoneLoactionId').show();
                $('#ShowMapBtId').hide();
                $('#HideMapBtId').show();
            }
        }

        // Extend a Function of dragBox event.
        createInteractionObj.Interactions.transform.on('select', function(e) {
            let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
            let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
            if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
            if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }

            let activeFeatureObj = WmsOplMapObj.ActiveFeatures;
            if (activeFeatureObj == null) { return; }
            if (activeFeatureObj.get('RefGrpKey') != "Square") { return; }

            let geoCoordinates = activeFeatureObj.getGeometry().getCoordinates();
            if (geoCoordinates == null) { return; }
            if (geoCoordinates[0].length <= 3)  { return; }

            let coord0 = geoCoordinates[0][0];
            let coord1 = geoCoordinates[0][1];
            let coord2 = geoCoordinates[0][2];
            let coord3 = geoCoordinates[0][3];
            let coord4 = geoCoordinates[0][4];

            let MeasureWidth = WmsOplMapObj.measureCoord(coord0, coord1);
            let MeasureLength = WmsOplMapObj.measureCoord(coord1, coord2);
            //console.log(MeasureWidth);
            //console.log(MeasureLength);

            let GeometryId = activeFeatureObj.get("Id");
            let PostData = new FormData();
            PostData.append("GeometryId", GeometryId);
            CallServicesWithFormData(GlobalGetGeometryUrl, false, PostData, function (data) {
                var jsonObj = jQuery.parseJSON(data);

                let StrokeColor = jsonObj.GeoProperties[0].StrokeColor;
                let StrokeWidth = jsonObj.GeoProperties[0].StrokeWidth;
                let FillR = jsonObj.GeoProperties[0].FillR;
                let FillG = jsonObj.GeoProperties[0].FillG;
                let FillB = jsonObj.GeoProperties[0].FillB;
                let FillOpacity = jsonObj.GeoProperties[0].FillOpacity;

                // get Latitude and Longitude
                let lnglat;
                if (geoCoordinates[0].length == 4) 
                {
                    lnglat = ol.proj.transform(geoCoordinates[0][0], 'EPSG:3857', 'EPSG:4326');
                } else if  (geoCoordinates[0].length == 5) {
                    lnglat = ol.proj.transform(geoCoordinates[0][2], 'EPSG:3857', 'EPSG:4326');                    
                }  	
                let jsonLatLng = [{ lat: lnglat[1], lng: lnglat[0] }];   
                let featureObj = WmsOplMapObj.createSquare(jsonLatLng, activeFeatureObj.getId(), MeasureWidth, MeasureLength, "", StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);
            });            
        });           

        //$('#DivZoneLoactionId').hide();
        $('#ShowMapBtId').click(function (e) {
            e.preventDefault();
            ajaxindicatorstart();
            createCookie('EnableMapFeature', 'true', 1);
            enableMapFeatureFunc();
            if (ShowMapToggle == 0) {
                RenderGeometryStorageLocations();
                ShowMapToggle = 1;
            }
            ajaxindicatorstop();
        });

        $('#HideMapBtId').click(function (e) {
            e.preventDefault();
            createCookie('EnableMapFeature', 'false', 1);
            enableMapFeatureFunc();
        });  

        $('#SelectId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.setInteraction('transform');
            WmsOplMapObj.Interactions.transform.set('scale', false);
            $('#PlacemarkBtId').show();
            $('#ConfirmPlacemarkBtId').hide();

            let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
            let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
            if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
            if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }

            WmsOplMapObj.ActivePlacemarkLngLat = false;
            WmsOplMapObj.ClearMap();
        });

        $('#LineStringId').click(function (e) {
            e.preventDefault();

            let InpuData = {
                GeometryId: '',
                GeoType: Zone,
                RefGrpKey: 'LineString',
                RefKey: $("input[name='Id']").val(),
                Name: $('#Name').val(),
                Description: $('#Description').val(),
                IsActive: true,
                StrokeColor: '',
                FillR: '',
                FillG: '',
                FillB: '',
                GeoCoordinates: ''
            }
            WmsOplMapObj.setInteraction('draw', InpuData);

        });

        $('#PolygonId').click(function (e) {
            e.preventDefault();

            let InpuData = {
                GeometryId: '',
                GeoType: Zone,
                RefGrpKey: 'Polygon',
                RefKey: $("input[name='Id']").val(),
                Name: $('#Name').val(),
                Description: $('#Description').val(),
                IsActive: true,
                StrokeColor: '',
                FillR: '',
                FillG: '',
                FillB: '',
                GeoCoordinates: ''
            }
            WmsOplMapObj.setInteraction('drawPolygon', InpuData);

        });

        $('#SquareId').click(function (e) {
            e.preventDefault();

            let InpuData = {
                GeometryId: '',
                GeoType: Zone,
                RefGrpKey: 'Square',
                RefKey: $("input[name='Id']").val(),
                Name: $('#Name').val(),
                Description: $('#Description').val(),
                IsActive: true,
                StrokeColor: '',
                FillR: '',
                FillG: '',
                FillB: '',
                GeoCoordinates: ''
            }
            WmsOplMapObj.setInteraction('drawRegular', InpuData);

        });

        $('#OffSetId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.setInteraction('offset');
        });

        $('#FillColorId').click(function (e) {
            e.preventDefault();

            let GeometryId = WmsOplMapObj.ActiveFeatures.get('Id');
            let StrokeColor = $("#FillFeatureColorColorId").val();
            let FillColor = $("#FillFeatureColorColorId").val();
            if ((StrokeColor == "") || (FillColor == "")) return false;
            let FillR = hexToRgb(FillColor).r;
            let FillG = hexToRgb(FillColor).g;
            let FillB = hexToRgb(FillColor).b;
            let Feature = WmsOplMapObj.ActiveFeatures;
            let Type = WmsOplMapObj.ActiveFeatures.get('RefGrpKey');
            let FillOpacity = 0.5;
            let StrokeWidth = 1;
            WmsOplMapObj.setFeatureColor(Feature, Type, "", StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);

            let PostData = new FormData();
            PostData.append("GeometryId", GeometryId);
            PostData.append("StrokeColor", StrokeColor);
            PostData.append("StrokeWidth", StrokeWidth);
            PostData.append("FillR", FillR);
            PostData.append("FillG", FillG);
            PostData.append("FillB", FillB);
            PostData.append("FillOpacity", FillOpacity);

            CallServicesWithFormData(GlobalUpdateGeoPropertiesUrl, false, PostData, function (data) {
                var jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);
            });

        });

        $('#TransformId').click(function (e) {
            e.preventDefault();

            WmsOplMapObj.setInteraction('transform');
            WmsOplMapObj.Interactions.transform.set('scale', true);
        });

        $('#ModifyId').click(function (e) {
            e.preventDefault();

            WmsOplMapObj.setInteraction('modifyfeature');
        });

        $('#DeleteId').click(function (e) {
            e.preventDefault();

            WmsOplMapObj.deleteGeometryActiveFeatures();
        });

        $('#ConfirmPlacemarkBtId').hide();
        $('#PlacemarkBtId').click(function (e) {
            e.preventDefault();
            $('#PlacemarkBtId').hide();
            $('#ConfirmPlacemarkBtId').show();
            WmsOplMapObj.ActivePlacemarkLngLat = true;
        });

        $('#ConfirmPlacemarkBtId').click(function (e) {
            e.preventDefault();
            $('#PlacemarkBtId').show();
            $('#ConfirmPlacemarkBtId').hide();
            WmsOplMapObj.ActivePlacemarkLngLat = false;

            if (WmsOplMapObj.PlacemarkLngLatValue == null) return;
            let MarkerLng = WmsOplMapObj.PlacemarkLngLatValue[0];
            let MarkLat = WmsOplMapObj.PlacemarkLngLatValue[1];

            let GeometryId = '';
            let GeoType = Marker;
            let RefGrpKey = 'Marker';
            let RefKey = $("input[name='Id']").val();
            let Name = '';
            let Description = '';
            let IsActive = true;
            let StrokeColor = '';
            let FillR = '';
            let FillG = '';
            let FillB = '';
            let GeoCoordinates = [[MarkerLng, MarkLat]];
            let jsonObj = WmsOplMapObj.createOrUpdateDraw(GeometryId, GeoType, RefGrpKey, RefKey, Name, Description, IsActive, StrokeColor, FillR, FillG, FillB, GeoCoordinates);
            //console.log(jsonObj);
            if (jsonObj.Result == true) {
                let DrawId = "DRAWID" + jsonObj.Geometry.Id;
                var markerObj = OplMapObj.addMarker(MarkLat, MarkerLng, DrawId, "");
                markerObj.setProperties({
                    'Id': jsonObj.Geometry.Id,
                    'Type': 'Marker',
                    'EnableDelete': true,
                    'RefGrpKey': jsonObj.Geometry.RefGrpKey,
                    'RefKey': jsonObj.Geometry.RefKey,
                    'Container': '',
                    'SketchGeoCoordinates': ''
                });
            }

            $(".placemarkLngLatClass").remove();
        });

        $("#MapPropertyId").click(function (e) {
            e.preventDefault();

            let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
            let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
            if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
            if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }

            if (WmsOplMapObj.ActiveFeatures == null) return;

            // Clear interface...
            $("#PropNameId").val('');
            $("#PropDescId").val('');
            $("#PropStrokeColorId").val('');
            $("#PropStrokeWidthId").val('');
            $("#PropFillColorId").val('');
            $("#PropOpacityId").val('');
            $("#PropZoomId").val('');
            $("#PropIsDefaultId").prop("checked", false);
            $("#PropWidthId").val('');
            $("#PropLengthId").val('');

            //$(".input-group-addon > i").removeAttr('style');  

            $('#mdMapPropertyId').modal('show');
            let GeometryId = WmsOplMapObj.ActiveFeatures.get('Id');
            console.log(GeometryId);

            if (GeometryId != "") {
                NProgress.configure({ parent: "#mdBodyMapPropertyId" });
                NProgress.configure({ showSpinner: false });
                NProgress.start();

                let PostData = new FormData();
                PostData.append("GeometryId", GeometryId);
                CallServicesWithFormData(GlobalGetGeometryUrl, false, PostData, function (data) {
                    var jsonObj = jQuery.parseJSON(data);
                    console.log(jsonObj);

                    $('#DivPropIsDefaultId').hide();
                    $('#DivPropZoomId').hide();
                    $('#HPropResizeId').hide();
                    $('#DivPropWidthId').hide();
                    $('#DivPropLengthId').hide();                    
                    if (jsonObj.RefGrpKey == "Marker") {
                        $('#DivPropIsDefaultId').show();
                        $('#DivPropZoomId').show();
                    } else if (jsonObj.RefGrpKey == "Square") {
                        $('#HPropResizeId').show();	
                        $('#DivPropWidthId').show();
                        $('#DivPropLengthId').show();
                        
                        let source = OplMapObj.vectorLayer.getSource();
                        let squareObj = source.getFeatureById("DRAWID" + jsonObj.Id);    
                        let coord = squareObj.getGeometry().getCoordinates();
                        //console.log(coord);

                        let coord0 = coord[0][0];
                        let coord1 = coord[0][1];
                        let coord2 = coord[0][2];
                        let coord3 = coord[0][3];
                        //console.log(coord0);
                        //console.log(coord1);
                        //console.log(coord2);
                        //console.log(coord3);

                        let MeasureWidth = WmsOplMapObj.measureCoord(coord0, coord1);
                        let MeasureLength = WmsOplMapObj.measureCoord(coord1, coord2);
                        //console.log(MeasureWidth);
                        //console.log(MeasureLength);

                        $("#PropWidthId").val(MeasureWidth);
                        $("#PropLengthId").val(MeasureLength);                         
                    } 	

                    let Name = jsonObj.Name;
                    let Description = jsonObj.Description;
                    let StrokeColor = jsonObj.GeoProperties[0].StrokeColor;
                    let StrokeWidth = jsonObj.GeoProperties[0].StrokeWidth;
                    let FillR = jsonObj.GeoProperties[0].FillR;
                    let FillG = jsonObj.GeoProperties[0].FillG;
                    let FillB = jsonObj.GeoProperties[0].FillB;
                    let FillOpacity = jsonObj.GeoProperties[0].FillOpacity;
                    let HexFillColor = rgbToHex(FillR, FillG, FillB);
                    let Zoom = jsonObj.GeoProperties[0].Zoom;
                    if ((Zoom == '') || (Zoom == null)) { Zoom = 18; }

                    $("#PropNameId").val(Name);
                    $("#PropDescId").val(Description);
                    $("#PropStrokeColorId").colorpicker('setValue', StrokeColor);
                    $("#PropStrokeWidthId").val(StrokeWidth);
                    $("#PropFillColorId").colorpicker('setValue', HexFillColor);
                    $("#PropOpacityId").val(FillOpacity);
                    $("#PropZoomId").val(Zoom);

                    if (jsonObj.GeoProperties[0].IsDefault == true) {
                        $("#PropIsDefaultId").prop("checked", true);
                    } else {
                        $("#PropIsDefaultId").prop("checked", false);
                    }	
                });

                NProgress.done();
                NProgress.remove();
            }

        });

        $("#SavePropertyId").click(function (e) {
            e.preventDefault();

            let GeometryId = WmsOplMapObj.ActiveFeatures.get('Id');
            //console.log(GeometryId);

            NProgress.configure({ parent: "#mdBodyMapPropertyId" });
            NProgress.configure({ showSpinner: false });
            NProgress.start();

            if (GeometryId != "") {
                // Get geometry object.
                let GeometryObj;
                let PostData = new FormData();
                PostData.append("GeometryId", GeometryId);
                CallServicesWithFormData(GlobalGetGeometryUrl, false, PostData, function (data) {
                    GeometryObj = jQuery.parseJSON(data);
                });
                //console.log(GeometryObj);

                // Save geometry header.
                let PostData1 = new FormData();
                PostData1.append("GeometryId", GeometryId);
                PostData1.append("Name", $("#PropNameId").val());
                PostData1.append("Description", $("#PropDescId").val());
                CallServicesWithFormData(GlobalSaveGeometryDescUrl, false, PostData1, function (data) {
                    var jsonObj = jQuery.parseJSON(data);
                    //console.log(jsonObj);
                });

                let ChkIsDefault = $("#PropIsDefaultId").is(":checked");
                //console.log(ChkIsDefault);

                // Save and set object properties.
                let StrokeColor = $("#PropStrokeColorId").val();
                let FillColor = $("#PropFillColorId").val();
                let FillR = hexToRgb(FillColor).r;
                let FillG = hexToRgb(FillColor).g;
                let FillB = hexToRgb(FillColor).b;
                let Feature = WmsOplMapObj.ActiveFeatures;
                let Type = GeometryObj.RefGrpKey;
                let FillOpacity = $("#PropOpacityId").val();
                let StrokeWidth = $("#PropStrokeWidthId").val();
                WmsOplMapObj.setFeatureColor(Feature, Type, $("#PropNameId").val(), StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);

                let PostData2 = new FormData();
                PostData2.append("GeometryId", GeometryId);
                PostData2.append("StrokeColor", StrokeColor);
                PostData2.append("StrokeWidth", StrokeWidth);
                PostData2.append("FillR", FillR);
                PostData2.append("FillG", FillG);
                PostData2.append("FillB", FillB);
                PostData2.append("FillOpacity", FillOpacity);
                PostData2.append("Zoom", $("#PropZoomId").val());
                PostData2.append("IsDefault", ChkIsDefault);

                CallServicesWithFormData(GlobalUpdateGeoPropertiesUrl, false, PostData2, function (data) {
                    var jsonObj = jQuery.parseJSON(data);
                    //console.log(jsonObj);
                });

                // Resize...
                let Width = $("#PropWidthId").val();
                let Length = $("#PropLengthId").val();
                if ((Width !== null) && (Length !== null))
                {
                    if ((Width !== "") && (Length !== ""))
                    {
                        Width = parseFloat(Width);
                        Length = parseFloat(Length);
                        WmsOplMapObj.resizeRectangle(GeometryId, Width, Length, "", StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity); 
                    }
                }
            }

            NProgress.done();
            NProgress.remove();
            $('#mdMapPropertyId').modal('hide');
        });

        $("#RenderCurrentLocationId").hide();
        $("#RenderLocationId").click(function (e) {
            e.preventDefault();

            $("#RenderLocationId").hide();
            $("#RenderCurrentLocationId").show();

            // Remove all features.
            OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                OplMapObj.vectorLayer.getSource().removeFeature(feature);;
            });

            let MarkerEnableSelect = true;
            let MarkerEnableDelete = true;
            let LineStringEnableSelect = true;
            let LineStringEnableDelete = true;
            let PolygonEnableSelect = true;
            let PolygonEnableDelete = true;

            // Render geometry storage locations : Marker
            WmsOplMapObj.renderGeometryStorageLocations(GlobalRenderGeometryByLocationUrl, Marker, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Warehouse
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Warehouser, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Zone
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Zone, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Rack
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Rack, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Location
            MarkerEnableSelect = true;
            MarkerEnableDelete = true;
            PolygonEnableSelect = true;
            PolygonEnableDelete = true;
            WmsOplMapObj.renderGeometryByLocation(GlobalRenderGeometryByLocationUrl, Location,
                                                  MarkerEnableSelect, MarkerEnableDelete,
                                                  PolygonEnableSelect, PolygonEnableDelete);
        });

        $("#RenderCurrentLocationId").click(function (e) {
            e.preventDefault();

            $("#RenderLocationId").show();
            $("#RenderCurrentLocationId").hide();

            // Remove all features.
            OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                OplMapObj.vectorLayer.getSource().removeFeature(feature);;
            });

            RenderGeometryStorageLocations();
        });

        var $div = $('<div />').appendTo('body');
        $div.attr('id', 'fullScreenControlId');
        $div.hide();
        var divFullScreenControl = document.querySelector('#fullScreenControlId');
        var fullScreenControl = new ol.control.FullScreen({ target: divFullScreenControl });
        OplMapObj.map.addControl(fullScreenControl);
        $('#FullScreenId').click(function (e) {
            e.preventDefault();
            $('.ol-full-screen-false').trigger("click");
        });

    }

    if ((CurrentController.toUpperCase() == "RACK") && (CurrentAction.toUpperCase() == "MANAGE")) {

        let OplMapObj; 
        let SetMapCenterFlag = false;       

        // Set map center.
        // get rack center...
        let PostRackData = new FormData();
        PostRackData.append("RefKey", $("input[name='Id']").val());
        CallServicesWithFormData(GlobalGetMarkerCenterUrl, false, PostRackData, function (data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);
            if (jsonObj.GeoCoordinates != null)
            {
                if (jsonObj.GeoCoordinates.length > 0)
                {
                    DefaultLat = jsonObj.GeoCoordinates[0].Latitude;
                    DefaultLng = jsonObj.GeoCoordinates[0].Longitude;
                    SetMapCenterFlag = true;
                    //console.log(DefaultLat, DefaultLng);
                }
            }
            if (jsonObj.GeoProperties != null)
            {
                if (jsonObj.GeoProperties.length > 0)
                {
                    DefaultZoom = jsonObj.GeoProperties[0].Zoom;
                }
            }
            if (SetMapCenterFlag == true){
                OplMapObj = new OplMap(DefaultMapId, DefaultLat, DefaultLng, DefaultZoom);
            }
            //console.log(DefaultLat +" : "+ DefaultLng +" : "+ SetMapCenterFlag);
        });
        
        // get zone center...  
        if (SetMapCenterFlag == false){     
            let PostZoneData = new FormData();
            PostZoneData.append("RefKey", $("input[name='ZoneId']").val());
            CallServicesWithFormData(GlobalGetMarkerCenterUrl, false, PostZoneData, function (data) {
                let jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);            
                if (jsonObj.GeoCoordinates != null)
                {
                    if (jsonObj.GeoCoordinates.length > 0)
                    {
                        DefaultLat = jsonObj.GeoCoordinates[0].Latitude;
                        DefaultLng = jsonObj.GeoCoordinates[0].Longitude;
                        SetMapCenterFlag = true;
                        //console.log(DefaultLat, DefaultLng);                    
                    }
                }
                if (jsonObj.GeoProperties != null)
                {
                    if (jsonObj.GeoProperties.length > 0)
                    {
                        DefaultZoom = jsonObj.GeoProperties[0].Zoom;
                    }
                }
                if (SetMapCenterFlag == true){
                    OplMapObj = new OplMap(DefaultMapId, DefaultLat, DefaultLng, DefaultZoom);
                }
                //console.log(DefaultLat +" : "+ DefaultLng +" : "+ SetMapCenterFlag);
            });
        }
        
        // get warehouse center
        if (SetMapCenterFlag == false){
            let PostWarehouseData = new FormData();
            PostWarehouseData.append("RefKey", $("select[name='WarehouseId']").val());
            CallServicesWithFormData(GlobalGetMarkerCenterUrl, false, PostWarehouseData, function (data) {
                let jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);            
                if (jsonObj.GeoCoordinates != null)
                {
                    if (jsonObj.GeoCoordinates.length > 0)
                    {
                        DefaultLat = jsonObj.GeoCoordinates[0].Latitude;
                        DefaultLng = jsonObj.GeoCoordinates[0].Longitude;
                        SetMapCenterFlag = true;
                        //console.log(DefaultLat, DefaultLng);                    
                    }
                }
                if (jsonObj.GeoProperties != null)
                {
                    if (jsonObj.GeoProperties.length > 0)
                    {
                        DefaultZoom = jsonObj.GeoProperties[0].Zoom;
                    }
                }
                //console.log(DefaultLat +" : "+ DefaultLng +" : "+ SetMapCenterFlag);
            }); 
            OplMapObj = new OplMap(DefaultMapId, DefaultLat, DefaultLng, DefaultZoom);           
        } 

        // Scale control
        OplMapObj.createScaleControl();

        // Main control bar
        //var settingArray = [];
        //OplMapObj.createControlBar(settingArray);

        // Create WMS map.
        var WmsOplMapObj = new WmsOplMap(OplMapObj);

        // Create PP map.
        //var PPOplMapObj = new PPOplMap(OplMapObj, WmsOplMapObj);
        //var ppSettingArray = ['ShowPPGeoBookmark'];
        //PPOplMapObj.createPPOplMap(ppSettingArray);

        var wmsSettingArray = [];
        WmsOplMapObj.createWmsOplMap(wmsSettingArray);
        let createInteractionObj = WmsOplMapObj.createInteraction(false);

        // Remove main bar...
        OplMapObj.map.removeControl(OplMapObj.mainbar);

        function RenderGeometryStorageLocations() {
            let MarkerEnableSelect = true;
            let MarkerEnableDelete = true;
            let LineStringEnableSelect = true;
            let LineStringEnableDelete = true;
            let PolygonEnableSelect = true;
            let PolygonEnableDelete = true;

            // Render geometry storage locations : Warehouse
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Warehouser, $('#WarehouseId').val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Zone
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Zone, $('#ZoneId').val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Rack
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Rack, $("input[name='Id']").val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);                
            // Render geometry storage locations : Marker
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Marker, $("input[name='Id']").val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
        }

        function enableMapFeatureFunc() {
            var enableMapFeature = readCookie('EnableMapFeature');
            //console.log(enableMapFeature);
            if (enableMapFeature == 'false') {
                $('#DivRackLoactionId').hide();
                $('#ShowMapBtId').show();
                $('#HideMapBtId').hide();
            } else {
                $('#DivRackLoactionId').css('visibility', 'visible'); // visible : hidden
                $('#DivRackLoactionId').show();
                $('#ShowMapBtId').hide();
                $('#HideMapBtId').show();
            }
        }

        // Extend a Function of dragBox event.
        createInteractionObj.Interactions.transform.on('select', function(e) {
            let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
            let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
            if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
            if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }

            let activeFeatureObj = WmsOplMapObj.ActiveFeatures;
            if (activeFeatureObj == null) { return; }
            if (activeFeatureObj.get('RefGrpKey') != "Square") { return; }

            let geoCoordinates = activeFeatureObj.getGeometry().getCoordinates();
            if (geoCoordinates == null) { return; }
            if (geoCoordinates[0].length <= 3)  { return; }

            let coord0 = geoCoordinates[0][0];
            let coord1 = geoCoordinates[0][1];
            let coord2 = geoCoordinates[0][2];
            let coord3 = geoCoordinates[0][3];
            let coord4 = geoCoordinates[0][4];

            let MeasureWidth = WmsOplMapObj.measureCoord(coord0, coord1);
            let MeasureLength = WmsOplMapObj.measureCoord(coord1, coord2);
            //console.log(MeasureWidth);
            //console.log(MeasureLength);

            let GeometryId = activeFeatureObj.get("Id");
            let PostData = new FormData();
            PostData.append("GeometryId", GeometryId);
            CallServicesWithFormData(GlobalGetGeometryUrl, false, PostData, function (data) {
                var jsonObj = jQuery.parseJSON(data);

                let StrokeColor = jsonObj.GeoProperties[0].StrokeColor;
                let StrokeWidth = jsonObj.GeoProperties[0].StrokeWidth;
                let FillR = jsonObj.GeoProperties[0].FillR;
                let FillG = jsonObj.GeoProperties[0].FillG;
                let FillB = jsonObj.GeoProperties[0].FillB;
                let FillOpacity = jsonObj.GeoProperties[0].FillOpacity;

                // get Latitude and Longitude
                let lnglat;
                if (geoCoordinates[0].length == 4) 
                {
                    lnglat = ol.proj.transform(geoCoordinates[0][0], 'EPSG:3857', 'EPSG:4326');
                } else if  (geoCoordinates[0].length == 5) {
                    lnglat = ol.proj.transform(geoCoordinates[0][2], 'EPSG:3857', 'EPSG:4326');                    
                }                  
                let jsonLatLng = [{ lat: lnglat[1], lng: lnglat[0] }];   
                let featureObj = WmsOplMapObj.createSquare(jsonLatLng, activeFeatureObj.getId(), MeasureWidth, MeasureLength, "", StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);
            });            
            
        });           

        //$('#DivRackLoactionId').hide();
        $('#ShowMapBtId').click(function (e) {
            e.preventDefault();
            ajaxindicatorstart();
            createCookie('EnableMapFeature', 'true', 1);
            enableMapFeatureFunc();
            if (ShowMapToggle == 0) {
                RenderGeometryStorageLocations();
                ShowMapToggle = 1;
            }
            ajaxindicatorstop();
        });

        $('#HideMapBtId').click(function (e) {
            e.preventDefault();
            createCookie('EnableMapFeature', 'false', 1);
            enableMapFeatureFunc();
        }); 

        $('#SelectId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.setInteraction('transform');
            WmsOplMapObj.Interactions.transform.set('scale', false);
            $('#PlacemarkBtId').show();
            $('#ConfirmPlacemarkBtId').hide();

            let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
            let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
            if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
            if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }

            WmsOplMapObj.ActivePlacemarkLngLat = false;
            WmsOplMapObj.ClearMap();
        });

        $('#LineStringId').click(function (e) {
            e.preventDefault();

            let InpuData = {
                GeometryId: '',
                GeoType: Rack,
                RefGrpKey: 'LineString',
                RefKey: $("input[name='Id']").val(),
                Name: $('#location-name').val(),
                Description: $('#Description').val(),
                IsActive: true,
                StrokeColor: '',
                FillR: '',
                FillG: '',
                FillB: '',
                GeoCoordinates: ''
            }
            WmsOplMapObj.setInteraction('draw', InpuData);

        });

        $('#PolygonId').click(function (e) {
            e.preventDefault();

            let InpuData = {
                GeometryId: '',
                GeoType: Rack,
                RefGrpKey: 'Polygon',
                RefKey: $("input[name='Id']").val(),
                Name: $('#location-name').val(),
                Description: $('#Description').val(),
                IsActive: true,
                StrokeColor: '',
                FillR: '',
                FillG: '',
                FillB: '',
                GeoCoordinates: ''
            }
            WmsOplMapObj.setInteraction('drawPolygon', InpuData);

        });

        $('#SquareId').click(function (e) {
            e.preventDefault();

            let InpuData = {
                GeometryId: '',
                GeoType: Rack,
                RefGrpKey: 'Square',
                RefKey: $("input[name='Id']").val(),
                Name: $('#location-name').val(),
                Description: $('#Description').val(),
                IsActive: true,
                StrokeColor: '',
                FillR: '',
                FillG: '',
                FillB: '',
                GeoCoordinates: ''
            }
            WmsOplMapObj.setInteraction('drawRegular', InpuData);

        });

        $('#OffSetId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.setInteraction('offset');
        });

        $('#FillColorId').click(function (e) {
            e.preventDefault();

            let GeometryId = WmsOplMapObj.ActiveFeatures.get('Id');
            let StrokeColor = $("#FillFeatureColorColorId").val();
            let FillColor = $("#FillFeatureColorColorId").val();
            if ((StrokeColor == "") || (FillColor == "")) return false;
            let FillR = hexToRgb(FillColor).r;
            let FillG = hexToRgb(FillColor).g;
            let FillB = hexToRgb(FillColor).b;
            let Feature = WmsOplMapObj.ActiveFeatures;
            let Type = WmsOplMapObj.ActiveFeatures.get('RefGrpKey');
            let FillOpacity = 0.5;
            let StrokeWidth = 1;
            WmsOplMapObj.setFeatureColor(Feature, Type, "", StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);

            let PostData = new FormData();
            PostData.append("GeometryId", GeometryId);
            PostData.append("StrokeColor", StrokeColor);
            PostData.append("StrokeWidth", StrokeWidth);
            PostData.append("FillR", FillR);
            PostData.append("FillG", FillG);
            PostData.append("FillB", FillB);
            PostData.append("FillOpacity", FillOpacity);

            CallServicesWithFormData(GlobalUpdateGeoPropertiesUrl, false, PostData, function (data) {
                var jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);
            });

        });

        $('#TransformId').click(function (e) {
            e.preventDefault();

            WmsOplMapObj.setInteraction('transform');
            WmsOplMapObj.Interactions.transform.set('scale', true);
        });

        $('#ModifyId').click(function (e) {
            e.preventDefault();

            WmsOplMapObj.setInteraction('modifyfeature');
        });

        $('#DeleteId').click(function (e) {
            e.preventDefault();

            WmsOplMapObj.deleteGeometryActiveFeatures();
        });

        $('#ConfirmPlacemarkBtId').hide();
        $('#PlacemarkBtId').click(function (e) {
            e.preventDefault();
            $('#PlacemarkBtId').hide();
            $('#ConfirmPlacemarkBtId').show();
            WmsOplMapObj.ActivePlacemarkLngLat = true;
        });

        $('#ConfirmPlacemarkBtId').click(function (e) {
            e.preventDefault();
            $('#PlacemarkBtId').show();
            $('#ConfirmPlacemarkBtId').hide();
            WmsOplMapObj.ActivePlacemarkLngLat = false;

            if (WmsOplMapObj.PlacemarkLngLatValue == null) return;
            let MarkerLng = WmsOplMapObj.PlacemarkLngLatValue[0];
            let MarkLat = WmsOplMapObj.PlacemarkLngLatValue[1];

            let GeometryId = '';
            let GeoType = Marker;
            let RefGrpKey = 'Marker';
            let RefKey = $("input[name='Id']").val();
            let Name = '';
            let Description = '';
            let IsActive = true;
            let StrokeColor = '';
            let FillR = '';
            let FillG = '';
            let FillB = '';
            let GeoCoordinates = [[MarkerLng, MarkLat]];
            let jsonObj = WmsOplMapObj.createOrUpdateDraw(GeometryId, GeoType, RefGrpKey, RefKey, Name, Description, IsActive, StrokeColor, FillR, FillG, FillB, GeoCoordinates);
            //console.log(jsonObj);
            if (jsonObj.Result == true) {
                let DrawId = "DRAWID" + jsonObj.Geometry.Id;
                var markerObj = OplMapObj.addMarker(MarkLat, MarkerLng, DrawId, "");
                markerObj.setProperties({
                    'Id': jsonObj.Geometry.Id,
                    'Type': 'Marker',
                    'EnableDelete': true,
                    'RefGrpKey': jsonObj.Geometry.RefGrpKey,
                    'RefKey': jsonObj.Geometry.RefKey,
                    'Container': '',
                    'SketchGeoCoordinates': ''
                });
            }

            $(".placemarkLngLatClass").remove();
        });

        $("#MapPropertyId").click(function (e) {
            e.preventDefault();

            let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
            let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
            if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
            if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }	            

            if (WmsOplMapObj.ActiveFeatures == null) return;

            // Clear interface...
            $("#PropNameId").val('');
            $("#PropDescId").val('');
            $("#PropStrokeColorId").val('');
            $("#PropStrokeWidthId").val('');
            $("#PropFillColorId").val('');
            $("#PropOpacityId").val('');
            $("#PropZoomId").val('');
            $("#PropIsDefaultId").prop("checked", false);
            $("#PropWidthId").val('');
            $("#PropLengthId").val('');

            //$(".input-group-addon > i").removeAttr('style');

            $('#mdMapPropertyId').modal('show');
            let GeometryId = WmsOplMapObj.ActiveFeatures.get('Id');
            //console.log(GeometryId);

            if (GeometryId != "") {
                NProgress.configure({ parent: "#mdBodyMapPropertyId" });
                NProgress.configure({ showSpinner: false });
                NProgress.start();

                let PostData = new FormData();
                PostData.append("GeometryId", GeometryId);
                CallServicesWithFormData(GlobalGetGeometryUrl, false, PostData, function (data) {
                    var jsonObj = jQuery.parseJSON(data);
                    //console.log(jsonObj);

                    $('#DivPropIsDefaultId').hide();
                    $('#DivPropZoomId').hide();
                    $('#HPropResizeId').hide();
                    $('#DivPropWidthId').hide();
                    $('#DivPropLengthId').hide();                    
                    if (jsonObj.RefGrpKey == "Marker") {
                        $('#DivPropIsDefaultId').show();
                        $('#DivPropZoomId').show();
                    } else if (jsonObj.RefGrpKey == "Square") {
                        $('#HPropResizeId').show();	
                        $('#DivPropWidthId').show();
                        $('#DivPropLengthId').show();
                        
                        let source = OplMapObj.vectorLayer.getSource();
                        let squareObj = source.getFeatureById("DRAWID" + jsonObj.Id);    
                        let coord = squareObj.getGeometry().getCoordinates();
                        //console.log(coord);

                        let coord0 = coord[0][0];
                        let coord1 = coord[0][1];
                        let coord2 = coord[0][2];
                        let coord3 = coord[0][3];
                        //console.log(coord0);
                        //console.log(coord1);
                        //console.log(coord2);
                        //console.log(coord3);

                        let MeasureWidth = WmsOplMapObj.measureCoord(coord0, coord1);
                        let MeasureLength = WmsOplMapObj.measureCoord(coord1, coord2);
                        //console.log(MeasureWidth);
                        //console.log(MeasureLength);

                        $("#PropWidthId").val(MeasureWidth);
                        $("#PropLengthId").val(MeasureLength);                         
                    } 

                    let Name = jsonObj.Name;
                    let Description = jsonObj.Description;
                    let StrokeColor = jsonObj.GeoProperties[0].StrokeColor;
                    let StrokeWidth = jsonObj.GeoProperties[0].StrokeWidth;
                    let FillR = jsonObj.GeoProperties[0].FillR;
                    let FillG = jsonObj.GeoProperties[0].FillG;
                    let FillB = jsonObj.GeoProperties[0].FillB;
                    let FillOpacity = jsonObj.GeoProperties[0].FillOpacity;
                    let HexFillColor = rgbToHex(FillR, FillG, FillB);
                    let Zoom = jsonObj.GeoProperties[0].Zoom;
                    if ((Zoom == '') || (Zoom == null)) { Zoom = 18; }

                    $("#PropNameId").val(Name);
                    $("#PropDescId").val(Description);
                    $("#PropStrokeColorId").colorpicker('setValue', StrokeColor);
                    $("#PropStrokeWidthId").val(StrokeWidth);
                    $("#PropFillColorId").colorpicker('setValue', HexFillColor);
                    $("#PropOpacityId").val(FillOpacity);
                    $("#PropZoomId").val(Zoom);

                    if (jsonObj.GeoProperties[0].IsDefault == true) {
                        $("#PropIsDefaultId").prop("checked", true);
                    } else {
                        $("#PropIsDefaultId").prop("checked", false);
                    }
                });

                NProgress.done();
                NProgress.remove();
            }

        });

        $("#SavePropertyId").click(function (e) {
            e.preventDefault();

            let GeometryId = WmsOplMapObj.ActiveFeatures.get('Id');
            //console.log(GeometryId);

            NProgress.configure({ parent: "#mdBodyMapPropertyId" });
            NProgress.configure({ showSpinner: false });
            NProgress.start();

            if (GeometryId != "") {
                // Get geometry object.
                let GeometryObj;
                let PostData = new FormData();
                PostData.append("GeometryId", GeometryId);
                CallServicesWithFormData(GlobalGetGeometryUrl, false, PostData, function (data) {
                    GeometryObj = jQuery.parseJSON(data);
                });
                //console.log(GeometryObj);

                // Save geometry header.
                let PostData1 = new FormData();
                PostData1.append("GeometryId", GeometryId);
                PostData1.append("Name", $("#PropNameId").val());
                PostData1.append("Description", $("#PropDescId").val());
                CallServicesWithFormData(GlobalSaveGeometryDescUrl, false, PostData1, function (data) {
                    var jsonObj = jQuery.parseJSON(data);
                    //console.log(jsonObj);
                });

                let ChkIsDefault = $("#PropIsDefaultId").is(":checked");
                //console.log(ChkIsDefault);

                // Save and set object properties.
                let StrokeColor = $("#PropStrokeColorId").val();
                let FillColor = $("#PropFillColorId").val();
                let FillR = hexToRgb(FillColor).r;
                let FillG = hexToRgb(FillColor).g;
                let FillB = hexToRgb(FillColor).b;
                let Feature = WmsOplMapObj.ActiveFeatures;
                let Type = GeometryObj.RefGrpKey;
                let FillOpacity = $("#PropOpacityId").val();
                let StrokeWidth = $("#PropStrokeWidthId").val();
                WmsOplMapObj.setFeatureColor(Feature, Type, $("#PropNameId").val(), StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);

                let PostData2 = new FormData();
                PostData2.append("GeometryId", GeometryId);
                PostData2.append("StrokeColor", StrokeColor);
                PostData2.append("StrokeWidth", StrokeWidth);
                PostData2.append("FillR", FillR);
                PostData2.append("FillG", FillG);
                PostData2.append("FillB", FillB);
                PostData2.append("FillOpacity", FillOpacity);
                PostData2.append("Zoom", $("#PropZoomId").val());
                PostData2.append("IsDefault", ChkIsDefault);

                CallServicesWithFormData(GlobalUpdateGeoPropertiesUrl, false, PostData2, function (data) {
                    var jsonObj = jQuery.parseJSON(data);
                    //console.log(jsonObj);
                });

                // Resize...
                let Width = $("#PropWidthId").val();
                let Length = $("#PropLengthId").val();
                if ((Width !== null) && (Length !== null))
                {
                    if ((Width !== "") && (Length !== ""))
                    {
                        Width = parseFloat(Width);
                        Length = parseFloat(Length);
                        WmsOplMapObj.resizeRectangle(GeometryId, Width, Length, "", StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity); 
                    }
                }
            }

            NProgress.done();
            NProgress.remove();
            $('#mdMapPropertyId').modal('hide');
        });

        $("#RenderCurrentLocationId").hide();
        $("#RenderLocationId").click(function (e) {
            e.preventDefault();

            $("#RenderLocationId").hide();
            $("#RenderCurrentLocationId").show();

            // Remove all features.
            OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                OplMapObj.vectorLayer.getSource().removeFeature(feature);;
            });

            let MarkerEnableSelect = true;
            let MarkerEnableDelete = true;
            let LineStringEnableSelect = true;
            let LineStringEnableDelete = true;
            let PolygonEnableSelect = true;
            let PolygonEnableDelete = true;            

            // Render geometry storage locations : Marker
            WmsOplMapObj.renderGeometryStorageLocations(GlobalRenderGeometryByLocationUrl, Marker, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Warehouse
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Warehouser, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Zone
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Zone, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Rack
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Rack, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Location
            MarkerEnableSelect = true;
            MarkerEnableDelete = true;
            PolygonEnableSelect = true;
            PolygonEnableDelete = true;               
            WmsOplMapObj.renderGeometryByLocation(GlobalRenderGeometryByLocationUrl, Location,
                                                  MarkerEnableSelect, MarkerEnableDelete,
                                                  PolygonEnableSelect, PolygonEnableDelete);
        });

        $("#RenderCurrentLocationId").click(function (e) {
            e.preventDefault();

            $("#RenderLocationId").show();
            $("#RenderCurrentLocationId").hide();

            // Remove all features.
            OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                OplMapObj.vectorLayer.getSource().removeFeature(feature);;
            });

            RenderGeometryStorageLocations();
        });

        var $div = $('<div />').appendTo('body');
        $div.attr('id', 'fullScreenControlId');
        $div.hide();
        var divFullScreenControl = document.querySelector('#fullScreenControlId');
        var fullScreenControl = new ol.control.FullScreen({ target: divFullScreenControl });
        OplMapObj.map.addControl(fullScreenControl);
        $('#FullScreenId').click(function (e) {
            e.preventDefault();
            $('.ol-full-screen-false').trigger("click");
        });

    }

    if ((CurrentController.toUpperCase() == "LOCATION") && (CurrentAction.toUpperCase() == "MANAGE")) {

        let OplMapObj;
        let SetMapCenterFlag = false;

        // Set map center.
        let PostData = new FormData();
        PostData.append("RefKey", $("input[name='Id']").val());
        CallServicesWithFormData(GlobalGetMarkerCenterUrl, false, PostData, function (data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);
            if (jsonObj.GeoCoordinates != null)
            {
                if (jsonObj.GeoCoordinates.length > 0)
                {
                    DefaultLat = jsonObj.GeoCoordinates[0].Latitude;
                    DefaultLng = jsonObj.GeoCoordinates[0].Longitude;
                    SetMapCenterFlag = true;
                    //console.log(DefaultLat, DefaultLng);
                }
            }
            if (jsonObj.GeoProperties != null)
            {
                if (jsonObj.GeoProperties.length > 0)
                {
                    DefaultZoom = jsonObj.GeoProperties[0].Zoom;
                    //console.log(DefaultZoom);
                }
            }
            if (SetMapCenterFlag == true){
                OplMapObj = new OplMap(DefaultMapId, DefaultLat, DefaultLng, DefaultZoom);
            }
        });

        // get rack center...
        if (SetMapCenterFlag == false) { 
            let PostRackData = new FormData();
            PostRackData.append("RefKey", $("select[name='RackId']").val());
            CallServicesWithFormData(GlobalGetMarkerCenterUrl, false, PostRackData, function (data) {
                var jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);
                if (jsonObj.GeoCoordinates != null)
                {
                    if (jsonObj.GeoCoordinates.length > 0)
                    {
                        DefaultLat = jsonObj.GeoCoordinates[0].Latitude;
                        DefaultLng = jsonObj.GeoCoordinates[0].Longitude;
                        SetMapCenterFlag = true;
                        //console.log(DefaultLat, DefaultLng);
                    }
                }
                if (jsonObj.GeoProperties != null)
                {
                    if (jsonObj.GeoProperties.length > 0)
                    {
                        DefaultZoom = jsonObj.GeoProperties[0].Zoom;
                    }
                }
                if (SetMapCenterFlag == true){
                    OplMapObj = new OplMap(DefaultMapId, DefaultLat, DefaultLng, DefaultZoom);
                }
                //console.log(DefaultLat +" : "+ DefaultLng +" : "+ SetMapCenterFlag);
            });
        }

        // get zone center...  
        if (SetMapCenterFlag == false){     
            let PostZoneData = new FormData();
            PostZoneData.append("RefKey", $("select[name='ZoneId']").val());
            CallServicesWithFormData(GlobalGetMarkerCenterUrl, false, PostZoneData, function (data) {
                let jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);            
                if (jsonObj.GeoCoordinates != null)
                {
                    if (jsonObj.GeoCoordinates.length > 0)
                    {
                        DefaultLat = jsonObj.GeoCoordinates[0].Latitude;
                        DefaultLng = jsonObj.GeoCoordinates[0].Longitude;
                        SetMapCenterFlag = true;
                        //console.log(DefaultLat, DefaultLng);                    
                    }
                }
                if (jsonObj.GeoProperties != null)
                {
                    if (jsonObj.GeoProperties.length > 0)
                    {
                        DefaultZoom = jsonObj.GeoProperties[0].Zoom;
                    }
                }
                if (SetMapCenterFlag == true){
                    OplMapObj = new OplMap(DefaultMapId, DefaultLat, DefaultLng, DefaultZoom);
                }
                //console.log(DefaultLat +" : "+ DefaultLng +" : "+ SetMapCenterFlag);
            });
        }

        // get warehouse center
        if (SetMapCenterFlag == false){
            let PostWarehouseData = new FormData();
            PostWarehouseData.append("RefKey", $("select[name='WarehouseId']").val());
            CallServicesWithFormData(GlobalGetMarkerCenterUrl, false, PostWarehouseData, function (data) {
                let jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);            
                if (jsonObj.GeoCoordinates != null)
                {
                    if (jsonObj.GeoCoordinates.length > 0)
                    {
                        DefaultLat = jsonObj.GeoCoordinates[0].Latitude;
                        DefaultLng = jsonObj.GeoCoordinates[0].Longitude;
                        SetMapCenterFlag = true;
                        //console.log(DefaultLat, DefaultLng);                    
                    }
                }
                if (jsonObj.GeoProperties != null)
                {
                    if (jsonObj.GeoProperties.length > 0)
                    {
                        DefaultZoom = jsonObj.GeoProperties[0].Zoom;
                    }
                }
                //console.log(DefaultLat +" : "+ DefaultLng +" : "+ SetMapCenterFlag);
            }); 
            OplMapObj = new OplMap(DefaultMapId, DefaultLat, DefaultLng, DefaultZoom);           
        } 

        // Scale control
        OplMapObj.createScaleControl();

        // Main control bar
        //var settingArray = [];
        //OplMapObj.createControlBar(settingArray);

        // Create WMS map.
        var WmsOplMapObj = new WmsOplMap(OplMapObj);

        // Create PP map.
        //var PPOplMapObj = new PPOplMap(OplMapObj, WmsOplMapObj);
        //var ppSettingArray = ['ShowPPGeoBookmark'];
        //PPOplMapObj.createPPOplMap(ppSettingArray);

        var wmsSettingArray = [];
        WmsOplMapObj.createWmsOplMap(wmsSettingArray);
        let createInteractionObj = WmsOplMapObj.createInteraction(false);

        // Remove main bar...
        OplMapObj.map.removeControl(OplMapObj.mainbar);

        function RenderGeometryStorageLocations() {
            let MarkerEnableSelect = true;
            let MarkerEnableDelete = true;
            let LineStringEnableSelect = true;
            let LineStringEnableDelete = true;
            let PolygonEnableSelect = true;
            let PolygonEnableDelete = true;

            // Render geometry storage locations : Warehouse
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Warehouser, $('#WarehouseId').val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Zone
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Zone, $('#ZoneId').val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Rack
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Rack, $('#RackId').val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Location        
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Location, $("input[name='Id']").val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Marker
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Marker, $("input[name='Id']").val(),
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
        }

        function enableMapFeatureFunc() {
            var enableMapFeature = readCookie('EnableMapFeature');
            //console.log(enableMapFeature);
            if (enableMapFeature == 'false') {
                $('#DivLoactionId').hide();
                $('#ShowMapBtId').show();
                $('#HideMapBtId').hide();
            } else {
                $('#DivLoactionId').css('visibility', 'visible'); // visible : hidden
                $('#DivLoactionId').show();
                $('#ShowMapBtId').hide();
                $('#HideMapBtId').show();
            }
        }

        // Extend a Function of dragBox event.
        createInteractionObj.Interactions.transform.on('select', function(e) {
            let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
            let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
            if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
            if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }

            let activeFeatureObj = WmsOplMapObj.ActiveFeatures;
            if (activeFeatureObj == null) { return; }
            if (activeFeatureObj.get('RefGrpKey') != "Square") { return; }

            let geoCoordinates = activeFeatureObj.getGeometry().getCoordinates();
            if (geoCoordinates == null) { return; }
            if (geoCoordinates[0].length <= 3)  { return; }

            let coord0 = geoCoordinates[0][0];
            let coord1 = geoCoordinates[0][1];
            let coord2 = geoCoordinates[0][2];
            let coord3 = geoCoordinates[0][3];
            let coord4 = geoCoordinates[0][4];

            let MeasureWidth = WmsOplMapObj.measureCoord(coord0, coord1);
            let MeasureLength = WmsOplMapObj.measureCoord(coord1, coord2);
            //console.log(MeasureWidth);
            //console.log(MeasureLength);

            let GeometryId = activeFeatureObj.get("Id");
            let PostData = new FormData();
            PostData.append("GeometryId", GeometryId);
            CallServicesWithFormData(GlobalGetGeometryUrl, false, PostData, function (data) {
                var jsonObj = jQuery.parseJSON(data);

                let StrokeColor = jsonObj.GeoProperties[0].StrokeColor;
                let StrokeWidth = jsonObj.GeoProperties[0].StrokeWidth;
                let FillR = jsonObj.GeoProperties[0].FillR;
                let FillG = jsonObj.GeoProperties[0].FillG;
                let FillB = jsonObj.GeoProperties[0].FillB;
                let FillOpacity = jsonObj.GeoProperties[0].FillOpacity;

                // get Latitude and Longitude
                let lnglat;
                if (geoCoordinates[0].length == 4) 
                {
                    lnglat = ol.proj.transform(geoCoordinates[0][0], 'EPSG:3857', 'EPSG:4326');
                } else if  (geoCoordinates[0].length == 5) {
                    lnglat = ol.proj.transform(geoCoordinates[0][2], 'EPSG:3857', 'EPSG:4326');                    
                }  	
                let jsonLatLng = [{ lat: lnglat[1], lng: lnglat[0] }];   
                let featureObj = WmsOplMapObj.createSquare(jsonLatLng, activeFeatureObj.getId(), MeasureWidth, MeasureLength, "", StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);
            });
        });           

        //$('#DivLoactionId').hide();
        $('#ShowMapBtId').click(function (e) {
            e.preventDefault();
            createCookie('EnableMapFeature', 'true', 1);
            enableMapFeatureFunc();
            if (ShowMapToggle == 0) {
                RenderGeometryStorageLocations();
                ShowMapToggle = 1;
            }
        });

        $('#HideMapBtId').click(function (e) {
            e.preventDefault();
            createCookie('EnableMapFeature', 'false', 1);
            enableMapFeatureFunc();
        }); 

        $('#SelectId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.setInteraction('transform');
            WmsOplMapObj.Interactions.transform.set('scale', false);
            $('#PlacemarkBtId').show();
            $('#ConfirmPlacemarkBtId').hide();

            let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
            let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
            if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
            if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }

            WmsOplMapObj.ActivePlacemarkLngLat = false;
            WmsOplMapObj.ClearMap();
        });

        $('#LineStringId').click(function (e) {
            e.preventDefault();

            let InpuData = {
                GeometryId: '',
                GeoType: Location,
                RefGrpKey: 'LineString',
                RefKey: $("input[name='Id']").val(),
                Name: $('#location-name').val(),
                Description: $('#Description').val(),
                IsActive: true,
                StrokeColor: '',
                FillR: '',
                FillG: '',
                FillB: '',
                GeoCoordinates: ''
            }
            WmsOplMapObj.setInteraction('draw', InpuData);

        });

        $('#PolygonId').click(function (e) {
            e.preventDefault();

            let InpuData = {
                GeometryId: '',
                GeoType: Location,
                RefGrpKey: 'Polygon',
                RefKey: $("input[name='Id']").val(),
                Name: $('#location-name').val(),
                Description: $('#Description').val(),
                IsActive: true,
                StrokeColor: '',
                FillR: '',
                FillG: '',
                FillB: '',
                GeoCoordinates: ''
            }
            WmsOplMapObj.setInteraction('drawPolygon', InpuData);

        });

        $('#SquareId').click(function (e) {
            e.preventDefault();

            let InpuData = {
                GeometryId: '',
                GeoType: Location,
                RefGrpKey: 'Square',
                RefKey: $("input[name='Id']").val(),
                Name: $('#location-name').val(),
                Description: $('#Description').val(),
                IsActive: true,
                StrokeColor: '',
                FillR: '',
                FillG: '',
                FillB: '',
                GeoCoordinates: ''
            }
            WmsOplMapObj.setInteraction('drawRegular', InpuData);

        });

        $('#OffSetId').click(function (e) {
            e.preventDefault();
            WmsOplMapObj.setInteraction('offset');
        });

        $('#FillColorId').click(function (e) {
            e.preventDefault();

            let GeometryId = WmsOplMapObj.ActiveFeatures.get('Id');
            let StrokeColor = $("#FillFeatureColorColorId").val();
            let FillColor = $("#FillFeatureColorColorId").val();
            if ((StrokeColor == "") || (FillColor == "")) return false;
            let FillR = hexToRgb(FillColor).r;
            let FillG = hexToRgb(FillColor).g;
            let FillB = hexToRgb(FillColor).b;
            let Feature = WmsOplMapObj.ActiveFeatures;
            let Type = WmsOplMapObj.ActiveFeatures.get('RefGrpKey');
            let FillOpacity = 0.5;
            let StrokeWidth = 1;
            WmsOplMapObj.setFeatureColor(Feature, Type, "", StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);

            let PostData = new FormData();
            PostData.append("GeometryId", GeometryId);
            PostData.append("StrokeColor", StrokeColor);
            PostData.append("StrokeWidth", StrokeWidth);
            PostData.append("FillR", FillR);
            PostData.append("FillG", FillG);
            PostData.append("FillB", FillB);
            PostData.append("FillOpacity", FillOpacity);

            CallServicesWithFormData(GlobalUpdateGeoPropertiesUrl, false, PostData, function (data) {
                var jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);
            });

        });

        $('#TransformId').click(function (e) {
            e.preventDefault();

            WmsOplMapObj.setInteraction('transform');
            WmsOplMapObj.Interactions.transform.set('scale', true);
        });

        $('#ModifyId').click(function (e) {
            e.preventDefault();

            WmsOplMapObj.setInteraction('modifyfeature');
        });

        $('#DeleteId').click(function (e) {
            e.preventDefault();

            WmsOplMapObj.deleteGeometryActiveFeatures();
        });

        $('#ConfirmPlacemarkBtId').hide();
        $('#PlacemarkBtId').click(function (e) {
            e.preventDefault();
            $('#PlacemarkBtId').hide();
            $('#ConfirmPlacemarkBtId').show();
            WmsOplMapObj.ActivePlacemarkLngLat = true;
        });

        $('#ConfirmPlacemarkBtId').click(function (e) {
            e.preventDefault();
            $('#PlacemarkBtId').show();
            $('#ConfirmPlacemarkBtId').hide();
            WmsOplMapObj.ActivePlacemarkLngLat = false;

            if (WmsOplMapObj.PlacemarkLngLatValue == null) return;
            let MarkerLng = WmsOplMapObj.PlacemarkLngLatValue[0];
            let MarkLat = WmsOplMapObj.PlacemarkLngLatValue[1];

            let GeometryId = '';
            let GeoType = Marker;
            let RefGrpKey = 'Marker';
            let RefKey = $("input[name='Id']").val();
            let Name = '';
            let Description = '';
            let IsActive = true;
            let StrokeColor = '';
            let FillR = '';
            let FillG = '';
            let FillB = '';
            let GeoCoordinates = [[MarkerLng, MarkLat]];
            let jsonObj = WmsOplMapObj.createOrUpdateDraw(GeometryId, GeoType, RefGrpKey, RefKey, Name, Description, IsActive, StrokeColor, FillR, FillG, FillB, GeoCoordinates);
            //console.log(jsonObj);
            if (jsonObj.Result == true) {
                let DrawId = "DRAWID" + jsonObj.Geometry.Id;
                var markerObj = OplMapObj.addMarker(MarkLat, MarkerLng, DrawId, "");
                markerObj.setProperties({
                    'Id': jsonObj.Geometry.Id,
                    'Type': 'Marker',
                    'EnableDelete': true,
                    'RefGrpKey': jsonObj.Geometry.RefGrpKey,
                    'RefKey': jsonObj.Geometry.RefKey,
                    'Container': '',
                    'SketchGeoCoordinates': ''
                });                
            }

            $(".placemarkLngLatClass").remove();
        });

        $("#MapPropertyId").click(function (e) {
            e.preventDefault();

            let measureVector1 = OplMapObj.fineLayerByName('measureVector1');
            let measureVector2 = OplMapObj.fineLayerByName('measureVector2');
            if (typeof measureVector1 !== 'undefined') { OplMapObj.map.removeLayer(measureVector1); }
            if (typeof measureVector2 !== 'undefined') { OplMapObj.map.removeLayer(measureVector2); }	            

            if (WmsOplMapObj.ActiveFeatures == null) return;

            // Clear interface...
            $("#PropNameId").val('');
            $("#PropDescId").val('');
            $("#PropStrokeColorId").val('');
            $("#PropStrokeWidthId").val('');
            $("#PropFillColorId").val('');
            $("#PropOpacityId").val('');
            $("#PropZoomId").val('');
            $("#PropIsDefaultId").prop("checked", false);
            $("#PropWidthId").val('');
            $("#PropLengthId").val('');

            //$(".input-group-addon > i").removeAttr('style');   

            $('#mdMapPropertyId').modal('show');
            let GeometryId = WmsOplMapObj.ActiveFeatures.get('Id');
            //console.log(GeometryId);

            if (GeometryId != "") {
                NProgress.configure({ parent: "#mdBodyMapPropertyId" });
                NProgress.configure({ showSpinner: false });
                NProgress.start();	

                let PostData = new FormData();
                PostData.append("GeometryId", GeometryId);
                CallServicesWithFormData(GlobalGetGeometryUrl, false, PostData, function (data) {
                    var jsonObj = jQuery.parseJSON(data);
                    //console.log(jsonObj);

                    $('#DivPropIsDefaultId').hide();
                    $('#DivPropZoomId').hide();
                    $('#HPropResizeId').hide();
                    $('#DivPropWidthId').hide();
                    $('#DivPropLengthId').hide();
                    if (jsonObj.RefGrpKey == "Marker") {
                        $('#DivPropIsDefaultId').show();
                        $('#DivPropZoomId').show();
                    } else if (jsonObj.RefGrpKey == "Square") {
                        $('#HPropResizeId').show();	
                        $('#DivPropWidthId').show();
                        $('#DivPropLengthId').show();
                        
                        let source = OplMapObj.vectorLayer.getSource();
                        let squareObj = source.getFeatureById("DRAWID" + jsonObj.Id);    
                        let coord = squareObj.getGeometry().getCoordinates();
                        //console.log(coord);

                        let coord0 = coord[0][0];
                        let coord1 = coord[0][1];
                        let coord2 = coord[0][2];
                        let coord3 = coord[0][3];
                        //console.log(coord0);
                        //console.log(coord1);
                        //console.log(coord2);
                        //console.log(coord3);

                        let MeasureWidth = WmsOplMapObj.measureCoord(coord0, coord1);
                        let MeasureLength = WmsOplMapObj.measureCoord(coord1, coord2);
                        //console.log(MeasureWidth);
                        //console.log(MeasureLength);

                        $("#PropWidthId").val(MeasureWidth);
                        $("#PropLengthId").val(MeasureLength);                         
                    } 

                    let Name = jsonObj.Name;
                    let Description = jsonObj.Description;
                    let StrokeColor = jsonObj.GeoProperties[0].StrokeColor;
                    let StrokeWidth = jsonObj.GeoProperties[0].StrokeWidth;
                    let FillR = jsonObj.GeoProperties[0].FillR;
                    let FillG = jsonObj.GeoProperties[0].FillG;
                    let FillB = jsonObj.GeoProperties[0].FillB;
                    let FillOpacity = jsonObj.GeoProperties[0].FillOpacity;
                    let HexFillColor = rgbToHex(FillR, FillG, FillB); 
                    let Zoom = jsonObj.GeoProperties[0].Zoom;
                    if ((Zoom == '') || (Zoom == null)) { Zoom = 18; }                    

                    $("#PropNameId").val(Name);
                    $("#PropDescId").val(Description);
                    $("#PropStrokeColorId").colorpicker('setValue', StrokeColor);
                    $("#PropStrokeWidthId").val(StrokeWidth);
                    $("#PropFillColorId").colorpicker('setValue', HexFillColor);
                    $("#PropOpacityId").val(FillOpacity);
                    $("#PropZoomId").val(Zoom);

                    if (jsonObj.GeoProperties[0].IsDefault == true) {
                        $("#PropIsDefaultId").prop("checked", true);
                    } else {
                        $("#PropIsDefaultId").prop("checked", false);
                    }
                });

                NProgress.done();
                NProgress.remove();
            }

        });

        $("#SavePropertyId").click(function (e) {
            e.preventDefault();

            let GeometryId = WmsOplMapObj.ActiveFeatures.get('Id');
            //console.log(GeometryId);

            NProgress.configure({ parent: "#mdBodyMapPropertyId" });
            NProgress.configure({ showSpinner: false });
            NProgress.start();	

            if (GeometryId != "")
            {
                // Get geometry object.
                let GeometryObj;
                let PostData = new FormData();
                PostData.append("GeometryId", GeometryId);
                CallServicesWithFormData(GlobalGetGeometryUrl, false, PostData, function (data) {
                    GeometryObj = jQuery.parseJSON(data);                    
                });
                //console.log(GeometryObj);

                // Save geometry header.
                let PostData1 = new FormData();
                PostData1.append("GeometryId", GeometryId);
                PostData1.append("Name", $("#PropNameId").val());
                PostData1.append("Description", $("#PropDescId").val());
                CallServicesWithFormData(GlobalSaveGeometryDescUrl, false, PostData1, function (data) {
                    var jsonObj = jQuery.parseJSON(data);
                    //console.log(jsonObj);
                });

                let ChkIsDefault = $("#PropIsDefaultId").is(":checked");
                //console.log(ChkIsDefault);

                // Save and set object properties.
                let StrokeColor = $("#PropStrokeColorId").val();
                let FillColor = $("#PropFillColorId").val();
                let FillR = hexToRgb(FillColor).r;
                let FillG = hexToRgb(FillColor).g;
                let FillB = hexToRgb(FillColor).b;
                let Feature = WmsOplMapObj.ActiveFeatures;
                let Type = GeometryObj.RefGrpKey;
                let FillOpacity = $("#PropOpacityId").val();
                let StrokeWidth = $("#PropStrokeWidthId").val();
                WmsOplMapObj.setFeatureColor(Feature, Type, $("#PropNameId").val(), StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);

                let PostData2 = new FormData();
                PostData2.append("GeometryId", GeometryId);
                PostData2.append("StrokeColor", StrokeColor);
                PostData2.append("StrokeWidth", StrokeWidth);
                PostData2.append("FillR", FillR);
                PostData2.append("FillG", FillG);
                PostData2.append("FillB", FillB);
                PostData2.append("FillOpacity", FillOpacity);
                PostData2.append("Zoom", $("#PropZoomId").val());
                PostData2.append("IsDefault", ChkIsDefault);

                CallServicesWithFormData(GlobalUpdateGeoPropertiesUrl, false, PostData2, function (data) {
                    var jsonObj = jQuery.parseJSON(data);
                    //console.log(jsonObj);
                });

                // Resize...
                let Width = $("#PropWidthId").val();
                let Length = $("#PropLengthId").val();
                if ((Width !== null) && (Length !== null))
                {
                    if ((Width !== "") && (Length !== ""))
                    {
                        Width = parseFloat(Width);
                        Length = parseFloat(Length);
                        WmsOplMapObj.resizeRectangle(GeometryId, Width, Length, "", StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity); 
                    }
                }                
            }

            NProgress.done();
            NProgress.remove();
            $('#mdMapPropertyId').modal('hide');
        });

        $("#RenderCurrentLocationId").hide();
        $("#RenderLocationId").click(function (e) {
            e.preventDefault();

            $("#RenderLocationId").hide();
            $("#RenderCurrentLocationId").show();

            // Remove all features.
            OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                OplMapObj.vectorLayer.getSource().removeFeature(feature);;
            });

            let MarkerEnableSelect = true;
            let MarkerEnableDelete = true;
            let LineStringEnableSelect = true;
            let LineStringEnableDelete = true;
            let PolygonEnableSelect = true;
            let PolygonEnableDelete = true;            

            // Render geometry storage locations : Marker
            WmsOplMapObj.renderGeometryStorageLocations(GlobalRenderGeometryByLocationUrl, Marker, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Warehouse
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Warehouser, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Zone
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Zone, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Rack
            WmsOplMapObj.renderGeometryStorageLocations(GlobalGetGeometryStorageLocationsUrl, Rack, '',
                                                        MarkerEnableSelect, MarkerEnableDelete,
                                                        LineStringEnableSelect, LineStringEnableDelete,
                                                        PolygonEnableSelect, PolygonEnableDelete);            
            // Render geometry storage locations : Location
            MarkerEnableSelect = true;
            MarkerEnableDelete = true;
            PolygonEnableSelect = true;
            PolygonEnableDelete = true;            
            WmsOplMapObj.renderGeometryByLocation(GlobalRenderGeometryByLocationUrl, Location,
                                                  MarkerEnableSelect, MarkerEnableDelete,
                                                  PolygonEnableSelect, PolygonEnableDelete);
        });

        $("#RenderCurrentLocationId").click(function (e) {
            e.preventDefault();

            $("#RenderLocationId").show();
            $("#RenderCurrentLocationId").hide();

            // Remove all features.
            OplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                OplMapObj.vectorLayer.getSource().removeFeature(feature);;
            });

            RenderGeometryStorageLocations();
        });

        var $div = $('<div />').appendTo('body');
        $div.attr('id', 'fullScreenControlId');
        $div.hide();
        var divFullScreenControl = document.querySelector('#fullScreenControlId');
        var fullScreenControl = new ol.control.FullScreen({ target: divFullScreenControl });
        OplMapObj.map.addControl(fullScreenControl);
        $('#FullScreenId').click(function (e) {
            e.preventDefault();
            $('.ol-full-screen-false').trigger("click");
        });

    }

});