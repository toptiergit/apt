
export default class PPOplMap {

    constructor(OplMapObj, WmsOplMapObj) {
        this.OplMapObj = OplMapObj;
        this.WmsOplMapObj = WmsOplMapObj;

        this.PPPjLat = 14.070855;
        this.PPPjLng = 101.824211;
        this.PPBkLat = 13.684571;
        this.PPBkLng = 100.647539;
    }

    createPPOplMap(setting) {
        var oplMapObj = this.OplMapObj;
        var wmsOplMapObj = this.WmsOplMapObj;

        var ShowPPGeoBookmarkSetting = false;

        for (let ele of setting) {
            if (ele == 'ShowPPGeoBookmark') {
                ShowPPGeoBookmarkSetting = true;
            }
        }

        if (ShowPPGeoBookmarkSetting == true) {
            // create GEO bookmark
            var PPGeoBookmark = new ol.control.GeoBookmark({
                marks:
                {
                    "พรีเมียร์ โพรดักส์ ปราจีน": { pos: ol.proj.transform([this.PPPjLng, this.PPPjLat], 'EPSG:4326', 'EPSG:3857'), zoom: 18, permanent: true },
                    "พรีเมียร์ โพรดักส์ หนองจอก": { pos: ol.proj.transform([this.PPBkLng, this.PPBkLat], 'EPSG:4326', 'EPSG:3857'), zoom: 18, permanent: true }
                }
            });
            PPGeoBookmark.set('editable', false);
            this.OplMapObj.map.addControl(PPGeoBookmark);
        }

        let PPMark = oplMapObj.addMarker(this.PPPjLat, this.PPPjLng, "PPMarkId", oplMapObj.pulsateMarkerStyle);
        let PPBK = oplMapObj.addMarker(this.PPBkLat, this.PPBkLng, "PPBKMarkId", oplMapObj.pulsateMarkerStyle);
        //oplMapObj.pulsate(oplMapObj.map, "blue", PPMark, 2000);
        oplMapObj.pulsate(oplMapObj.map, "blue", PPBK, 2000);

/*
        //--------------------------------------------------------------------------------
        var jsonAreaStore = [{ lat: 14.070687, lng: 101.823881 }, { lat: 14.070748, lng: 101.824393 }, { lat: 14.070257, lng: 101.824410 },
        { lat: 14.070266, lng: 101.824336 }, { lat: 14.069688, lng: 101.824320 }, { lat: 14.069589, lng: 101.824204 },
        { lat: 14.069583, lng: 101.824136 }, { lat: 14.069467, lng: 101.824124 }, { lat: 14.069469, lng: 101.823822 }]
        wmsOplMapObj.createPolygonArea(this.OplMapObj, jsonAreaStore, "");
        //--------------------------------------------------------------------------------
        var jsonAreaB1 = [{ lat: 14.070937, lng: 101.823898 }, { lat: 14.070929, lng: 101.824021 }, { lat: 14.071073, lng: 101.824304 },
        { lat: 14.071067, lng: 101.824404 }, { lat: 14.070758, lng: 101.824398 }, { lat: 14.070774, lng: 101.823897 }]
        wmsOplMapObj.createPolygonArea(this.OplMapObj, jsonAreaB1, "");
        //--------------------------------------------------------------------------------
        var jsonAreaB2 = [{ lat: 14.070739, lng: 101.824467 }, { lat: 14.070733, lng: 101.824599 }, { lat: 14.070530, lng: 101.824584 }, { lat: 14.070535, lng: 101.824455 }]
        wmsOplMapObj.createPolygonArea(this.OplMapObj, jsonAreaB2, "");
        //--------------------------------------------------------------------------------
        var jsonAreaB3 = [{ lat: 14.070685, lng: 101.823880 }, { lat: 14.070679, lng: 101.824012 }, { lat: 14.070449, lng: 101.823990 }, { lat: 14.070464, lng: 101.823866 }]
        wmsOplMapObj.createPolygonArea(this.OplMapObj, jsonAreaB3, "");
        //--------------------------------------------------------------------------------
        var jsonAreaB4 = [{ lat: 14.069566, lng: 101.824019 }, { lat: 14.069566, lng: 101.824119 }, { lat: 14.069472, lng: 101.824110 }, { lat: 14.069472, lng: 101.824010 }]
        wmsOplMapObj.createPolygonArea(this.OplMapObj, jsonAreaB4, "");
        //--------------------------------------------------------------------------------
        var jsonAreaB5 = [{ lat: 14.069586, lng: 101.823827 }, { lat: 14.069583, lng: 101.824008 }, { lat: 14.069469, lng: 101.824000 }, { lat: 14.069469, lng: 101.823822 }]
        wmsOplMapObj.createPolygonArea(this.OplMapObj, jsonAreaB5, "");
        //--------------------------------------------------------------------------------
        var jsonAreaB6 = [{ lat: 14.070840, lng: 101.823626 }, { lat: 14.070834, lng: 101.823770 }, { lat: 14.070725, lng: 101.823772 }, { lat: 14.070728, lng: 101.823620 }]
        wmsOplMapObj.createPolygonArea(this.OplMapObj, jsonAreaB6, "");
        //--------------------------------------------------------------------------------
        var jsonAreaB7 = [{ lat: 14.070664, lng: 101.823445 }, { lat: 14.070661, lng: 101.823764 }, { lat: 14.070326, lng: 101.823745 }, { lat: 14.070337, lng: 101.823433 }]
        wmsOplMapObj.createPolygonArea(this.OplMapObj, jsonAreaB7, "");
        //--------------------------------------------------------------------------------
        var jsonAreaB8 = [{ lat: 14.070256, lng: 101.823428 }, { lat: 14.070234, lng: 101.823725 }, { lat: 14.070078, lng: 101.823720 }, { lat: 14.070086, lng: 101.823419 }]
        wmsOplMapObj.createPolygonArea(this.OplMapObj, jsonAreaB8, "");
        //--------------------------------------------------------------------------------
        var jsonAreaB9 = [{ lat: 14.070013, lng: 101.823292 }, { lat: 14.069994, lng: 101.823752 }, { lat: 14.069501, lng: 101.823729 }, { lat: 14.069497, lng: 101.823271 }]
        wmsOplMapObj.createPolygonArea(this.OplMapObj, jsonAreaB9, "");
        //--------------------------------------------------------------------------------
        var jsonAreaB10 = [{ lat: 14.070591, lng: 101.823303 }, { lat: 14.070586, lng: 101.823390 }, { lat: 14.070153, lng: 101.823379 }, { lat: 14.070153, lng: 101.823297 }]
        wmsOplMapObj.createPolygonArea(this.OplMapObj, jsonAreaB10, "");
        //--------------------------------------------------------------------------------
*/
        
    }
}