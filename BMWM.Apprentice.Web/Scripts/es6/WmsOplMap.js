
/*
 * feature propertity
'Id': '',
'Type': '',
'EnableSelect' : false,
'EnableDelete': false,
'RefGrpKey': '',
'RefKey': '',
'Container': '',
'Description': '',
'SketchGeoCoordinates': ''
*/

import {platformModifierKeyOnly} from 'ol/events/condition';

export default class WmsOplMap {

    constructor(OplMapObj) {
        this.OplMapObj = OplMapObj;
       
        this.ActiveFeatures;
        this.ActiveFeaturesCoordinate;
        this.ActiveFeatureGroup = [];
        this.ActivePlacemarkLngLat = false;
        this.MultiSelect = false;
        this.SelectFeaturesId = [];
        this.SelectFeatures = [];
        this.PlacemarkLngLatValue;
        this.Interactions;
        this.DrawCoordArray = [];
        this.DrawLngLatArray = [];
        this.InputData;

        this.DefaultStrokeColor = '#ff8000';
        this.DefaultStrokeWidth = '1.5';
        this.DefaultFillR = '241';
        this.DefaultFillG = '192';
        this.DefaultFillB = '162';
        this.DefaultFillOpacity = '0.3';
    }

    createPolygonArea(oplMapObj, jsonLatLng, featureId) {
        var ringArea = [];
        for (var i = 0; i < jsonLatLng.length; i++) {
            ringArea.push([jsonLatLng[i].lng, jsonLatLng[i].lat]);
        }

        var polygonArea = new ol.geom.Polygon([ringArea]);
        polygonArea.transform('EPSG:4326', 'EPSG:3857');

        var featureObj = new ol.Feature(polygonArea);
        if (featureId != "") { featureObj.setId(featureId); }

        oplMapObj.vectorLayer.getSource().addFeature(featureObj);
    }

    createStoreAreaGridReference() {
        var jsonPicingArea = [{ lat: 14.070728, lng: 101.823832 }, { lat: 14.069471, lng: 101.824397 }]

        var gridSizeX = 26;
        var gridSizeY = 26;
        this.storeAreaGridReference = this.OplMapObj.createGridReference(jsonPicingArea, gridSizeX, gridSizeY);
    }

    removeStoreAreaGridReference() {
        this.OplMapObj.map.removeControl(this.storeAreaGridReference);
    }

    createWmsOplMap(setting) {

        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;
        
        var SearchTagSetting = false;
        var SearchGrpTagSetting = false;
        var SelectMoveFeaturesSetting = false;
        var CreatePlacemarkSetting = false;
        var RemovePlacemarkSetting = false;
        var SelectGeoMarkerSetting = false;
        var MoveFeatureSetting = false;
        var ScaleToggleSetting = false;
        var CreateStoreAreaGridRefSetting = false;
        var DeleteFeatureSetting = false;
        var PrintControlSetting = false;
        var TransferConfirmSetting = false;
        var ClearSetting = false;
        var FullScreenControlSetting = false;

        for (let ele of setting) {
            if (ele == 'SearchTag') {
                SearchTagSetting = true;
            } else if (ele == 'SearchGrpTag') {
                SearchGrpTagSetting = true;
            } else if (ele == 'SelectMoveFeatures') {
                SelectMoveFeaturesSetting = true;
            } else if (ele == 'CreatePlacemark') {
                CreatePlacemarkSetting = true;
            } else if (ele == 'RemovePlacemark') {
                RemovePlacemarkSetting = true;
            } else if (ele == 'SelectGeoMarker') {
                SelectGeoMarkerSetting = true;
            } else if (ele == 'MoveFeature') {
                MoveFeatureSetting = true;
            } else if (ele == 'ScaleToggle') {
                ScaleToggleSetting = true;
            } else if (ele == 'GridRef') {
                CreateStoreAreaGridRefSetting = true;
            } else if (ele == 'DeleteFeature') {
                DeleteFeatureSetting  = true;
            } else if (ele == 'PrintControl') {
                PrintControlSetting = true;
            } else if (ele == 'TransferConfirm') {
                TransferConfirmSetting = true;
            } else if (ele == 'Clear') {
                ClearSetting = true;
            } else if (ele == 'FullScreenControl') {
                FullScreenControlSetting  = true;
            }
        } 

        // Map on click event
        oplMapObj.map.on("click", function (e) {
            e.preventDefault();

            //var lnglat = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
            //var lng = lnglat[0];
            //var lat = lnglat[1];
            //$('#CurrentLngLatId').text('lat: ' + lat + ', lng: ' + lng);

            var pixel = oplMapObj.map.getEventPixel(e.originalEvent);
            var hit = oplMapObj.map.hasFeatureAtPixel(pixel);
            var feature = oplMapObj.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) { return feature; });

            //$(".deleteFeatureButtonClass").hide();
            if (hit) {
                //console.log(feature);            
                //wmsOplMapObj.ActiveFeatures = feature;
                //if (typeof wmsOplMapObj.ActiveFeatures.get('Id') !== 'undefined') {
                //    $(".deleteFeatureButtonClass").show();
                //}
            }

            if (wmsOplMapObj.ActivePlacemarkLngLat == true) {
                $(".placemarkLngLatClass").remove();

                // get Latitude and Longitude
                var lnglat = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
                var lng = lnglat[0];
                var lat = lnglat[1];
                //$('#CurrentLngLatId').text('lat: ' + lat + ', lng: ' + lng);
                console.log('lat: ' + lat + ', lng: ' + lng)
                
                let LatLng = "Latitude : " + lat +"<br/>Longitude : " + lng;
                $('#MapInfoId').summernote('code', LatLng);
    
                var point = ol.proj.fromLonLat([lng, lat]);
                //$('#CurrentCoordinatesId').text(point);

                var PlacemarkLngLat = new ol.Overlay.Placemark({
                    //color: '#369',
                    popupClass: 'placemarkLngLatClass',
                    //backgroundColor : 'yellow',
                    position: point,
                    autoPan: true,
                    onshow: function () { /*console.log("You opened a placemark");*/ },
                    autoPanAnimation: { duration: 250 }
                });
                oplMapObj.map.addOverlay(PlacemarkLngLat);
                //oplMapObj.PlacemarkLngLat.show(placemark.getPosition(), "<i class=\"fa fa-qrcode\"></i>");

                wmsOplMapObj.PlacemarkLngLatValue = lnglat;               
            } // end if
            //console.log(wmsOplMapObj.PlacemarkLngLatValue);
        }); // map on click

        //// Add selection tool (a toggle control with a select interaction)
        //var GridReferenceCtrl = new ol.control.Toggle({
        //    html: '<i class="glyphicon glyphicon-th"></i>',
        //    className: "gridReference",
        //    title: "Grid Reference",
        //    interaction: new ol.interaction.Select(),
        //    active: true,
        //    onToggle: function (active) {
        //        if (active == true) {
        //            //console.log("activated...");
        //            wmsOplMapObj.createStoreAreaGridReference();
        //        } else if (active == false) {
        //            //console.log("deactivated...");
        //            wmsOplMapObj.removeStoreAreaGridReference();
        //        }
        //    }
        //});
        //this.OplMapObj.mainbar.addControl(GridReferenceCtrl);

        if (SearchTagSetting == true) {
            var searchTagBt = new ol.control.Button(
            {
                className: "searchTagBtClass",
                html: '<i class="fa fa-search"></i>',
                title: "Search Tag",
                handleClick: function (e) {
                    wmsOplMapObj.showSearchObject();
                }
            });
            this.OplMapObj.mainbar.addControl(searchTagBt);
        }

        if (SearchGrpTagSetting == true) {
            var searchGrpTagBt = new ol.control.Button(
            {
                className: "searchGrpTagBtClass",
                html: '<i class="fa fa-search-plus"></i>',
                title: "Search Tag Group",
                handleClick: function (e) {
                    wmsOplMapObj.showSearchGroupObject();
                }
            });
            this.OplMapObj.mainbar.addControl(searchGrpTagBt);
        }

        if (SelectMoveFeaturesSetting == true) {
            var selectMoveFeaturesBt = new ol.control.Button(
            {
                className: "searchGrpTagBtClass",
                html: '<i class="fa fa-hand-o-up"></i>',
                title: "Select Tags",
                handleClick: function (e) {
                    wmsOplMapObj.showMoveGroupObject();
                }
            });
            this.OplMapObj.mainbar.addControl(selectMoveFeaturesBt);
        }

        if (CreatePlacemarkSetting == true) {
            var createPlacemarkBt = new ol.control.Button(
            {
                className: "createPlacemarkBtClass",
                html: '<i class="fa fa-map-marker"></i>',
                title: "Create placemark",
                handleClick: function (e) {
                    wmsOplMapObj.ActivePlacemarkLngLat = true;
                    $(".createPlacemarkBtClass").hide();
                    $(".removePlacemarkBtClass").show();
                    $(".placemarkLngLatClass").remove();
                }
            });
            this.OplMapObj.mainbar.addControl(createPlacemarkBt);
        }

        if (RemovePlacemarkSetting == true) {
            var removePlacemarkBt = new ol.control.Button(
            {
                className: "removePlacemarkBtClass",
                html: '<i class="fa fa-check"></i>',
                title: "Mark",
                handleClick: function (e) {
                    wmsOplMapObj.ActivePlacemarkLngLat = false;
                    $(".createPlacemarkBtClass").show();
                    $(".removePlacemarkBtClass").hide();
                    $(".placemarkLngLatClass").remove();

                    var point = ol.proj.fromLonLat([wmsOplMapObj.PlacemarkLngLatValue[0], wmsOplMapObj.PlacemarkLngLatValue[1]]);
                    var PlacemarkLngLat = new ol.Overlay.Placemark({
                        //color: '#369',
                        popupClass: 'placemarkLngLatClass',
                        //backgroundColor : 'yellow',
                        position: point,
                        autoPan: true,
                        onshow: function () { /*console.log("You opened a placemark");*/ },
                        autoPanAnimation: { duration: 250 }
                    });
                    oplMapObj.map.addOverlay(PlacemarkLngLat);
                    //oplMapObj.PlacemarkLngLat.show(placemark.getPosition(), "<i class=\"fa fa-qrcode\"></i>");
                }
            });
            this.OplMapObj.mainbar.addControl(removePlacemarkBt);
            $(".createPlacemarkBtClass").show();
            $(".removePlacemarkBtClass").hide();
        }

        if (SelectGeoMarkerSetting == true) {
            var selectGeoMarkerBt = new ol.control.Button(
                {
                    className: "selectGeoMarkerBtClass",
                    html: '<i class="fa fa-location-arrow"></i>',
                    title: "Select move to location",
                    handleClick: function (e) {
                        wmsOplMapObj.showActiveGeoMarker();
                    }
                });
            this.OplMapObj.mainbar.addControl(selectGeoMarkerBt);
        }

        if (MoveFeatureSetting == true) {
            var moveFeatureBt = new ol.control.Button(
                {
                    className: "moveFeatureBtClass",
                    html: '<i class="fa fa-truck"></i>',
                    title: "Transfer Inventory",
                    handleClick: function (e) {

                        //wmsOplMapObj.SelectFeaturesId.push("DRAWID160");
                        //wmsOplMapObj.SelectFeaturesId.push("DRAWID161");
                        //wmsOplMapObj.SelectFeaturesId.push("DRAWID162");

                        if (typeof wmsOplMapObj.ActiveFeatures !== 'undefined') {
                            //var sourcePoint = wmsOplMapObj.ActiveFeaturesCoordinate;
                            //var destinationPoint = ol.proj.fromLonLat([wmsOplMapObj.PlacemarkLngLatValue[0], wmsOplMapObj.PlacemarkLngLatValue[1]]);
                            //var deltaX = parseFloat(destinationPoint[0]) - sourcePoint[0];
                            //var deltaY = parseFloat(destinationPoint[1]) - sourcePoint[1];
                            //wmsOplMapObj.ActiveFeatures.getGeometry().translate(deltaX, deltaY);

                            //var coordArray = [];
                            //coordArray = wmsOplMapObj.convertCoordsToGeoArray(wmsOplMapObj.ActiveFeatures.getGeometry().getCoordinates());
                            //wmsOplMapObj.saveSketchGeometryFeatureCoordinates(SaveSketchGeometryFeatureCoordinatesUrl, wmsOplMapObj.ActiveFeatures.get('Id'), wmsOplMapObj.ActiveFeatures.get('RefKey'), coordArray);

                            var destinationPoint = ol.proj.fromLonLat([wmsOplMapObj.PlacemarkLngLatValue[0], wmsOplMapObj.PlacemarkLngLatValue[1]]);
                            oplMapObj.goToCoord(destinationPoint[0], destinationPoint[1]);
                            wmsOplMapObj.moveSingleFeature(wmsOplMapObj.ActiveFeatures, wmsOplMapObj.ActiveFeaturesCoordinate, wmsOplMapObj.PlacemarkLngLatValue);
                        }
                        else if (wmsOplMapObj.SelectFeaturesId.length > 0)
                        {
                            if (typeof wmsOplMapObj.PlacemarkLngLatValue === 'undefined') return true;
                            var toLngLat = wmsOplMapObj.PlacemarkLngLatValue;
                            //console.log(toLngLat);

                            wmsOplMapObj.ActiveFeatureGroup = [];
                            var GrpSelectIdArray = wmsOplMapObj.SelectFeaturesId;
                            for (var i = 0; i < GrpSelectIdArray.length; i++) {
                                var inputFeatureAttrId = GrpSelectIdArray[i];
                                oplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                                    var featureAttrId = feature.get("Id");
                                    if (typeof feature.get('Id') !== 'undefined') {
                                        if ("DRAWID" + featureAttrId.toString() == inputFeatureAttrId) {
                                            //console.log("true... DRAWID" + featureAttrId.toString() + " " + inputFeatureAttrId);                      
                                            wmsOplMapObj.ActiveFeatureGroup.push(feature);
                                            return true;
                                        }
                                    } // end if               
                                });
                            }
                            //console.log(wmsOplMapObj.ActiveFeatureGroup);

                            var destinationPoint = ol.proj.fromLonLat([toLngLat[0], toLngLat[1]]);
                            oplMapObj.goToCoord(destinationPoint[0], destinationPoint[1]);

                            // Move...
                            for (var i = 0; i < wmsOplMapObj.ActiveFeatureGroup.length; i++) {
                                var feature = wmsOplMapObj.ActiveFeatureGroup[i];
                                var fPoint = feature.getGeometry().getCoordinates();
                                wmsOplMapObj.moveSingleFeature(feature, fPoint[0][0], toLngLat);
                            }
                        }
                    }
                });
            this.OplMapObj.mainbar.addControl(moveFeatureBt);
        }

        if (ScaleToggleSetting == true) {
            var scaleToggleBt = new ol.control.Toggle({
                html: '<i class="fa fa-object-group"></i>',
                className: "enableScaleBtClass",
                title: "ScaleScale",
                interaction: new ol.interaction.Select(),
                active: false,
                onToggle: function (active) {
                    if (active == true) {
                        //console.log("activated...");
                        wmsOplMapObj.Interactions.transform.set('scale', true);
                    } else if (active == false) {
                        //console.log("deactivated...");
                        wmsOplMapObj.Interactions.transform.set('scale', false);
                    }
                }
            });
            this.OplMapObj.mainbar.addControl(scaleToggleBt);
        }

        if (CreateStoreAreaGridRefSetting == true) {
            var createStoreAreaGridRefBt = new ol.control.Button(
                {
                    className: "createStoreAreaGridRefClass",
                    html: '<i class="fa fa-slack"></i>',
                    title: "Create Grid Reference",
                    handleClick: function (e) {
                        $(".createStoreAreaGridRefClass").hide();
                        $(".removeStoreAreaGridRefClass").show();
                        wmsOplMapObj.createStoreAreaGridReference();
                    }
                });
            this.OplMapObj.mainbar.addControl(createStoreAreaGridRefBt);

            var removeStoreAreaGridRefBt = new ol.control.Button(
                {
                    className: "removeStoreAreaGridRefClass",
                    html: '<i class="fa fa-ban"></i>',
                    title: "Remove Grid Reference",
                    handleClick: function (e) {
                        $(".createStoreAreaGridRefClass").show();
                        $(".removeStoreAreaGridRefClass").hide();
                        wmsOplMapObj.removeStoreAreaGridReference();
                    }
                });
            this.OplMapObj.mainbar.addControl(removeStoreAreaGridRefBt);
        
            // Initialize grid reference.
            //$(".createStoreAreaGridRefClass").hide();
            //$(".removeStoreAreaGridRefClass").show();
            //wmsOplMapObj.createStoreAreaGridReference();
            $(".createStoreAreaGridRefClass").show();
            $(".removeStoreAreaGridRefClass").hide();
        }

        if (DeleteFeatureSetting == true) {
            var deleteFeatureBt = new ol.control.Button({
                className: "deleteFeatureButtonClass",
                html: '<i class="fa fa fa-trash-o"></i>',
                title: "Delete feature",
                handleClick: function (e) {
                    if (typeof wmsOplMapObj.ActiveFeatures !== 'undefined') {
                        if (wmsOplMapObj.ActiveFeatures.get('Id') != "") {
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
                                            //console.log("Remove features... " + wmsOplMapObj.ActiveFeatures.get('Id'));
                                            let source = oplMapObj.vectorLayer.getSource();
                                            source.removeFeature(wmsOplMapObj.ActiveFeatures);
                                            wmsOplMapObj.deleteSketchGeometry(GlobalDeleteSketchGeometryUrl, wmsOplMapObj.ActiveFeatures.get('Id'));
                                        } // end callback
                                    }
                                },
                                onEscape: function () {

                                }
                            });

                            modal.modal("show");
                        }
                    }
                }
            });
            this.OplMapObj.mainbar.addControl(deleteFeatureBt);
            $(".deleteFeatureButtonClass").hide();
        }

        if (PrintControlSetting == true) {
            // Print control ----------------------------------------------------------------------------------------------------------------
            var printControlBt = new ol.control.Print({
                className: "printControlButtonClass"
            });
            this.OplMapObj.mainbar.addControl(printControlBt);
            $(".printControlButtonClass").hide();

            /* On print > save image file */
            printControlBt.on('print', function (e) {
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

            var printFeature = new ol.control.Button({
                className: "printFeatureButtonClass",
                html: '<i class="fa fa-file-pdf-o"></i>',
                title: "Download PDF file",
                handleClick: function (e) {
                    printControlBt.print({ imageType: 'image/jpeg', pdf: true });
                }
            });
            this.OplMapObj.mainbar.addControl(printFeature);
            //End print control ----------------------------------------------------------------------------------------------------------------
        }

        if (TransferConfirmSetting == true) {
            var TransferConfirmBt = new ol.control.Button(
            {
                className: "TransferConfirmBtClass",
                html: '<i class="fa fa-street-view"></i>',
                title: "Transfer Confirm",
                handleClick: function (e) {

                    if (typeof wmsOplMapObj.ActiveFeatures === 'undefined') return true;

                    var modal = bootbox.dialog({
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
                                    let Container = wmsOplMapObj.ActiveFeatures.get('Container');                                         
                                    wmsOplMapObj.transferConfirm(Container, wmsOplMapObj.ActiveFeatures);
                                } // end callback
                            }
                        },
                        onEscape: function () {

                        }
                    });

                    modal.modal("show");        
                }
            });
            this.OplMapObj.mainbar.addControl(TransferConfirmBt);
        }

        if (ClearSetting == true) {
            var clearBt = new ol.control.Button(
            {
                className: "clearBtClass",
                html: '<i class="fa fa-globe"></i>',
                title: "Clear",
                handleClick: function (e) {
                    wmsOplMapObj.ClearMap();
                }
            });
            this.OplMapObj.mainbar.addControl(clearBt);
        }

        if (FullScreenControlSetting == true) {
            // Full screen control
            this.OplMapObj.mainbar.addControl(new ol.control.FullScreen());
        }

        //var save = new ol.control.Button(
        //{
        //    html: '<i class="fa fa-download"></i>',
        //    title: "Save",
        //    handleClick: function (e) {
        //        var json = new ol.format.GeoJSON().writeFeatures(oplMapObj.vectorLayer.getSource().getFeatures());
        //        $('#info').text(json);
        //    }
        //});
        //this.OplMapObj.mainbar.addControl(save);

        //this.TestMeasuringDistances();
        //this.createSquare(1500, 1500);
    }

    ClearMap() {
        $(".placemarkClass").remove();
        $(".placemarkLngLatClass").remove();
        this.PlacemarkLngLatValue = null;
    }

    setFeatureColor(Feature, Type, Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity) {

        function MarkerStyleFunction(Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity) {
            return [
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: [FillR, FillG, FillB, FillOpacity]
                        }),
                        stroke: new ol.style.Stroke({
                            color: StrokeColor,
                            width: StrokeWidth
                        }),
                    }),
                    text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({ color: '#000' }),
                        stroke: new ol.style.Stroke({
                            color: '#fff', width: 2
                        }),
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetY: -5,
                        text: Text
                    }),
                    zIndex: 10
                })
            ];
        }	

        function lineStyleFunction(color) {
            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 2
                    })
                })
            ];
        }

        function polyconStyleFunction(Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity) {
            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: StrokeColor,
                        width: StrokeWidth
                    }),
                    fill: new ol.style.Fill({
                        color: [FillR, FillG, FillB, FillOpacity]
                    }),
                    text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({ color: '#000' }),
                        stroke: new ol.style.Stroke({
                            color: '#fff', width: 2
                        }),
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetY: -5,
                        text: Text
                    }),
                    zIndex: 0
                })
            ];
        }

        if (Type == 'Marker') {
            Feature.setStyle(MarkerStyleFunction(Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity));
        } else if (Type == 'LineString') {
            Feature.setStyle(lineStyleFunction(StrokeColor));
        } else {
            Feature.setStyle(polyconStyleFunction(Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity));
        }
    }

    setInteraction(name, InputData) {
        for (var i in this.Interactions) {
            this.Interactions[i].set("active", (i == name));
        }
        this.InputData = InputData;
    }

    createInteraction(FilterContainer) {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        // Set cursor style
        ol.interaction.Transform.prototype.Cursors['rotate'] = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXAgMAAACdRDwzAAAAAXNSR0IArs4c6QAAAAlQTFRF////////AAAAjvTD7AAAAAF0Uk5TAEDm2GYAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2wwSEgUFmXJDjQAAAEZJREFUCNdjYMAOuCCk6goQpbp0GpRSAFKcqdNmQKgIILUoNAxIMUWFhoKosNDQBKDgVAilCqcaQBogFFNoGNjsqSgUTgAAM3ES8k912EAAAAAASUVORK5CYII=\') 5 5, auto';
        ol.interaction.Transform.prototype.Cursors['rotate0'] = 'url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAZUlEQVR42sSTQQrAMAgEHcn/v7w9tYgNNsGW7kkI2TgbRZJ15NbU+waAAFV11MiXz0yq2sxMEiVCDDcHLeky8nQAUDJnM88IuyGOGf/n3wjcQ1zhf+xgxSS+PkXY7aQ9yvy+jccAMs9AI/bwo38AAAAASUVORK5CYII=\') 5 5, auto';

        // Add a tooltip
        var tooltip = new ol.Overlay.Tooltip();
        oplMapObj.map.addOverlay(tooltip);

        this.Interactions = {
            transform: new ol.interaction.Transform({
                addCondition: ol.events.condition.shiftKeyOnly,
                filter: function(f,l) { 
                    if (typeof FilterContainer === 'undefined') {
                        return f;
                    } else if (FilterContainer == true) {
                        return ((f.getProperties().Container !== '') && (typeof f.getProperties().Container !== 'undefined'));
                    } else {
                        return f;
                    }           
                },
                // filter: function(f,l) { return f.getGeometry().getType()==='Polygon'; },
                // layers: [vector],
                hitTolerance: 2,
                translateFeature: false,
                scale: false,
                rotate: true,
                //keepAspectRatio: undefined,
                translate: true,
                stretch: true
            }),
            draw: new ol.interaction.Draw({
                source: oplMapObj.vectorLayer.getSource(),
                type: 'LineString'
            }),
            drawPolygon: new ol.interaction.Draw({
                source: oplMapObj.vectorLayer.getSource(),
                type: 'Polygon'
            }),
            drawRegular: new ol.interaction.DrawRegular({
                source: oplMapObj.vectorLayer.getSource(),
                sides: 4,
                canRotate: true
            }),
            offset: new ol.interaction.Offset({
                source: oplMapObj.vectorLayer.getSource()
            }),
            modify: new ol.interaction.Modify({
                source: oplMapObj.vectorLayer.getSource(),
                // insertVertexCondition: function(){ return false; }
            }),
            modifyfeature: new ol.interaction.ModifyFeature({
                sources: oplMapObj.vectorLayer.getSource(),
                // insertVertexCondition: function(){ return false; }
                // style: getStyle
            }),
            dragBox: new ol.interaction.DragBox({
                //condition: ol.events.condition.shiftKeyOnly,
                condition: platformModifierKeyOnly,
                style: new ol.style.Style({
                  stroke: new ol.style.Stroke({
                    color: [0, 0, 255, 1]
                  })
                })
            }),
            lineMeasureTooltip: new ol.interaction.Draw({
                source: oplMapObj.vectorLayer.getSource(),
                type: 'LineString'
            })
        }
        // add Interactions on openlayer map.
        for (var i in this.Interactions) this.OplMapObj.map.addInteraction(this.Interactions[i]);

        //### Listen transform ########################################################################################################################
        var startangle = 0;
        var d = [0, 0];
        var coordArray = [];

        // Handle rotate on first point
        var firstPoint = false;
        this.Interactions.transform.on(['select'], function (e) {
            if (firstPoint && e.features && e.features.length) {
                interaction.setCenter(e.features[0].getGeometry().getFirstCoordinate()); 
            }

            if (typeof e.feature !== 'undefined') {
                wmsOplMapObj.ActiveFeatures = e.feature;
                wmsOplMapObj.ActiveFeaturesCoordinate = e.coordinate
                
                /*
                if (typeof wmsOplMapObj.ActiveFeatures.get('EnableSelect') !== 'undefined') {
                    console.log("EnableSelect : " + e.feature.get('EnableSelect'));
                    if (e.feature.get('EnableSelect') == false) {                        
                        //this.setActive(false);
                        return false;
                    }
                }
                */

                if (typeof wmsOplMapObj.ActiveFeatures.get('EnableDelete') !== 'undefined') {
                    if (e.feature.get('EnableDelete') == true) {
                        $(".deleteFeatureButtonClass").show();
                    }
                }

                // *** Start : Show popup information. ***
                var fPoint = wmsOplMapObj.ActiveFeatures.getGeometry().getCoordinates();
                var PostData = new FormData();
                PostData.append("Container", wmsOplMapObj.ActiveFeatures.get('Container'));
                wmsOplMapObj.ShowSketchGeometryPopup(GlobalGetPopupSketchGeometryUrl, PostData, fPoint[0][0]);
                // *** End : Show popup information. ***

                // *** Start : Multi Select ***
                //console.log('MultiSelect : ' + wmsOplMapObj.MultiSelect);
                if (wmsOplMapObj.MultiSelect == true) {
                    console.log("Multiselect is active...");

                    if (typeof wmsOplMapObj.ActiveFeatures.get('Container') == 'undefined') return;

                    // Check Id duplication...
                    let checkDuplicationItem = false;
                    let featuresArray = wmsOplMapObj.SelectFeatures;
                    for (var i = 0; i < featuresArray.length; i++) {
                        let featureObj = featuresArray[i];
                        if (featureObj.get("Id") == wmsOplMapObj.ActiveFeatures.get('Id')) {
                            //console.log('Duplicat item.');
                            checkDuplicationItem = true;
                            break;
                        }
                    } // exit for

                    if (checkDuplicationItem == false) {
                        //console.log('Add item.');
                        wmsOplMapObj.SelectFeatures.push(wmsOplMapObj.ActiveFeatures);
                        wmsOplMapObj.addListTag();
                    }	
                }
                // *** End : Multi Select ***

                let inforMsg;
                inforMsg = "Id : " + e.feature.getId() + "</br>";
                inforMsg += "Part : " + e.feature.get('RefKey') + "</br>";
                inforMsg += "Container : " + e.feature.get('Container') + "</br>";
                $('#MapInfoId').summernote('code', inforMsg);

                console.log("Id : " + e.feature.getId());
                console.log("Type : " + e.feature.get('Type'));                
                console.log("EnableSelect : " + e.feature.get('EnableSelect'));
                console.log("EnableDelete : " + e.feature.get('EnableDelete'));
                console.log("RefGrpKey : " + e.feature.get('RefGrpKey'));
                console.log("RefKey : " + e.feature.get('RefKey'));            
                console.log("Container : " + e.feature.get('Container'));
                //console.log("SketchGeoCoordinates : " + e.feature.get('SketchGeoCoordinates'));
                console.log('------------------------');

                //console.log(e.feature.getId() + ":" + e.feature.get('Id') + ":" + e.feature.get('Container'));
            } else {
                $(".deleteFeatureButtonClass").hide();
            }              
        });
        this.Interactions.transform.on(['rotatestart', 'translatestart'], function (e) {
            // Rotation
            startangle = e.feature.get('angle') || 0;
            // Translation
            d = [0, 0];
        });
        this.Interactions.transform.on('rotating', function (e) {
            $('#info').text("rotate: " + ((e.angle * 180 / Math.PI - 180) % 360 + 180).toFixed(2));
            // Set angle attribute to be used on style !
            e.feature.set('angle', startangle - e.angle);

            //coordArray = [];
            //coords = e.feature.getGeometry().getCoordinates();
            //for (var i = 0; i < coords.length; i++) {
            //    var coord = coords[i];
            //    for (var j = 0; j < coord.length; j++) {
            //        let coordItem = ol.proj.transform(coord[j], 'EPSG:3857', 'EPSG:4326');
            //        let lng = coordItem[0];
            //        let lat = coordItem[1];
            //        coordArray.push(coordItem);
            //    }
            //}

            if (e.feature.get('RefGrpKey') == 'LineString') {
                coordArray = [];
                let DrawCoordArray = e.feature.getGeometry().getCoordinates();
                for (let i = 0; i < DrawCoordArray.length; i++) {
                    let coordItem = ol.proj.transform(DrawCoordArray[i], 'EPSG:3857', 'EPSG:4326');
                    coordArray.push(coordItem);
                }
                //console.log(coordArray);
            } else {
                coordArray = wmsOplMapObj.convertCoordsToGeoArray(e.feature.getGeometry().getCoordinates());                
            }
            
        });
        this.Interactions.transform.on('translating', function (e) {
            d[0] += e.delta[0];
            d[1] += e.delta[1];
            //$('#info').text("translate: " + d[0].toFixed(2) + "," + d[1].toFixed(2));
            $('#info').text("translate: " + d[0] + "," + d[1]);

            if (e.feature.get('RefGrpKey') == 'LineString') {
                coordArray = [];
                let DrawCoordArray = e.feature.getGeometry().getCoordinates();
                for (let i = 0; i < DrawCoordArray.length; i++) {
                    let coordItem = ol.proj.transform(DrawCoordArray[i], 'EPSG:3857', 'EPSG:4326');
                    coordArray.push(coordItem);
                }
                //console.log(coordArray);
            } else {
                coordArray = wmsOplMapObj.convertCoordsToGeoArray(e.feature.getGeometry().getCoordinates());
            }
           
        });
        this.Interactions.transform.on('scaling', function (e) {
            //console.log("Scaling...");
            //$('#info').text("scale: " + e.scale[0].toFixed(2) + "," + e.scale[1].toFixed(2));
            $('#info').text("scale: " + e.scale[0] + "," + e.scale[1]);
            this.ActiveFeatures = e.feature;
            if (e.feature.get('RefGrpKey') == 'LineString') {
                coordArray = [];
                let DrawCoordArray = e.feature.getGeometry().getCoordinates();
                for (let i = 0; i < DrawCoordArray.length; i++) {
                    let coordItem = ol.proj.transform(DrawCoordArray[i], 'EPSG:3857', 'EPSG:4326');
                    coordArray.push(coordItem);
                }
                //console.log(coordArray);
            } else {
                coordArray = wmsOplMapObj.convertCoordsToGeoArray(e.feature.getGeometry().getCoordinates());
            }
        });
        this.Interactions.transform.on(['scaleend'], function (e) {
            //$('#info').text("");                                 
            if (this.ActiveFeatures.get('Type') == 'StorageLocations') { // Geometry
                wmsOplMapObj.SaveGeometryFeatureCoordinates(GlobalSaveGeometryFeatureCoordinatesUrl, this.ActiveFeatures.get('Id'), coordArray);
            } else { // Sketch
                wmsOplMapObj.saveSketchGeometryFeatureCoordinates(GlobalSaveSketchGeometryFeatureCoordinatesUrl, this.ActiveFeatures.get('Id'), this.ActiveFeatures.get('RefKey'), coordArray);
            }
        });
        this.Interactions.transform.on(['translateend', 'rotateend'], function (e) {
            //$('#info').text("");
                        
            var featureObj = e.feature;
            if (featureObj.get('Type') == 'LocationMarker') {
                let coordItem = ol.proj.transform(e.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
                let lng = coordItem[0];
                let lat = coordItem[1];
                //console.log(featureObj.get('Id') + ":" + lng + ":" + lat);

                var PostData = new FormData();
                PostData.append("LocationId", featureObj.get('Id'));
                PostData.append("MvToLongitude", lng);
                PostData.append("MvToLatitude", lat);
                CallServicesWithFormData(GlobalSetGeometryMvtLngLatUrl, true, PostData, function (data) { });

            } else if (featureObj.get('Type') == 'TempLocationMarker') {
                let coordItem = ol.proj.transform(e.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
                let lng = coordItem[0];
                let lat = coordItem[1];
                //console.log(featureObj.get('Id') + ":" + lng + ":" + lat);

                var PostData = new FormData();
                PostData.append("LocationId", featureObj.get('Id'));
                PostData.append("MvToLongitude", lng);
                PostData.append("MvToLatitude", lat);
                CallServicesWithFormData(GlobalSetLocationMvtLngLatUrl, true, PostData, function (data) { });
            } else if (featureObj.get('Type') == 'Marker') {
                let coordItem = ol.proj.transform(e.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
                let lng = coordItem[0];
                let lat = coordItem[1];
                console.log(featureObj.get('Id') + ":" + lng + ":" + lat);

                var PostData = new FormData();
                PostData.append("GeometryId", featureObj.get('Id'));
                PostData.append("GeoCoordinates", lng+":"+lat);               
                CallServicesWithFormData(GlobalSaveGeometryFeatureCoordinatesUrl, true, PostData, function (data) { });
            } else if (featureObj.get('Type') == 'GeoMarker') {
                let coordItem = ol.proj.transform(e.feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
                let lng = coordItem[0];
                let lat = coordItem[1];
                //console.log(featureObj.get('Id') + ":" + lng + ":" + lat);

                var PostData = new FormData();
                PostData.append("GeoMarkerId", featureObj.get('Id'));
                PostData.append("Longitude", lng);
                PostData.append("Latitude", lat);
                CallServicesWithFormData(GlobalSetGeoMarkerLngLatUrl, true, PostData, function (data) { });                
            } else if (featureObj.get('Type') == 'StorageLocations') { // Geomssetry
                console.log(coordArray);
                if (coordArray.length == 0) return;
                wmsOplMapObj.SaveGeometryFeatureCoordinates(GlobalSaveGeometryFeatureCoordinatesUrl, featureObj.get('Id'), coordArray);
            } else { // Sketch
                coordArray = wmsOplMapObj.convertCoordsToGeoArray(featureObj.getGeometry().getCoordinates());
                console.log(coordArray);
                if (coordArray.length == 0) return;
                wmsOplMapObj.saveSketchGeometryFeatureCoordinates(GlobalSaveSketchGeometryFeatureCoordinatesUrl, featureObj.get('Id'), featureObj.get('RefKey'), coordArray); 
            }
        });

        //### Listen lineString ######################################################################################################################

        // Set feature on drawstart
        this.Interactions.draw.on('drawstart', tooltip.setFeature.bind(tooltip));

        // Remove feature on finish
        this.Interactions.draw.on(['change:active', 'drawend'], tooltip.removeFeature.bind(tooltip));

        this.Interactions.draw.on('drawend', function (e) {
            //console.log(e.type);
            //console.log(e.feature);
            //console.log(e.feature.getGeometry().getCoordinates());

            wmsOplMapObj.ActiveFeatures = null;
            wmsOplMapObj.ActiveFeatures = e.feature;

            let DrawLngLatArray = [];
            let DrawCoordArray = e.feature.getGeometry().getCoordinates();
            for (let i = 0; i < DrawCoordArray.length; i++) {
                let coordItem = ol.proj.transform(DrawCoordArray[i], 'EPSG:3857', 'EPSG:4326');
                DrawLngLatArray.push(coordItem);
            }
            //console.log(DrawLngLatArray);

            let GeometryId = wmsOplMapObj.InputData.GeometryId;
            let GeoType = wmsOplMapObj.InputData.GeoType;
            let RefGrpKey = wmsOplMapObj.InputData.RefGrpKey;
            let RefKey = wmsOplMapObj.InputData.RefKey;
            let Name = wmsOplMapObj.InputData.Name;
            let Description = wmsOplMapObj.InputData.Description;
            let IsActive = wmsOplMapObj.InputData.IsActive;
            let StrokeColor = wmsOplMapObj.InputData.StrokeColor;
            let FillR = wmsOplMapObj.InputData.FillR;
            let FillG = wmsOplMapObj.InputData.FillG;
            let FillB = wmsOplMapObj.InputData.FillB;
            let GeoCoordinates = DrawLngLatArray;

            if (StrokeColor == "") { StrokeColor = wmsOplMapObj.DefaultStrokeColor; }
            if (FillR == "") { FillR = wmsOplMapObj.DefaultFillR; }
            if (FillG == "") { FillG = wmsOplMapObj.DefaultFillG; }
            if (FillB == "") { FillB = wmsOplMapObj.DefaultFillB; }

            let jsonObj = wmsOplMapObj.createOrUpdateDraw(GeometryId, GeoType, RefGrpKey, RefKey, Name, Description, IsActive, StrokeColor, FillR, FillG, FillB, GeoCoordinates);
            //console.log(jsonObj);
            if (jsonObj.Result == true) {
                wmsOplMapObj.ActiveFeatures.setId("DRAWID" + jsonObj.Geometry.Id);
                wmsOplMapObj.ActiveFeatures.setProperties({
                    'Id': jsonObj.Geometry.Id,
                    'Type': 'StorageLocations',
                    'EnableDelete': true,
                    'RefGrpKey': jsonObj.Geometry.RefGrpKey,
                    'RefKey': jsonObj.Geometry.RefKey,
                    'Container': '',
                    'SketchGeoCoordinates': ''
                });

                //oplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {  
                //    var featureId = feature.getId();
                //    console.log(featureId);
                //});

                //let features = oplMapObj.vectorSource.getFeatures();
                //var lastFeature = features[features.length - 1];
                //oplMapObj.vectorSource.removeFeature(lastFeature);

                //var selectedFeatureId = "TEMP_DRAW_ID";
                //var features = oplMapObj.vectorSource.getFeatures();
                //if (features != null && features.length > 0) {
                //    for (var fItem in features) {
                //        var properties = features[fItem].getProperties();
                //        console.log(properties);
                //        var Id = properties.Id;
                //        if (Id == selectedFeatureId) {
                //            oplMapObj.vectorSource.removeFeature(features[fItem]);
                //            fItem.clear();
                //            break;
                //        }
                //    }
                //}

                //oplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {                    
                //    var featureId = feature.getId();
                //    console.log(featureId);
                //    if (featureId == "TEMP_DRAW_ID") {                      
                //        let source = oplMapObj.vectorLayer.getSource();
                //        source.removeFeature(feature);    
                //        oplMapObj.vectorLayer.setVisible(false);
                //        oplMapObj.vectorLayer.setVisible(true);     
                //        console.log("Delete...");
                //        return true;
                //    }
                //});

                //var jsonLatLng = jsonObj.Geometry.GeoCoordinates;
                //var lineStringData = [];
                //for (var i = 0; i < jsonLatLng.length; i++) {
                //    var coordinate = ol.proj.fromLonLat([jsonLatLng[i].Longitude, jsonLatLng[i].Latitude]);
                //    lineStringData.push(coordinate);
                //}
                //console.log(lineStringData);
                //oplMapObj.vectorLayer.getSource().addFeature(new ol.Feature(new ol.geom.LineString(lineStringData)));
            }
            wmsOplMapObj.setInteraction('transform');
            wmsOplMapObj.Interactions.transform.set('scale', false);            
        });

        //### Listen drawPolygon ######################################################################################################################

        // Set feature on drawstart
        this.Interactions.drawPolygon.on('drawstart', tooltip.setFeature.bind(tooltip));

        // Remove feature on finish
        this.Interactions.drawPolygon.on(['change:active', 'drawend'], tooltip.removeFeature.bind(tooltip));

        this.Interactions.drawPolygon.on('drawend', function (e) {

            wmsOplMapObj.ActiveFeatures = null;
            wmsOplMapObj.ActiveFeatures = e.feature;

            let DrawLngLatArray = [];
            let DrawCoordArray = e.feature.getGeometry().getCoordinates();
            for (let i = 0; i < DrawCoordArray.length; i++) {
                var coord = DrawCoordArray[i];
                for (var j = 0; j < coord.length; j++) {
                    let coordItem = ol.proj.transform(coord[j], 'EPSG:3857', 'EPSG:4326');
                    DrawLngLatArray.push(coordItem);
                }
            }
            //console.log(DrawLngLatArray);

            let GeometryId = wmsOplMapObj.InputData.GeometryId;
            let GeoType = wmsOplMapObj.InputData.GeoType;
            let RefGrpKey = wmsOplMapObj.InputData.RefGrpKey;
            let RefKey = wmsOplMapObj.InputData.RefKey;
            let Name = wmsOplMapObj.InputData.Name;
            let Description = wmsOplMapObj.InputData.Description;
            let IsActive = wmsOplMapObj.InputData.IsActive;
            let StrokeColor = wmsOplMapObj.InputData.StrokeColor;
            let FillR = wmsOplMapObj.InputData.FillR;
            let FillG = wmsOplMapObj.InputData.FillG;
            let FillB = wmsOplMapObj.InputData.FillB;
            let GeoCoordinates = DrawLngLatArray;

            if (StrokeColor == "") { StrokeColor = wmsOplMapObj.DefaultStrokeColor; }
            if (FillR == "") { FillR = wmsOplMapObj.DefaultFillR; }
            if (FillG == "") { FillG = wmsOplMapObj.DefaultFillG; }
            if (FillB == "") { FillB = wmsOplMapObj.DefaultFillB; }

            let jsonObj = wmsOplMapObj.createOrUpdateDraw(GeometryId, GeoType, RefGrpKey, RefKey, Name, Description, IsActive, StrokeColor, FillR, FillG, FillB, GeoCoordinates);
            //console.log(jsonObj);
            if (jsonObj.Result == true) {
                wmsOplMapObj.ActiveFeatures.setId("DRAWID" + jsonObj.Geometry.Id);
                wmsOplMapObj.ActiveFeatures.setProperties({
                    'Id': jsonObj.Geometry.Id,
                    'Type': 'StorageLocations',
                    'EnableDelete': true,
                    'RefGrpKey': jsonObj.Geometry.RefGrpKey,
                    'RefKey': jsonObj.Geometry.RefKey,
                    'Container': '',
                    'SketchGeoCoordinates': ''
                });
            }
            wmsOplMapObj.setInteraction('transform');
            wmsOplMapObj.Interactions.transform.set('scale', false);  
        });
        
        //### Listen drawRegular ######################################################################################################################

        // Set feature on drawstart
        this.Interactions.drawRegular.on('drawstart', tooltip.setFeature.bind(tooltip));

        // Remove feature on finish
        this.Interactions.drawRegular.on(['change:active', 'drawend'], tooltip.removeFeature.bind(tooltip));

        this.Interactions.drawRegular.on('drawstart', function (e) {
            // e.feature.on('change', function (){console.log('change');})
            //console.log("drawstart : " + e.feature);
        });

        // Events handlers
        this.Interactions.drawRegular.on('drawing', function (e) {
            //if (e.feature.getGeometry().getArea)
            //    $('#info').html((e.feature.getGeometry().getArea() / 1000000).toFixed(2) + " km<sup>2</sup>");
            //console.log("drawing : " + e.feature);
        });
        this.Interactions.drawRegular.on('drawend', function (e) {
            //$('#info').text("");
            //console.log(e.feature);

            wmsOplMapObj.ActiveFeatures = null;
            wmsOplMapObj.ActiveFeatures = e.feature;

            let DrawLngLatArray = [];
            let DrawCoordArray = e.feature.getGeometry().getCoordinates();            
            for (let i = 0; i < DrawCoordArray.length; i++) {
                var coord = DrawCoordArray[i];
                for (var j = 0; j < coord.length; j++) {
                    let coordItem = ol.proj.transform(coord[j], 'EPSG:3857', 'EPSG:4326');
                    DrawLngLatArray.push(coordItem);
                }                                
            }            
            //console.log(DrawLngLatArray);
 
            let GeometryId = wmsOplMapObj.InputData.GeometryId;
            let GeoType = wmsOplMapObj.InputData.GeoType;
            let RefGrpKey = wmsOplMapObj.InputData.RefGrpKey;
            let RefKey = wmsOplMapObj.InputData.RefKey;
            let Name = wmsOplMapObj.InputData.Name;
            let Description = wmsOplMapObj.InputData.Description;
            let IsActive = wmsOplMapObj.InputData.IsActive;
            let StrokeColor = wmsOplMapObj.InputData.StrokeColor;
            let FillR = wmsOplMapObj.InputData.FillR;
            let FillG = wmsOplMapObj.InputData.FillG;
            let FillB = wmsOplMapObj.InputData.FillB;
            let GeoCoordinates = DrawLngLatArray;

            if (StrokeColor == "") { StrokeColor = wmsOplMapObj.DefaultStrokeColor; }
            if (FillR == "") { FillR = wmsOplMapObj.DefaultFillR; }
            if (FillG == "") { FillG = wmsOplMapObj.DefaultFillG; }
            if (FillB == "") { FillB = wmsOplMapObj.DefaultFillB; }

            let jsonObj = wmsOplMapObj.createOrUpdateDraw(GeometryId, GeoType, RefGrpKey, RefKey, Name, Description, IsActive, StrokeColor, FillR, FillG, FillB, GeoCoordinates);
            //console.log(jsonObj);
            if (jsonObj.Result == true) {
                wmsOplMapObj.ActiveFeatures.setId("DRAWID" + jsonObj.Geometry.Id);
                wmsOplMapObj.ActiveFeatures.setProperties({
                    'Id': jsonObj.Geometry.Id,
                    'Type': 'StorageLocations',
                    'EnableDelete': true,
                    'RefGrpKey': jsonObj.Geometry.RefGrpKey,
                    'RefKey': jsonObj.Geometry.RefKey,
                    'Container': '',
                    'SketchGeoCoordinates': ''
                });
            }
            wmsOplMapObj.setInteraction('transform');
            wmsOplMapObj.Interactions.transform.set('scale', false); 
        });

        //### Offset ##################################################################################################################################
        this.Interactions.offset.on('offsetting', function (e) {
            console.log(e.offset.toFixed(0));
        });
        this.Interactions.offset.on('offsetend', function (e) {

        });

        //### Listen modifications ####################################################################################################################
        this.Interactions.modifyfeature.on(['modifystart', 'modifyend', 'modifying'], function (e) {
            // First modify feature
            //var f = e.features[0];
            //if (e.type === 'modifystart') $('.options p').html('');
            //var info = e.type + ' ' + (e.features.length || '??') + ' feature(s) : '; 
            //    info += (f ? f.getGeometry().getType() : '');
        });

        //### Modify modifications ####################################################################################################################
        this.Interactions.modify.on(['modifystart', 'modifyend', 'modifying'], function (e) {
            // Try to get the modified features
            //var f = interactions.modify.getModifiedFeatures()[0];
            //if (e.type === 'modifystart') $('.options p').html('');
            //var info = e.type + ' ' + (e.features.length || '??') + ' feature(s) : '; 
            //info += (f ? f.getGeometry().getType() : '');
        });

        //### DragBox ########################################################################################################################
        this.Interactions.dragBox.on('boxstart', function(e) {
            //console.log('BoxStart...');
            wmsOplMapObj.SelectFeatures = [];
        });

        this.Interactions.dragBox.on('boxend', function(e) {
            //console.log('BoxEnd...');
            var extent = this.getGeometry().getExtent();
            oplMapObj.vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {
                wmsOplMapObj.SelectFeatures.push(feature);
            });      
            //console.log(wmsOplMapObj.SelectFeatures); 
            wmsOplMapObj.addListTag();    
        });

        //### lineMeasureTooltip ##############################################################################################################
        this.Interactions.lineMeasureTooltip.on('drawstart', tooltip.setFeature.bind(tooltip));

        this.Interactions.lineMeasureTooltip.on(['change:active','drawend'], tooltip.removeFeature.bind(tooltip),);

        //set default active interaction...        
        this.setInteraction('transform');   
        
        return this;
    }

    deleteGeometryActiveFeatures() {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        if (wmsOplMapObj.ActiveFeatures.get('Id') != "") {
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
                            //console.log("Remove features... " + wmsOplMapObj.ActiveFeatures.get('Id'));
                            let source = oplMapObj.vectorLayer.getSource();
                            source.removeFeature(wmsOplMapObj.ActiveFeatures);
                            wmsOplMapObj.deleteGeometry(GlobalDeleteGeometryUrl, wmsOplMapObj.ActiveFeatures.get('Id'));
                        } // end callback
                    }
                },
                onEscape: function () {

                }
            });

            modal.modal("show");
        }	
    }

    ShowSketchGeometryPopup(WebserviceUrl, PostData, Coordinate) {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;
        CallServicesWithFormData(WebserviceUrl, true, PostData, handleData);
        function handleData(data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);
            if (jsonObj.Container.length > 0) {
                var PopupInfo = "";
                if (jsonObj.Container[0].Part.Picture != null) {
                    PopupInfo += "<img src='data:image/png;base64," + jsonObj.Container[0].Part.Picture + "'/>";
                }
                PopupInfo += "<b>Id : </b>" + jsonObj.Container[0].SketchGeometry.Id + "<br/>";
                PopupInfo += "<b>Tag : </b>" + jsonObj.Container[0].Name + "<br/>";
                PopupInfo += "<b>Name : </b>" + jsonObj.Container[0].Part.Name + "<br/>";
                PopupInfo += "<b>Description : </b>" + jsonObj.Container[0].Part.Description;
                oplMapObj.popupOverlay.show(Coordinate);
                oplMapObj.popupOverlay.show(PopupInfo);
                oplMapObj.popupOverlay.setPositioning('bottom-left');
            }
        }
    }

    moveSingleFeature(feature, centerCoordinateFeature, toLngLat) {
        if (typeof centerCoordinateFeature === 'undefined') return true;

        var sourcePoint = centerCoordinateFeature;
        var destinationPoint = ol.proj.fromLonLat([toLngLat[0], toLngLat[1]]);

        var deltaX = parseFloat(destinationPoint[0]) - sourcePoint[0];
        var deltaY = parseFloat(destinationPoint[1]) - sourcePoint[1];
        feature.getGeometry().translate(deltaX, deltaY);

        var coordArray = [];
        coordArray = this.convertCoordsToGeoArray(feature.getGeometry().getCoordinates());
        this.saveSketchGeometryFeatureCoordinates(GlobalSaveSketchGeometryFeatureCoordinatesUrl, feature.get('Id'), feature.get('RefKey'), coordArray);
    }

    convertCoordsToGeoArray(featureGeoCoordinates) {
        let coordArray = [];
        let coords = featureGeoCoordinates;
        for (var i = 0; i < coords.length; i++) {
            let coord = coords[i];
            for (var j = 0; j < coord.length; j++) {
                let coordItem = ol.proj.transform(coord[j], 'EPSG:3857', 'EPSG:4326');
                //let lng = coordItem[0];
                //let lat = coordItem[1];
                coordArray.push(coordItem);
            }
        }
        return coordArray;
    }

    //******************************* UI *******************************
    showSearchObject() {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        var PostData = new FormData();
        CallServicesWithFormData(GlobalRenderSketchGeometryUrl, true, PostData, handleData);

        function handleData(data) {
            var jsonObj = jQuery.parseJSON(data);
            console.log(jsonObj);

            var StrHtml = "";
            StrHtml += "<form method='post' name='' id=''> ";
            StrHtml += "    <div class='row'> ";
            StrHtml += "        <div class='form-group'> ";
            StrHtml += "            <div class='col-sm-12'> ";
            StrHtml += "                <label class='col-sm-2 control-label myLabel'>Tag</label> ";
            StrHtml += "                <div class='col-sm-10'> ";

            StrHtml += "                        <select class='chosen-select mycontainer form-control' id='SearchDataId' name='SearchData' data-placeholder='Select' style='display: none;'>";
            $.each(jsonObj.Container, function (key, val) {
                StrHtml += "<option value='" + val.Name + "'>" + val.Name +" : "+ val.Part.Name + "-" + val.Part.Description + "</option>";
            });
            StrHtml += "                        </select>";

            StrHtml += "                </div> ";
            StrHtml += "            </div> ";
            StrHtml += "        </div> ";
            StrHtml += "    </div> ";
            StrHtml += "</form> ";

            var modal = bootbox.dialog({
                message: StrHtml,
                title: "Search",
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

                            var SearchId = $("#SearchDataId").val();
                            //console.log(SearchId);

                            oplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                                var featureId = feature.getId();
                                var Container = feature.get("Container");
                                if (Container == SearchId) {
                                    //console.log("Found object...");
                                    feature = oplMapObj.moveFeatureUp(feature);
                                    wmsOplMapObj.ActiveFeatures = feature;

                                    var fPoint = feature.getGeometry().getCoordinates(); //console.log(fPoint[0][0]);                                    
                                    var PostData = new FormData();
                                    PostData.append("Container", feature.get('Container'));
                                    wmsOplMapObj.ShowSketchGeometryPopup(GlobalGetPopupSketchGeometryUrl, PostData, fPoint[0][0]);

                                    wmsOplMapObj.ActiveFeatures = feature;
                                    return true;
                                } // end if
                            });

                        } // end callback
                    }
                },
                onEscape: function () {

                }
            });

            $(".chosen-select").chosen({ width: '100%' });
            modal.modal("show");
        }
    }

    showSearchGroupObject() {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        var PostData = new FormData();
        CallServicesWithFormData(GlobalGetAnonymousPartGroupUrl, true, PostData, handleData);

        function handleData(data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);

            var StrHtml = "";
            StrHtml += "<form method='post' name='' id=''> ";
            StrHtml += "    <div class='row'> ";
            StrHtml += "        <div class='form-group'> ";
            StrHtml += "            <div class='col-sm-12'> ";
            StrHtml += "                <label class='col-sm-2 control-label myLabel'>Tag Group</label> ";
            StrHtml += "                <div class='col-sm-10'> ";

            StrHtml += "                        <select class='chosen-select form-control' id='SearchGroupDataId' name='SearchGroupData' data-placeholder='Select' style='display: none;'>";
            $.each(jsonObj, function (key, val) {
                StrHtml += "<option value='" + val.Name + "'>" + val.Name + " : " + val.Description + "</option>";
            });
            StrHtml += "                        </select>";

            StrHtml += "                </div> ";
            StrHtml += "            </div> ";
            StrHtml += "        </div> ";
            StrHtml += "    </div> ";
            StrHtml += "</form> ";

            var modal = bootbox.dialog({
                message: StrHtml,
                title: "Search",
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

                            $(".placemarkClass").remove();

                            var GrpSearchId = $("#SearchGroupDataId").val();
                            //console.log(GrpSearchId);

                            wmsOplMapObj.ActiveFeatureGroup = [];
                            oplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                                var featureId = feature.getId();
                                var refKey = feature.get("RefKey");                                 
                                if (refKey == GrpSearchId) {                                    
                                    wmsOplMapObj.ActiveFeatureGroup.push(feature);
                                }
                            });
                            //console.log(wmsOplMapObj.ActiveFeatureGroup.length);

                            for (var i = 0; i < wmsOplMapObj.ActiveFeatureGroup.length; i++) {
                                let feature = wmsOplMapObj.ActiveFeatureGroup[i];
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
                                oplMapObj.map.addOverlay(placemark);
                                //placemark.show(placemark.getPosition(), "<i class=\"fa fa-qrcode\"></i>");

                                //oplMapObj.view.fit(oplMapObj.vectorLayer.getSource().getExtent(), { duration: 1000 });
                            }

                        } // end callback
                    }
                },
                onEscape: function () {

                }
            });

            $(".chosen-select").chosen({ width: '100%' });
            modal.modal("show");
        }
    }

    showMoveGroupObject() {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        var PostData = new FormData();
        CallServicesWithFormData(GlobalRenderSketchGeometryUrl, true, PostData, handleData);

        function handleData(data) {
            //console.log(data);
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);

            var StrHtml = "";
            StrHtml += "<form method='post' name='' id=''> ";
            StrHtml += "    <div class='row'> ";
            StrHtml += "        <div class='form-group'> ";
            StrHtml += "            <div class='col-sm-12'> ";
            StrHtml += "                <label class='col-sm-2 control-label myLabel'>Tag</label> ";
            StrHtml += "                <div class='col-sm-10'> ";

            StrHtml += "                        <select multiple='' class='chosen-select form-control tag-input-style' id='ContainerId' name='Container' data-placeholder='Select' style='display: none;'>";
            $.each(jsonObj.Container, function (key, val) {
                StrHtml += "<option value='DRAWID" + val.SketchGeometry.Id + "'>" + val.Name + " : " + val.Part.Name + "-" + val.Part.Description +  "</option>";
            });
            StrHtml += "                        </select>";

            StrHtml += "                </div> ";
            StrHtml += "            </div> ";
            StrHtml += "        </div> ";
            StrHtml += "    </div> ";
            StrHtml += "</form> ";

            var modal = bootbox.dialog({
                message: StrHtml,
                title: "Select Tag",
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
                            var selectObj = $("#ContainerId").val();      
                            wmsOplMapObj.SelectFeaturesId = selectObj;                           
                        }
                    }
                },
                onEscape: function () {

                }
            });

            $(".chosen-select").chosen({ width: '100%' });
            modal.modal("show");
        }
    }

    showActiveGeoMarker() {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        var PostData = new FormData();
        CallServicesWithFormData(GlobalGetActiveGeoMarkerUrl, true, PostData, handleData);

        function handleData(data) {
            //console.log(data);
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);

            var StrHtml = "";
            StrHtml += "<form method='post' name='' id=''> ";
            StrHtml += "    <div class='row'> ";
            StrHtml += "        <div class='form-group'> ";
            StrHtml += "            <div class='col-sm-12'> ";
            StrHtml += "                <label class='col-sm-2 control-label myLabel'>Tag</label> ";
            StrHtml += "                <div class='col-sm-10'> ";

            StrHtml += "                        <select class='chosen-select mycontainer form-control' id='ActiveGeoMarkerId' name='ActiveGeoMarker' data-placeholder='Select' style='display: none;'>";
            $.each(jsonObj, function (key, val) {
                StrHtml += "<option value='" + val.Id + "|" + val.Longitude + "|" + val.Latitude + "'>" + val.Name + "</option>";
            });
            StrHtml += "                        </select>";

            StrHtml += "                </div> ";
            StrHtml += "            </div> ";
            StrHtml += "        </div> ";
            StrHtml += "    </div> ";
            StrHtml += "</form> ";

            var modal = bootbox.dialog({
                message: StrHtml,
                title: "Select location to transfer",
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
                            wmsOplMapObj.ClearMap();

                            let GeoMarkerVal = $('#ActiveGeoMarkerId').val();
                            let selectArray = GeoMarkerVal.split("|");
                            let Longitude = parseFloat(selectArray[1]);
                            let Latitude = parseFloat(selectArray[2]);
                            //console.log(Longitude + "," + Latitude);
                            
                            let point = ol.proj.fromLonLat([Longitude, Latitude]);
                            let PlacemarkLngLat = new ol.Overlay.Placemark({
                                //color: '#369',
                                popupClass: 'placemarkLngLatClass',
                                //backgroundColor : 'yellow',
                                position: point,
                                autoPan: true,
                                onshow: function () { /*console.log("You opened a placemark");*/ },
                                autoPanAnimation: { duration: 250 }
                            });
                            oplMapObj.map.addOverlay(PlacemarkLngLat);
                            //oplMapObj.PlacemarkLngLat.show(placemark.getPosition(), "<i class=\"fa fa-qrcode\"></i>");

                            wmsOplMapObj.PlacemarkLngLatValue = [Longitude, Latitude];    
                        }
                    }
                },
                onEscape: function () {

                }
            });

            $(".chosen-select").chosen({ width: '100%' });
            modal.modal("show");    
        }
    }

    renderGeometry(RefId, data) {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        function styleFunction(text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity) {
            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: StrokeColor,
                        width: StrokeWidth
                    }),
                    fill: new ol.style.Fill({
                        color: [FillR, FillG, FillB, FillOpacity]
                    }),
                    text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({ color: '#000' }),
                        stroke: new ol.style.Stroke({
                            color: '#fff', width: 2
                        }),
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetY: -5,
                        text: text
                    }),
                    zIndex: 1000
                })
            ];
        }

        var jsonLatLng = data.Geometry.GeoCoordinates;
        //console.log(jsonLatLng);

        var ringArea = [];
        for (var i = 0; i < jsonLatLng.length; i++) {
            ringArea.push([jsonLatLng[i].Longitude, jsonLatLng[i].Latitude]);
        }
        //console.log(ringArea);

        var polygonArea = new ol.geom.Polygon([ringArea]);
        polygonArea.transform('EPSG:4326', 'EPSG:3857');

        var featureObj = new ol.Feature(polygonArea);
        featureObj.setId("DRAWID" + RefId);
        featureObj.setProperties({
            'Id': data.Geometry.Id,
            'Type': '',
            'EnableDelete': false,
            'RefGrpKey': data.Geometry.RefGrpKey,
            'RefKey': data.Geometry.RefKey,
            'Container': '',
            'SketchGeoCoordinates': ''
        });

        // set feature style
        if (typeof data.Geometry.GeoProperties !== 'undefined') {
            let Text = '';
            let StrokeColor = data.Geometry.GeoProperties[0].StrokeColor;
            let StrokeWidth = data.Geometry.GeoProperties[0].StrokeWidth;
            let FillR = data.Geometry.GeoProperties[0].FillR;
            let FillG = data.Geometry.GeoProperties[0].FillG;
            let FillB = data.Geometry.GeoProperties[0].FillB;
            let FillOpacity = data.Geometry.GeoProperties[0].FillOpacity;
            let featureStyle = styleFunction(Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity)

            featureObj.setStyle(featureStyle);
        }

        oplMapObj.vectorLayer.getSource().addFeature(featureObj);
    }

    addListTag() {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        $("#ListTagId").find('option').remove();
        $('#ListTagId').trigger("chosen:updated");

        $("#dialogListTagId").find('option').remove();
        $('#dialogListTagId').trigger("chosen:updated");

        let inforMsg = "";
        let featuresArray = wmsOplMapObj.SelectFeatures;
        for (let i = 0; i < featuresArray.length; i++) {
            let featureObj = featuresArray[i];
            if (typeof featureObj.get('Container') !== 'undefined') {
                if (featureObj.get('Container') != "") {
                    inforMsg += (i+1) + ") Tag : " + featureObj.get('Container');
                    inforMsg += ", Part : " + featureObj.get('RefKey');
                    inforMsg += ", Description : "+ featureObj.get('Description');
                    inforMsg += ", Image ID : " + featureObj.getId() +"<br/>";                    
                    $('#ListTagId').append('<option value="' + featureObj.get('Container') + '">' + featureObj.get('Container') + '</option>');

                    let optionDesc = featureObj.get('Container') + " : " + featureObj.get('RefKey');
                    $('#dialogListTagId').append('<option value="' + featureObj.get('Container') + '">' + optionDesc + '</option>');
                }
            }
        } // exit for
        $('#MapInfoId').summernote('code', inforMsg);
        
        $('#ListTagId option').prop('selected', true); // Selects all options
        $('#ListTagId').trigger("chosen:updated");

        $('#dialogListTagId option').prop('selected', true); // Selects all options
        $('#dialogListTagId').trigger("chosen:updated");

        // confirm select tags in feature array.
        wmsOplMapObj.SelectFeatures = [];
        let items = $('#ListTagId').val();
        if (items != null) {
            $.each(items, function(index, elem){
                let TagName = elem;
                oplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                    let Container = feature.get("Container");
                    if (Container == TagName) {            
                        wmsOplMapObj.SelectFeatures.push(feature); 
                        return true;
                    } // end if
                });
            }); // end each
        }

        //Start : Add click event #ListTagId option 
        function FindTagInOnMap(TagName) {
            oplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                let featureId = feature.getId();
                let Container = feature.get("Container");
                if (Container == TagName) {
                    //console.log("Found object...");
                    feature = oplMapObj.moveFeatureUp(feature);
                    wmsOplMapObj.ActiveFeatures = feature;

                    let fPoint = feature.getGeometry().getCoordinates();
                    let PostData = new FormData();
                    PostData.append("Container", feature.get('Container'));
                    wmsOplMapObj.ShowSketchGeometryPopup(GlobalGetPopupSketchGeometryUrl, PostData, fPoint[0][0]);

                    wmsOplMapObj.ActiveFeatures = feature;

                    //oplMapObj.map.getView().setZoom(19);

                    let destinationPoint = fPoint[0][0];
                    oplMapObj.goToCoord(destinationPoint[0], destinationPoint[1]);
                   
                    return true;
                } // end if
            });
        }

        //$("#ListTagId option:selected").each(function () {
        $("#ListTagId_chosen .search-choice span").each(function () {
            //console.log($(this));
            //console.log($(this).text());
            let attrId = "IDC1" + $(this).text();            
            $(this).attr("id", attrId);

            $("#" + attrId).unbind('click');
            $("#" + attrId).bind("click", function () {
                //console.log(attrId);  
                FindTagInOnMap($(this).text());             
            });             
        });

        $("#dialogListTagId_chosen .search-choice span").each(function () {
            //console.log($(this));
            //console.log($(this).text());
            let fields = $(this).text().split(':');
            let tag = fields[0].trim();
            //console.log(tag);
            let attrId = "IDC2" + tag;            
            $(this).attr("id", attrId);

            $("#" + attrId).unbind('click');
            $("#" + attrId).bind("click", function () {
                FindTagInOnMap(tag);             
            });             
        });
        
        // $.each($(".search-choice span"), function () {
        //     console.log(this);
        //     let attrId = "ID" + $(this).text();            
        //     $(this).attr("id", attrId);

        //     $("#" + attrId).unbind('click');
        //     $("#" + attrId).bind("click", function () {
        //         //console.log(attrId);  
        //         FindTagInOnMap($(this).text());             
        //     });   
        // }); 
        //End : Add click event #ListTagId option     
                      
    }

    //******************************* Data Service *******************************
    renderSketchGeometry(RenderSketchGeometryUrl) {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        function styleFunction(text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity) {
            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: StrokeColor,
                        width: StrokeWidth
                    }),
                    fill: new ol.style.Fill({
                        color: [FillR, FillG, FillB, FillOpacity]
                    }),
                    text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({ color: '#000' }),
                        stroke: new ol.style.Stroke({
                            color: '#fff', width: 2
                        }),
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetY: -5,
                        text: text
                    }),
                    zIndex: 1000
                })
            ];
        }

        //NProgress.configure({ showSpinner: false });
        //NProgress.start();
        //layout.blockUI(true);

        var Msg = "<div class='progress'>";
        Msg += "    <div class='progress-bar progress-bar-info progress-bar-striped active' role='progressbar'";
        Msg += "    aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' style='width:100%'>";
        Msg += "    Loading...";
        Msg += "    </div>";
        Msg += "</div>";  
        
        $('#map').block({ 
            message: Msg, 
            //css: { border: '3px solid #a00' } 
        }); 
    
        var PostData = new FormData();

        var RetieUrlVal = new getRetieUrl();
        var wsrvUrl = "";
        wsrvUrl = RenderSketchGeometryUrl;
        wsrvUrl += "?param=";
        wsrvUrl += "&RetieUrlVal=" + RetieUrlVal.getRetieUrlString();

        $.ajax({
            url: wsrvUrl,
            data: PostData,
            type: 'POST',
            async: true,
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
                //console.log(data);
                var jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);

                $.each(jsonObj.Container, function (key, val) {
                    //console.log(key + " : " + val.Id);

                    var jsonLatLng = val.SketchGeometry.SketchGeoCoordinates;
                    //console.log(jsonLatLng);

                    var ringArea = [];
                    for (var i = 0; i < jsonLatLng.length; i++) {
                        ringArea.push([jsonLatLng[i].Longitude, jsonLatLng[i].Latitude]);
                    }
                    //console.log(ringArea);

                    var polygonArea = new ol.geom.Polygon([ringArea]);
                    polygonArea.transform('EPSG:4326', 'EPSG:3857');

                    var featureObj = new ol.Feature(polygonArea);
                    featureObj.setId("DRAWID" + val.SketchGeometry.Id.toString());
                    featureObj.setProperties({
                        'Id': val.SketchGeometry.Id,
                        'Type': '',
                        'EnableDelete': true,
                        'RefGrpKey': val.SketchGeometry.RefGrpKey,
                        'RefKey': val.SketchGeometry.RefKey,
                        'Container': val.Name,
                        'Description': val.Part.Description,
                        'SketchGeoCoordinates': val.SketchGeometry.SketchGeoCoordinates
                    });

                    // set feature style
                    if (typeof val.SketchGeometry.SketchGeoProperties !== 'undefined') {
                        let Text = val.Name;
                        let StrokeColor = val.SketchGeometry.SketchGeoProperties.StrokeColor;
                        let StrokeWidth = val.SketchGeometry.SketchGeoProperties.StrokeWidth;
                        let FillR = val.SketchGeometry.SketchGeoProperties.FillR;
                        let FillG = val.SketchGeometry.SketchGeoProperties.FillG;
                        let FillB = val.SketchGeometry.SketchGeoProperties.FillB;
                        let FillOpacity = val.SketchGeometry.SketchGeoProperties.FillOpacity;
                        let featureStyle = styleFunction(Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity)

                        featureObj.setStyle(featureStyle);
                    }

                    oplMapObj.vectorLayer.getSource().addFeature(featureObj);
                });
            },
            complete: function(){                   
                $('#map').unblock();                
                //layout.unblockUI();
                //NProgress.done();
                //NProgress.remove();
            },            
            error: function (xhr, status, error) {
                // handle error
                //var errorMessage = xhr.status + ' : ' + xhr.statusText + ' : ' + error;
                var jsonObj = jQuery.parseJSON(xhr.responseText);
                console.log("Error : " + jsonObj.ErrorMessage);
            }
        }); // end ajax
    }

    renderGeometryByLocation(RenderGeometryByLocationUrl, GeoType, 
                             MarkerEnableSelect, MarkerEnableDelete,
                             PolygonEnableSelect, PolygonEnableDelete) {

        if (GeoType == "") { GeoType = 0; }                                

        if (MarkerEnableSelect == "") { MarkerEnableSelect = false; } 
        if (MarkerEnableDelete == "") { MarkerEnableDelete = false; } 
        if (PolygonEnableSelect == "") { PolygonEnableSelect = false; } 
        if (PolygonEnableDelete == "") { PolygonEnableDelete = false; }         

        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        var PostData = new FormData();
        PostData.append("GeoType", GeoType);
        CallServicesWithFormData(RenderGeometryByLocationUrl, false, PostData, handleData);

        function handleData(data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);

            function locationStyleFunc(text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity, ZIndex) {
                return [
                    new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            color: StrokeColor,
                            width: StrokeWidth
                        }),
                        fill: new ol.style.Fill({
                            color: [FillR, FillG, FillB, FillOpacity]
                        }),
                        text: new ol.style.Text({
                            font: '12px Calibri,sans-serif',
                            fill: new ol.style.Fill({ color: '#000' }),
                            stroke: new ol.style.Stroke({
                                color: '#fff', width: 2
                            }),
                            textAlign: 'center',
                            textBaseline: 'bottom',
                            offsetY: -5,
                            text: text
                        }),
                        //zIndex: 0
                        zIndex: ZIndex
                    })
                ];
            }

            function markerStyleFunc(text) {
                return [
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 5,
                            fill: new ol.style.Fill({
                                color: [135, 184, 127, 0.7]
                            }),
                            stroke: new ol.style.Stroke({
                                color: '#599250',
                                width: 1
                            }),
                        }),
                        //image: new ol.style.RegularShape({
                        //    fill: new ol.style.Fill({ color: 'red' }),
                        //    stroke: new ol.style.Stroke({ color: 'black', width: 2 }),
                        //    points: 4,
                        //    radius: 10,
                        //    angle: Math.PI / 4
                        //}),
                        text: new ol.style.Text({
                            font: '12px Calibri,sans-serif',
                            fill: new ol.style.Fill({ color: '#000' }),
                            stroke: new ol.style.Stroke({
                                color: '#fff', width: 2
                            }),
                            textAlign: 'center',
                            textBaseline: 'bottom',
                            offsetY: -5,
                            text: text
                        }),
                        zIndex: 10
                    })
                ];
            }

            // create location.
            $.each(jsonObj, function (key, val) {
                //console.log(key + " : " + val.Id);

                var jsonLatLng = val.GeoCoordinates;
                //console.log(jsonLatLng);

                var ringArea = [];
                for (var i = 0; i < jsonLatLng.length; i++) {
                    ringArea.push([jsonLatLng[i].Longitude, jsonLatLng[i].Latitude]);
                }

                var polygonArea = new ol.geom.Polygon([ringArea]);
                polygonArea.transform('EPSG:4326', 'EPSG:3857');

                var featureObj = new ol.Feature(polygonArea);
                if (val.RefKey != "CUSTOM") { featureObj.setId("DRAWID" + val.Id.toString()); }                
                featureObj.setProperties({
                    'Id': val.Id,
                    'Type': '',
                    'EnableSelect' : MarkerEnableSelect,
                    'EnableDelete': MarkerEnableDelete,
                    'RefGrpKey': val.RefGrpKey,
                    'RefKey': val.RefKey,
                    'SketchGeoCoordinates': val.GeoCoordinates
                });

                // set feature style
                if (typeof val.GeoProperties[0] !== 'undefined') {

                    //var Stroke = new ol.style.Stroke({
                    //    color: val.GeoProperties[0].StrokeColor,
                    //    width: val.GeoProperties[0].StrokeWidth
                    //});

                    //var Fill = new ol.style.Fill({
                    //    color: [val.GeoProperties[0].FillR, val.GeoProperties[0].FillG, val.GeoProperties[0].FillB, val.GeoProperties[0].FillOpacity]
                    //});

                    //var Style = new ol.style.Style({
                    //    stroke: Stroke,
                    //    fill: Fill
                    //});
                    //featureObj.setStyle(Style);

                    let Name = val.Name;
                    if (val.RefKey == 'CUSTOM') { Name = ''; }

                    featureObj.setStyle(locationStyleFunc(Name, val.GeoProperties[0].StrokeColor, val.GeoProperties[0].StrokeWidth,
                                        val.GeoProperties[0].FillR, val.GeoProperties[0].FillG, val.GeoProperties[0].FillB, val.GeoProperties[0].FillOpacity,
                                        GeoType));
                }

                oplMapObj.vectorLayer.getSource().addFeature(featureObj);
            });

            // create marker
            $.each(jsonObj, function (GeometryKey, GeometryVal) {
                $.each(GeometryVal.GeoMarker, function (GeoMarkerKey, GeoMarkerVal) {
                    var geoMarkerObj = GeoMarkerVal;

                    var markerFeature = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([geoMarkerObj.Longitude, geoMarkerObj.Latitude]))
                    });
                    markerFeature.setStyle(markerStyleFunc(geoMarkerObj.Name));
                    markerFeature.setId("GEOMARKERID" + geoMarkerObj.Id);
                    markerFeature.setProperties({
                        'Id': geoMarkerObj.Id,
                        'Type': 'GeoMarker',
                        'EnableSelect' : MarkerEnableSelect,
                        'EnableDelete': MarkerEnableDelete,
                        'RefGrpKey': '',
                        'RefKey': '',
                        'SketchGeoCoordinates': ''
                    });

                    oplMapObj.vectorLayer.getSource().addFeature(markerFeature);
                });  
            });
        }
    }

    renderLocationMarker(WebserviceUrl) {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        var PostData = new FormData();
        CallServicesWithFormData(WebserviceUrl, true, PostData, handleData);

        function styleFunction(text) {
            return [
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: [111, 179, 224, 0.7]
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#4f99c6',
                            width: 1
                        }),
                    }),
                    text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({ color: '#000' }),
                        stroke: new ol.style.Stroke({
                            color: '#fff', width: 2
                        }),
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetY: -5,
                        text: text
                    }),
                    zIndex: 1000
                })
            ];
        }

        function handleData(data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);

            $.each(jsonObj, function (key, val) {

                var markerFeature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([val.MvToLongitude, val.MvToLatitude]))
                });
                markerFeature.setStyle(styleFunction(val.Name));
                markerFeature.setId(val.Id);
                markerFeature.setProperties({
                    'Id': val.Id,
                    'Type': 'LocationMarker',
                    'EnableDelete': false,
                    'RefGrpKey': '',
                    'RefKey': '',
                    'SketchGeoCoordinates': ''
                });

                oplMapObj.vectorLayer.getSource().addFeature(markerFeature);
                //var PPMark = oplMapObj.addMarker(val.MvToLatitude, val.MvToLongitude, val.Id, styleFunction(val.Name));
            });         
        }
    }

    renderTempLocationMarker(WebserviceUrl) {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        var PostData = new FormData();
        CallServicesWithFormData(WebserviceUrl, true, PostData, handleData);

        function styleFunction(text) {
            return [
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: [111, 179, 224, 0.7]
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#4f99c6',
                            width: 1
                        }),
                    }),
                    text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({ color: '#000' }),
                        stroke: new ol.style.Stroke({
                            color: '#fff', width: 2
                        }),
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetY: -5,
                        text: text
                    }),
                    zIndex: 0
                })
            ];
        }

        function handleData(data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);

            $.each(jsonObj, function (key, val) {

                var markerFeature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([val.MvToLongitude, val.MvToLatitude]))
                });
                markerFeature.setStyle(styleFunction(val.Name));
                markerFeature.setId(val.Id);
                markerFeature.setProperties({
                    'Id': val.Id,
                    'Type': 'TempLocationMarker',
                    'EnableDelete': false,
                    'RefGrpKey': '',
                    'RefKey': '',
                    'SketchGeoCoordinates': ''
                });

                oplMapObj.vectorLayer.getSource().addFeature(markerFeature);
                //var PPMark = oplMapObj.addMarker(val.MvToLatitude, val.MvToLongitude, val.Id, styleFunction(val.Name));
            });
        }
    }

    renderGeometryStorageLocations(WebserviceUrl, GeoType, RefKey, 
                                  MarkerEnableSelect, MarkerEnableDelete,
                                  LineStringEnableSelect, LineStringEnableDelete,
                                  PolygonEnableSelect, PolygonEnableDelete
                                  ) {

        if (GeoType == "") { GeoType = 0; }                                    

        if (MarkerEnableSelect == "") { MarkerEnableSelect = false; } 
        if (MarkerEnableDelete == "") { MarkerEnableDelete = false; } 
        if (LineStringEnableSelect == "") { LineStringEnableSelect = false; } 
        if (LineStringEnableDelete == "") { LineStringEnableDelete = false; } 
        if (PolygonEnableSelect == "") { PolygonEnableSelect = false; } 
        if (PolygonEnableDelete == "") { PolygonEnableDelete = false; }                                  

        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        function lineStyleFunction(color) {
            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: color,
                        width: 2
                    })
                })
            ];
        }

        function markerStyleFunction(Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity) {
            return [
                new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 5,
                        fill: new ol.style.Fill({
                            color: [FillR, FillG, FillB, FillOpacity]
                        }),
                        stroke: new ol.style.Stroke({
                            color: StrokeColor,
                            width: StrokeWidth
                        }),
                    }),
                    //image: new ol.style.RegularShape({
                    //    fill: new ol.style.Fill({ color: 'red' }),
                    //    stroke: new ol.style.Stroke({ color: 'black', width: 2 }),
                    //    points: 4,
                    //    radius: 10,
                    //    angle: Math.PI / 4
                    //}),
                    text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({ color: '#000' }),
                        stroke: new ol.style.Stroke({
                            color: '#fff', width: 2
                        }),
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetY: -5,
                        text: Text
                    }),
                    //zIndex: 10
                    zIndex: GeoType
                })
            ];
        }

        function polyconStyleFunction(Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity, ZIndex) {
            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: StrokeColor,
                        width: StrokeWidth
                    }),
                    fill: new ol.style.Fill({
                        color: [FillR, FillG, FillB, FillOpacity]
                    }),
                    text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({ color: '#000' }),
                        stroke: new ol.style.Stroke({
                            color: '#fff', width: 2
                        }),
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetY: -5,
                        text: Text
                    }),
                    zIndex: ZIndex
                })
            ];
        }

        var PostData = new FormData();
        PostData.append("GeoType", GeoType);
        PostData.append("RefKey", RefKey);
        CallServicesWithFormData(WebserviceUrl, true, PostData, handleData);

        function handleData(data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);

            $.each(jsonObj, function (key, val) {

                var jsonLatLng = val.GeoCoordinates;
                var DrawLngLatArray = [];
                for (var i = 0; i < jsonLatLng.length; i++) {
                    DrawLngLatArray.push([jsonLatLng[i].Longitude, jsonLatLng[i].Latitude]);
                }
                //console.log(ringArea);

                if (val.RefGrpKey == "Marker") {

                    var geoMarkerObj = val;
                    var markerFeature = new ol.Feature({
                        geometry: new ol.geom.Point(ol.proj.fromLonLat([geoMarkerObj.GeoCoordinates[0].Longitude, geoMarkerObj.GeoCoordinates[0].Latitude]))
                    });

                    // set feature style
                    if (typeof val.GeoProperties !== 'undefined') {
                        let Text = val.Name;
                        let StrokeColor = val.GeoProperties[0].StrokeColor;
                        let StrokeWidth = val.GeoProperties[0].StrokeWidth;
                        let FillR = val.GeoProperties[0].FillR;
                        let FillG = val.GeoProperties[0].FillG;
                        let FillB = val.GeoProperties[0].FillB;
                        let FillOpacity = val.GeoProperties[0].FillOpacity;
                        let featureStyle = markerStyleFunction(Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);
                        markerFeature.setStyle(featureStyle);
                    }

                    markerFeature.setId("GEOMARKERID" + geoMarkerObj.Id);
                    markerFeature.setProperties({
                        'Id': geoMarkerObj.Id,
                        'Type': 'Marker',
                        'EnableSelect' : MarkerEnableSelect,
                        'EnableDelete': MarkerEnableDelete,
                        'RefGrpKey': '',
                        'RefKey': '',
                        'SketchGeoCoordinates': ''
                    });

                    oplMapObj.vectorLayer.getSource().addFeature(markerFeature);

                } else if (val.RefGrpKey == "LineString") {

                    var line = new ol.geom.LineString(DrawLngLatArray);
                    line.transform('EPSG:4326', 'EPSG:3857');

                    var featureObj = new ol.Feature(line);
                    featureObj.setId("DRAWID" + val.Id.toString());
                    featureObj.setProperties({
                        'Id': val.Id,
                        'Type': 'StorageLocations',
                        'EnableSelect' : LineStringEnableSelect,
                        'EnableDelete': LineStringEnableDelete,
                        'RefGrpKey': val.RefGrpKey,
                        'RefKey': '',
                        'Container': '',
                        'SketchGeoCoordinates': ''
                    });

                    let featureStyle = '#ff8000';
                    featureStyle = lineStyleFunction(featureStyle);
                    if (typeof val.GeoProperties !== 'undefined') {
                        if (val.GeoProperties[0].StrokeColor != "") {
                            featureStyle = lineStyleFunction(val.GeoProperties[0].StrokeColor);
                        }
                    }
                    featureObj.setStyle(featureStyle);

                    oplMapObj.vectorLayer.getSource().addFeature(featureObj);
                
                } else {

                    var polygonArea = new ol.geom.Polygon([DrawLngLatArray]);
                    polygonArea.transform('EPSG:4326', 'EPSG:3857');

                    var featureObj = new ol.Feature(polygonArea);
                    featureObj.setId("DRAWID" + val.Id.toString());
                    featureObj.setProperties({
                        'Id': val.Id,
                        'Type': 'StorageLocations',
                        'EnableSelect' : PolygonEnableSelect,
                        'EnableDelete': PolygonEnableDelete,
                        'RefGrpKey': val.RefGrpKey,
                        'RefKey': '',
                        'Container': '',
                        'SketchGeoCoordinates': ''
                    });

                    // set feature style
                    if (typeof val.GeoProperties !== 'undefined') {   
                        let Text = val.Name; 
                        let StrokeColor = val.GeoProperties[0].StrokeColor;
                        let StrokeWidth = val.GeoProperties[0].StrokeWidth;
                        let FillR = val.GeoProperties[0].FillR;
                        let FillG = val.GeoProperties[0].FillG;
                        let FillB = val.GeoProperties[0].FillB;
                        let FillOpacity = val.GeoProperties[0].FillOpacity;
                        let featureStyle = polyconStyleFunction(Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity, GeoType);
                        featureObj.setStyle(featureStyle);
                    }

                    oplMapObj.vectorLayer.getSource().addFeature(featureObj);
                }

            });   
        }
    }

    initialSketchGeometryLocation(GetInitialSketchGeometryLocationUrl, SetSketchGeometryMvtLngLatUrl) {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        var PostData = new FormData();
        CallServicesWithFormData(GetInitialSketchGeometryLocationUrl, true, PostData, handleData);

        function handleData(data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);
            $.each(jsonObj, function (key, val) {
                //console.log(key + " : " + val.Id);
                oplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                    var featureId = feature.getId();
                    //console.log(featureId);
                    if (featureId == "DRAWID"+val.Id) {

                        // Move to initial coordinates.
                        var mvToLngLat = [val.MvToLongitude, val.MvToLatitude];
                        var featureCoords = feature.getGeometry().getCoordinates();
                        var sourcePoint = featureCoords[0][0];
                        var destinationPoint = sourcePoint;
                        if ((val.MvToLongitude != null) && (val.MvToLongitude != "") && (val.MvToLatitude != null) && (val.MvToLatitude != "")) {
                            destinationPoint = ol.proj.fromLonLat(mvToLngLat);
                            oplMapObj.goToCoord(destinationPoint[0], destinationPoint[1]);
                            wmsOplMapObj.moveSingleFeature(feature, sourcePoint, mvToLngLat);
                            wmsOplMapObj.setSketchGeometryMvtLngLat(SetSketchGeometryMvtLngLatUrl, val.Id, 0, 0);
                        }

                        return true;
                    } // end if
                });
            }); // .each
        }
    }

    setSketchGeometryMvtLngLat(SetSketchGeometryMvtLngLat, Id, MvToLongitude, MvToLatitude) {
        var PostData = new FormData();
        PostData.append("SketchGeometryId", Id);
        PostData.append("MvToLongitude", MvToLongitude);
        PostData.append("MvToLatitude", MvToLatitude);
        CallServicesWithFormData(SetSketchGeometryMvtLngLat, true, PostData, function (data) {
            var jsonObj = jQuery.parseJSON(data);
        });
    }

    SaveGeometryFeatureCoordinates(SaveGeometryFeatureCoordinatesUrl, Id, GeoCoordinates) {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        if (typeof Id === "undefined") return true;

        var strGeoCoordinates = "";
        for (var i = 0; i < GeoCoordinates.length; i++) {
            var coord = GeoCoordinates[i];
            let lng = coord[0];
            let lat = coord[1];
            strGeoCoordinates += "," + lng + ":" + lat;
        }
        strGeoCoordinates = strGeoCoordinates.substring(1, strGeoCoordinates.length);
        //console.log(strGeoCoordinates);

        var PostData = new FormData();
        PostData.append("GeometryId", Id.toString());
        PostData.append("GeoCoordinates", strGeoCoordinates);

        CallServicesWithFormData(SaveGeometryFeatureCoordinatesUrl, true, PostData, function (data) {
            var jsonObj = jQuery.parseJSON(data);
        });
    }

    saveSketchGeometryFeatureCoordinates(SaveSketchGeometryFeatureCoordinatesUrl, Id, RefKey, SketchGeoCoordinates) {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        if (typeof Id === "undefined") return true;

        var strGeoCoordinates = "";
        for (var i = 0; i < SketchGeoCoordinates.length; i++) {
            var coord = SketchGeoCoordinates[i];
            let lng = coord[0];
            let lat = coord[1];
            strGeoCoordinates += "," + lng + ":" + lat;
        }
        strGeoCoordinates = strGeoCoordinates.substring(1, strGeoCoordinates.length);
        //console.log(strGeoCoordinates);

        var PostData = new FormData();
        PostData.append("SketchGeometryId", Id.toString());
        PostData.append("RefKey", RefKey);
        PostData.append("SketchGeoCoordinates", strGeoCoordinates);

        CallServicesWithFormData(SaveSketchGeometryFeatureCoordinatesUrl, true, PostData, function (data) {
            var jsonObj = jQuery.parseJSON(data);
        });
    }

    createOrUpdateDraw(GeometryId, GeoType, RefGrpKey, RefKey, Name, Description, IsActive, StrokeColor, FillR, FillG, FillB, GeoCoordinates) {
        //console.log(GeoCoordinates);
        var strGeoCoordinates = "";
        for (var i = 0; i < GeoCoordinates.length; i++) {
            var coord = GeoCoordinates[i];
            let lng = coord[0];
            let lat = coord[1];
            strGeoCoordinates += "," + lng + ":" + lat;
        }
        strGeoCoordinates = strGeoCoordinates.substring(1, strGeoCoordinates.length);
        //console.log(strGeoCoordinates);

        var PostData = new FormData();
        PostData.append("GeometryId", GeometryId);
        PostData.append("GeoType", GeoType);
        PostData.append("RefGrpKey", RefGrpKey);
        PostData.append("RefKey", RefKey);
        PostData.append("Name", Name);
        PostData.append("Description", Description);
        PostData.append("IsActive", IsActive);
        PostData.append("StrokeColor", StrokeColor);
        PostData.append("FillR", FillR);
        PostData.append("FillG", FillG);
        PostData.append("FillB", FillB);
        PostData.append("GeoCoordinates", strGeoCoordinates);

        var jsonObj;
        CallServicesWithFormData(GlobalCreateOrUpdateDrawUrl, false, PostData, function (data) {
            jsonObj = jQuery.parseJSON(data);
        });
        return jsonObj;
    }

    createPartGeometry(GetdGeometryUrl, GeometryId) {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        var PostData = new FormData();
        PostData.append("GeometryId", GeometryId);

        var RetieUrlVal = new getRetieUrl();
        var wsrvUrl = "";
        wsrvUrl = GetdGeometryUrl;
        wsrvUrl += "?param=";
        wsrvUrl += "&RetieUrlVal=" + RetieUrlVal.getRetieUrlString();

        $.ajax({
            url: wsrvUrl,
            data: PostData,
            type: 'POST',
            async: true,
            processData: false,
            contentType: false,
            cache: false,
            success: function (data) {
                //console.log(data);
                var jsonObj = jQuery.parseJSON(data);
                //console.log(jsonObj);

                var jsonLatLng = jsonObj.SketchGeometry.SketchGeoCoordinates;
                var ringArea = [];                
                for (var i = 0; i < jsonLatLng.length; i++) {
                    ringArea.push([jsonLatLng[i].Longitude, jsonLatLng[i].Latitude]);
                }
                //console.log(ringArea);

                var polygonArea = new ol.geom.Polygon([ringArea]);
                polygonArea.transform('EPSG:4326', 'EPSG:3857');

                var featureObj = new ol.Feature(polygonArea);
                featureObj.setId("DRAWID" + jsonObj.SketchGeometry.Id.toString());
                featureObj.setProperties({
                    'Id': jsonObj.SketchGeometry.Id,
                    'Type': '',
                    'EnableDelete': false,
                    'RefGrpKey': jsonObj.RefGrpKey,
                    'RefKey': jsonObj.SketchGeometry.RefKey,
                    'SketchGeoCoordinates': jsonObj.SketchGeometry.SketchGeoCoordinates
                });

                // set feature style
                if (typeof jsonObj.SketchGeometry.SketchGeoProperties[0] !== 'undefined') {
                    var Stroke = new ol.style.Stroke({
                        color: jsonObj.SketchGeometry.SketchGeoProperties[0].StrokeColor,
                        width: jsonObj.SketchGeometry.SketchGeoProperties[0].StrokeWidth
                    });

                    var Fill = new ol.style.Fill({
                        color: [jsonObj.SketchGeometry.SketchGeoProperties[0].FillR,
                                jsonObj.SketchGeometry.SketchGeoProperties[0].FillG,
                                jsonObj.SketchGeometry.SketchGeoProperties[0].FillB,
                                jsonObj.SketchGeometry.SketchGeoProperties[0].FillOpacity]
                    });

                    var Style = new ol.style.Style({
                        stroke: Stroke,
                        fill: Fill
                    });
                    featureObj.setStyle(Style);
                }    
                
                oplMapObj.vectorLayer.getSource().addFeature(featureObj);

                // Move to initial coordinates.
                var mvToLngLat = [jsonObj.Geometry.MvToLongitude, jsonObj.Geometry.MvToLatitude];
                var featureCoords = featureObj.getGeometry().getCoordinates();
                var sourcePoint = featureCoords[0][0];
                var destinationPoint = sourcePoint;
                if ((jsonObj.Geometry.MvToLongitude != null) && (jsonObj.Geometry.MvToLongitude != "") &&
                    (jsonObj.Geometry.MvToLatitude != null) && (jsonObj.Geometry.MvToLatitude != ""))
                { 
                    destinationPoint = ol.proj.fromLonLat(mvToLngLat);
                    oplMapObj.goToCoord(destinationPoint[0], destinationPoint[1]);                    
                    wmsOplMapObj.moveSingleFeature(featureObj, sourcePoint, mvToLngLat);  
                }

                var PopupInfo = "<b>Id : </b>" + jsonObj.SketchGeometry.Id + "<br/>";
                PopupInfo += "<b>Name : </b>" + jsonObj.SketchGeometry.Name + "<br/>";
                PopupInfo += "<b>Description : </b>" + jsonObj.SketchGeometry.Description;

                oplMapObj.popupOverlay.show(destinationPoint);
                oplMapObj.popupOverlay.show(PopupInfo);
                oplMapObj.popupOverlay.setPositioning('bottom-left');
            },
            error: function () {
                // handle error
            }
        }); // end ajax
    }

    deleteGeometry(WebserviceUrl, GeometryId) {
        var PostData = new FormData();
        PostData.append("GeometryId", GeometryId);
        CallServicesWithFormData(WebserviceUrl, true, PostData, function (data) {
            var jsonObj = jQuery.parseJSON(data);
        });
    }

    deleteSketchGeometry(WebserviceUrl, SketchGeometryId) {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        var PostData = new FormData();
        PostData.append("SketchGeometryId", SketchGeometryId);
        CallServicesWithFormData(WebserviceUrl, true, PostData, function (data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);
            if (jsonObj.Result == true)
            {
                oplMapObj.vectorLayer.getSource().forEachFeature(function (feature) {
                    var featureId = feature.get('Id');
                    if (featureId == SketchGeometryId) {            
                        let source = oplMapObj.vectorLayer.getSource();
                        source.removeFeature(feature);
                        wmsOplMapObj.deleteSketchGeometry(GlobalDeleteSketchGeometryUrl, featureId);
                    } // end if
                });
            }
        });
    }

    transferConfirm(ContainerName, Feature) {

        function styleFunction(text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity) {
            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: StrokeColor,
                        width: StrokeWidth
                    }),
                    fill: new ol.style.Fill({
                        color: [FillR, FillG, FillB, FillOpacity]
                    }),
                    text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({ color: '#000' }),
                        stroke: new ol.style.Stroke({
                            color: '#fff', width: 2
                        }),
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetY: -5,
                        text: text
                    }),
                    zIndex: 0
                })
            ];
        }

        let StrokeColor = '#4385f4';
        let FillColor = '#6a9cf4';
        let FillR = hexToRgb(FillColor).r;
        let FillG = hexToRgb(FillColor).g;
        let FillB = hexToRgb(FillColor).b;

        var PostData = new FormData();
        PostData.append("ContainerName", ContainerName);
        PostData.append("StrokeColor", StrokeColor);
        PostData.append("StrokeWidth", "1");
        PostData.append("FillR", FillR);
        PostData.append("FillG", FillG);
        PostData.append("FillB", FillB);
        PostData.append("FillOpacity", "0.5");

        CallServicesWithFormData(GlobalTransferConfirmUrl, true, PostData, function (data) {
            var jsonObj = jQuery.parseJSON(data);
            //console.log(jsonObj);

            let Text = ContainerName;
            let StrokeColor = jsonObj.SketchGeoProperties.StrokeColor;
            let StrokeWidth = jsonObj.SketchGeoProperties.StrokeWidth;
            let FillR = jsonObj.SketchGeoProperties.FillR;
            let FillG = jsonObj.SketchGeoProperties.FillG;
            let FillB = jsonObj.SketchGeoProperties.FillB;
            let FillOpacity = jsonObj.SketchGeoProperties.FillOpacity;
            let featureStyle = styleFunction(Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity)
            Feature.setStyle(featureStyle);
        });
    }

    measureCoord(coord, coord2) 
    {
        let distance = 0;
        if (coord2) {
            const length = ol.sphere.getLength(new ol.geom.LineString([coord2, coord]));
            distance = (Math.round(length * 100) / 100) * 100;            
            
            // //const distance = (Math.round(length / 1000 * 100) / 100) + ' km';
            // if (length > 100) {
            //     distance = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
            // } else {
            //     distance = (Math.round(length * 100) / 100) + ' ' + 'm';
            // }
        }
        return distance;
    }

    resizeRectangle(Id, Width, Length, Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity) 
    {
        var wmsOplMapObj = this;
        var oplMapObj = this.OplMapObj;

        let measureVector1 = oplMapObj.fineLayerByName('measureVector1');
        let measureVector2 = oplMapObj.fineLayerByName('measureVector2');
        if (typeof measureVector1 !== 'undefined') { oplMapObj.map.removeLayer(measureVector1); }
        if (typeof measureVector2 !== 'undefined') { oplMapObj.map.removeLayer(measureVector2); }

        if ((Width == "") && (Length == "")) { return; }

        let source = oplMapObj.vectorLayer.getSource();
        let squareObj = source.getFeatureById("DRAWID" + Id);
        let GeoCoordinates = squareObj.getGeometry().getCoordinates();
        if (squareObj == null) { return; }            
        if (squareObj != null) { source.removeFeature(squareObj); }
        
        // get Latitude and Longitude
        let lnglat = ol.proj.transform(GeoCoordinates[0][0], 'EPSG:3857', 'EPSG:4326');
        let jsonLatLng = [{ lat: lnglat[1], lng: lnglat[0] }];
        let lng = parseFloat(jsonLatLng[0].lng);
        let lat = parseFloat(jsonLatLng[0].lat);

        let featureObj = wmsOplMapObj.createSquare(jsonLatLng, "DRAWID" + Id, Width, Length, Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity);
        featureObj.setProperties({
            'Id': Id,
            'Type': 'TempLocationMarker',
            'EnableSelect' : true,
            'EnableDelete': true,
            'RefGrpKey': 'Square',
            'RefKey': '',
            'SketchGeoCoordinates': ''
        });

        // save data..
        squareObj = source.getFeatureById("DRAWID" + Id);
        if (squareObj != null) 
        {
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

            let PostData = new FormData();
            PostData.append("GeometryId", Id);
            PostData.append("GeoCoordinates", strGeoCoordinates);

            CallServicesWithFormData(GlobalSaveGeometryFeatureCoordinatesUrl, false, PostData, function (data) {
              let jsonObj = jQuery.parseJSON(data);
              //console.log(jsonObj);
            });                
        }
    }        

    createSquare(jsonLatLng, featureId, width, height, text, strokeColor, strokeWidth, fillR, fillG, fillB, fillOpacity) {
        var oplMapObj = this.OplMapObj;

        function measurementStyleFunc(feature, offsetX, offsetY) {

            var geometry = feature.getGeometry();
            var styles = [
                // linestring style
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#ef140b',
                        width: 2
                    })
                })
            ];

            function segmentText(coord, coord2, offsetX, offsetY) {
                const coord_t = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
                let coordText = coord_t[1].toFixed(0) + '/' + coord_t[0].toFixed(0);
                coordText = "";

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
                    font: '12px Calibri,sans-serif',
                    text: coordText,
                    fill: new ol.style.Fill({
                        color: '#1b6aaa'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 2
                    }),
                    offsetY: offsetY,
                    offsetX: offsetX,
                    textAlign: 'center',
                    textBaseline: 'bottom',
                    scale: 1
                });
            }

            function createSegmentStyle(coord, coord2, rotation, offsetX, offsetY) {
                return new ol.style.Style({
                    geometry: new ol.geom.Point(coord),
                    image: new ol.style.Icon({
                        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAADCAIAAADdv/LVAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBhXY1Da6MPEwMDAxMDAAAALMAEkQYjH8gAAAABJRU5ErkJggg==',
                        anchor: [0.75, 0.5],
                        rotateWithView: true,
                        rotation: -rotation,
                        scale: 4
                    }),
                    text: segmentText(coord, coord2, offsetX, offsetY)
                })
            };

            const firstCoord = geometry.getFirstCoordinate();
            geometry.forEachSegment(function (start, end) {
                var dx = end[0] - start[0];
                var dy = end[1] - start[1];
                var rotation = Math.atan2(dy, dx);
                if (firstCoord[0] === start[0] && firstCoord[1] === start[1]) {
                    styles.push(createSegmentStyle(start, null, rotation, offsetX, offsetY));
                }
                styles.push(createSegmentStyle(end, firstCoord, rotation, offsetX, offsetY));
            });

            return styles;
        }

        function squareStyleFunc(Text, StrokeColor, StrokeWidth, FillR, FillG, FillB, FillOpacity) {
            return [
                new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: StrokeColor,
                        width: StrokeWidth
                    }),
                    fill: new ol.style.Fill({
                        color: [FillR, FillG, FillB, FillOpacity]
                    }),
                    text: new ol.style.Text({
                        font: '12px Calibri,sans-serif',
                        fill: new ol.style.Fill({ color: '#000' }),
                        stroke: new ol.style.Stroke({
                            color: '#fff', width: 2
                        }),
                        textAlign: 'center',
                        textBaseline: 'bottom',
                        offsetY: -5,
                        text: Text
                    }),
                    zIndex: 1000
                })
            ];
        }

        // initialize...
        //var jsonLatLng = [{ lat: 14.070485002375136, lng: 101.82590338730834 }]; // PP 
        //var jsonLatLng = [{ lat: 13.453461841957179, lng: 100.60750438812147 }]; // Ao Samut Prakan 
        var distanceArray = [];
        var lineStringLngLat = [];

        var squareObj = {};
        var lng = 0;
        var lat = 0;
        var lnglat = [];

        var lineHStringArray = [];
        lng = parseFloat(jsonLatLng[0].lng);
        lat = parseFloat(jsonLatLng[0].lat);
        lnglat = [lng, lat];
        lineHStringArray.push(lnglat);

        var intWidth = parseInt(width);
        var accWidth = intWidth - (intWidth * 0.07);
        lng = (parseFloat(jsonLatLng[0].lng) + (0.0000001 * accWidth)); // cm
        lat = parseFloat(jsonLatLng[0].lat);
        lnglat = [lng, lat];
        lineHStringArray.push(lnglat);

        //console.log(lineHStringArray);
        var squareObj = { lng: lineHStringArray[0][0], lat: lineHStringArray[0][1] };  // 0
        distanceArray.push(squareObj);
        lineStringLngLat.push(squareObj);
        var squareObj = { lng: lineHStringArray[1][0], lat: lineHStringArray[1][1] };  // 1
        distanceArray.push(squareObj);
        lineStringLngLat.push(squareObj);

        var PtP1 = [];
        PtP1.push([lineHStringArray[0][0], lineHStringArray[0][1]]);
        PtP1.push([lineHStringArray[1][0], lineHStringArray[1][1]]);
        var line1 = new ol.geom.LineString(PtP1);
        line1.transform('EPSG:4326', 'EPSG:3857');
        var lineFeature1 = new ol.Feature(line1);
        lineFeature1.setId("MeasureLine1");
        var lineSource1 = new ol.source.Vector({
            features: [lineFeature1]
        });
        var style1 = measurementStyleFunc(lineFeature1, 0, -10);
        var measureVector1 = new ol.layer.Vector({
            source: lineSource1,
            style: style1
        });
        measureVector1.set('name','measureVector1');
        this.OplMapObj.map.addLayer(measureVector1);
        
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        var lineVStringArray = [];
        lng = parseFloat(distanceArray[1].lng);
        lat = parseFloat(distanceArray[1].lat);
        lnglat = [lng, lat];
        lineVStringArray.push(lnglat);

        lng = parseFloat(distanceArray[1].lng);

        var intHeight = parseInt(height);
        var accHeight = intHeight - (intHeight * 0.1);
        lat = (parseFloat(distanceArray[1].lat) - (0.0000001 * accHeight)); // cm 0.0000001
        lnglat = [lng, lat];
        lineVStringArray.push(lnglat);

        //console.log(lineVStringArray);
        var squareObj = { lng: lineVStringArray[1][0], lat: lineVStringArray[1][1] }; // 2
        distanceArray.push(squareObj);
        lineStringLngLat.push(squareObj);

        var PtP2 = [];
        PtP2.push([lineVStringArray[0][0], lineVStringArray[0][1]]);
        PtP2.push([lineVStringArray[1][0], lineVStringArray[1][1]]);
        var line2 = new ol.geom.LineString(PtP2);
        line2.transform('EPSG:4326', 'EPSG:3857');
        var lineFeature2 = new ol.Feature(line2);
        lineFeature1.setId("MeasureLine2");
        var lineSource2 = new ol.source.Vector({
            features: [lineFeature2]
        });
        var style2 = measurementStyleFunc(lineFeature2, 23, 5);
        var measureVector2 = new ol.layer.Vector({
            source: lineSource2,
            style: style2
        });
        measureVector2.set('name', 'measureVector2');
        this.OplMapObj.map.addLayer(measureVector2);

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        var lineHStringArray2 = [];
        lng = parseFloat(distanceArray[2].lng);
        lat = parseFloat(distanceArray[2].lat);
        lnglat = [lng, lat];
        lineHStringArray2.push(lnglat);

        lng = (parseFloat(distanceArray[2].lng) - (0.0000001 * parseFloat(width))); // cm
        lat = parseFloat(distanceArray[2].lat);
        lnglat = [lng, lat];
        lineHStringArray2.push(lnglat);

        //console.log(lineHStringArray2);
        var squareObj = { lng: lineHStringArray2[0][0], lat: lineHStringArray2[0][1] }; // 3
        distanceArray.push(squareObj);
        lineStringLngLat.push({ lng: lineHStringArray2[1][0], lat: lineHStringArray2[1][1] });

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        lineStringLngLat.push(distanceArray[0]);
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        let squareLatLng = [
            { lat: distanceArray[0].lat, lng: distanceArray[0].lng },
            { lat: distanceArray[1].lat, lng: distanceArray[1].lng },
            { lat: distanceArray[2].lat, lng: distanceArray[2].lng },
            { lat: distanceArray[2].lat, lng: distanceArray[0].lng }
        ]
        //console.log(jsonArea);
        //this.createPolygonArea(this.OplMapObj, jsonLatLng, featureId);

        var ringArea = [];
        for (var i = 0; i < squareLatLng.length; i++) {
            ringArea.push([squareLatLng[i].lng, squareLatLng[i].lat]);
        }
        //console.log(ringArea);

        var polygonArea = new ol.geom.Polygon([ringArea]);
        polygonArea.transform('EPSG:4326', 'EPSG:3857');

        var featureObj = new ol.Feature(polygonArea);
        featureObj.setId(featureId);

        // set feature style
        let featureStyle = squareStyleFunc(text, strokeColor, strokeWidth, fillR, fillG, fillB, fillOpacity);
        featureObj.setStyle(featureStyle);

        this.OplMapObj.vectorLayer.getSource().addFeature(featureObj);
        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        return featureObj;
    }

    TestMeasuringDistances() {
        var distanceArray = [];

        function measurementStyleFunc(feature) {

            var toggle = 0;

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

            function segmentText(coord, coord2, showText) {

                //console.log(coord +":"+ coord2);

                //var wmsOplMapObj = this;

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

                    //const distance = (Math.round(length * 100) / 100) + ' ' + 'm';
                    //let lnglat1 = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
                    //let lng1 = lnglat1[0];
                    //let lat1 = lnglat1[1];
                    //let lnglat2 = ol.proj.transform(coord, 'EPSG:3857', 'EPSG:4326');
                    //let lng2 = lnglat2[0];
                    //let lat2 = lnglat2[1];
                    //let obj = { distance: distance, lng1: lng1, lat1: lat1, lng2: lng2, lat2: lat2 };
                    //distanceArray.push(obj);
                } else {
                    coordText = coordText + '\n0';  
                }

                var defaultColor = '#1b6aaa';
                //if (showText == false) {
                //    coordText = "";
                //} else {
                //    defaultColor = '#87b87f';
                //}

                return new ol.style.Text({
                    text: coordText,
                    fill: new ol.style.Fill({
                        color: defaultColor
                    }),
                    offsetY: 25,
                    offsetY: -5,
                    textAlign: 'center',
                    textBaseline: 'bottom',
                    scale: 1,
                });
            }

            function createSegmentStyle(coord, coord2, rotation, showText) {
                return new ol.style.Style({
                    geometry: new ol.geom.Point(coord),
                    image: new ol.style.Icon({
                        src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAADCAIAAADdv/LVAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBhXY1Da6MPEwMDAxMDAAAALMAEkQYjH8gAAAABJRU5ErkJggg==',
                        anchor: [0.75, 0.5],
                        rotateWithView: true,
                        rotation: -rotation,
                        scale: 4
                    }),
                    text: segmentText(coord, coord2, showText)
                })
            };

            var itemIndex = 0;
            const firstCoord = geometry.getFirstCoordinate();
            geometry.forEachSegment(function (start, end) {
                itemIndex++;
                toggle = false;
                if (itemIndex == 9) {
                    itemIndex = 1;
                    toggle = true;
                }
                //console.log("Toggle : " + Toggle);

                var dx = end[0] - start[0];
                var dy = end[1] - start[1];
                var rotation = Math.atan2(dy, dx);
                if (firstCoord[0] === start[0] && firstCoord[1] === start[1]) {
                    styles.push(createSegmentStyle(start, null, rotation));
                }

                styles.push(createSegmentStyle(end, firstCoord, rotation, toggle));
            });

            return styles;
        }





        //var jsonAreaB11 = [
        //    { lat: 14.070485002375136, lng: 101.82590338730834 },
        //    { lat: 14.070485002375136, lng: 101.82613724821735 },
        //    { lat: 14.07030431385185, lng: 101.82613724821735 },
        //    { lat: 14.07030431385185, lng: 101.82590338730834 }]
        //this.createPolygonArea(this.OplMapObj, jsonAreaB11, "");

        var jsonLatLng = [{ lat: 14.070485002375136, lng: 101.82590338730834 }]

        var squareObj = {};
        var lng = 0;
        var lat = 0;

        var lnglat = [];
        var lineHStringArray = [];

        lng = parseFloat(jsonLatLng[0].lng);
        lat = parseFloat(jsonLatLng[0].lat);
        lnglat = [lng, lat];
        lineHStringArray.push(lnglat);

        lng = (parseFloat(jsonLatLng[0].lng) + (0.0000001 * 2000)); // cm
        lat = parseFloat(jsonLatLng[0].lat);
        lnglat = [lng, lat];
        lineHStringArray.push(lnglat);

        console.log(lineHStringArray);
        var squareObj = { lng: lineHStringArray[0][0], lat: lineHStringArray[0][1] };  // 0
        distanceArray.push(squareObj);
        var squareObj = { lng: lineHStringArray[1][0], lat: lineHStringArray[1][1] };  // 1
        distanceArray.push(squareObj);

        var lineH = new ol.geom.LineString(lineHStringArray);
        lineH.transform('EPSG:4326', 'EPSG:3857');
        var lineHFeature = new ol.Feature(lineH);
        var lineHSource = new ol.source.Vector({
            features: [lineHFeature]
        });

        var measureVectorH = new ol.layer.Vector({
            source: lineHSource,
            style: measurementStyleFunc
        })
        this.OplMapObj.map.addLayer(measureVectorH);

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        var lineVStringArray = [];
        lng = parseFloat(distanceArray[1].lng);
        lat = parseFloat(distanceArray[1].lat);
        lnglat = [lng, lat];
        lineVStringArray.push(lnglat);

        lng = parseFloat(distanceArray[1].lng);
        lat = (parseFloat(distanceArray[1].lat) - (0.0000001 * 2000)); // cm
        lnglat = [lng, lat];
        lineVStringArray.push(lnglat);

        console.log(lineVStringArray);
        var squareObj = { lng: lineVStringArray[1][0], lat: lineVStringArray[1][1] }; // 2
        distanceArray.push(squareObj);

        var lineV = new ol.geom.LineString(lineVStringArray);
        lineV.transform('EPSG:4326', 'EPSG:3857');
        var lineVFeature = new ol.Feature(lineV);
        var lineVSource = new ol.source.Vector({
            features: [lineVFeature]
        });

        var measureVectorV = new ol.layer.Vector({
            source: lineVSource,
            style: measurementStyleFunc
        })
        this.OplMapObj.map.addLayer(measureVectorV);

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

        var lineHStringArray2 = [];
        lng = parseFloat(distanceArray[2].lng);
        lat = parseFloat(distanceArray[2].lat);
        lnglat = [lng, lat];
        lineHStringArray2.push(lnglat);

        lng = (parseFloat(distanceArray[2].lng) - (0.0000001 * 2000)); // cm
        lat = parseFloat(distanceArray[2].lat);
        lnglat = [lng, lat];
        lineHStringArray2.push(lnglat);

        console.log(lineHStringArray2);
        var squareObj = { lng: lineHStringArray2[0][0], lat: lineHStringArray2[0][1] }; // 3
        distanceArray.push(squareObj);

        var lineH2 = new ol.geom.LineString(lineHStringArray2);
        lineH2.transform('EPSG:4326', 'EPSG:3857');
        var lineH2Feature = new ol.Feature(lineH2);
        var lineH2Source = new ol.source.Vector({
            features: [lineH2Feature]
        });

        var measureVectorH2 = new ol.layer.Vector({
            source: lineH2Source,
            style: measurementStyleFunc
        })
        this.OplMapObj.map.addLayer(measureVectorH2);

        //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //var jsonAreaB12 = [
        //    { lat: 14.070485002375136, lng: 101.82590338730834 },
        //    { lat: 14.070485002375136, lng: 101.82610338730835 },
        //    { lat: 14.070285002375137, lng: 101.82610338730835 },
        //    { lat: 14.070285002375137, lng: 101.82590338730834 }
        //]

        //console.log(distanceArray);
        var jsonAreaB12 = [
            { lat: distanceArray[0].lat, lng: distanceArray[0].lng },
            { lat: distanceArray[1].lat, lng: distanceArray[1].lng },
            { lat: distanceArray[2].lat, lng: distanceArray[2].lng },
            { lat: distanceArray[2].lat, lng: distanceArray[0].lng }
        ]
        console.log(jsonAreaB12);
        this.createPolygonArea(this.OplMapObj, jsonAreaB12, "");


        //-------------------------------------------------------------------------------
        //distanceArray = [];
        //var lineHStringArray = [];
        //for (var i = 0; i < 20; i++) // 10 = 10 cm 
        //{
        //    if (i == 0) {
        //        lng = parseFloat(jsonLatLng[0].lng);
        //        lat = parseFloat(jsonLatLng[0].lat);
        //    } else {
        //        lng = parseFloat(lng) + 0.0000001; // 0.0000001
        //    }
        //    //console.log(lng + ":" + lat);

        //    var lnglat = [lng, lat];
        //    lineHStringArray.push(lnglat);
        //}

        //var lineH = new ol.geom.LineString(lineHStringArray);
        //lineH.transform('EPSG:4326', 'EPSG:3857');
        //var lineHFeature = new ol.Feature(lineH);
        //var lineHSource = new ol.source.Vector({
        //    features: [lineHFeature]
        //});

        //var measureVectorH = new ol.layer.Vector({
        //    source: lineHSource,
        //    style: measurementStyleFunc
        //})
        //this.OplMapObj.map.addLayer(measureVectorH);

        //var distanceH = distanceArray;
        //console.log(distanceH);
        //-------------------------------------------------------------------------------        
        //lng = 0;
        //lat = 0;
        //distanceArray = [];
        //var lineVStringArray = [];
        //for (var i = 0; i < 20; i++) // 10 = 10 cm 
        //{
        //    if (i == 0) {
        //        lng = parseFloat(jsonLatLng[0].lng);
        //        lat = parseFloat(jsonLatLng[0].lat);
        //    } else {
        //        lat = parseFloat(lat) - 0.0000001; // 0.0000001
        //    }
        //    //console.log(lng + ":" + lat);

        //    var lnglat = [lng, lat];
        //    lineVStringArray.push(lnglat);
        //}

        //var lineV = new ol.geom.LineString(lineVStringArray);
        //lineV.transform('EPSG:4326', 'EPSG:3857');
        //var lineVFeature = new ol.Feature(lineV);
        //var lineVSource = new ol.source.Vector({
        //    features: [lineVFeature]
        //});

        //var measureVectorV = new ol.layer.Vector({
        //    source: lineVSource,
        //    style: measurementStyleFunc
        //})
        //this.OplMapObj.map.addLayer(measureVectorV);

        //var distanceV = distanceArray;
        //console.log(distanceV);               
    }


}