// 全域變數宣告
var map;
// 地圖資料來源
var datasourceSearch, datasourceRadius, datasourceKML;
// 網頁顯示相關變數
var searchInput, resultsPanel, searchInputLength, centerMapOnResults, popup;
// 搜尋欄最少輸入字數限制 The minimum number of characters needed in the search input before a search is performed.
var minSearchInputLength = 3;
// 搜尋延遲時間150毫秒 The number of ms between key strokes to wait before performing a search.
var keyStrokeDelay = 150;
// 地圖初始顯示大小
var zoommap = 10;
// 圓心
var point;

function GetMap() {
    //初始化地圖設定 Initialize a map instance.
    map = new atlas.Map('myMap', {
        center: [121.5, 24.8],
        zoom: zoommap,
        language:'zh-HanT-TW',
        view: 'Auto',

        //Add authentication details for connecting to Azure Maps.
        authOptions: {
            //Alternatively, use an Azure Maps key. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
            authType: 'subscriptionKey',
            subscriptionKey: subscriptionKey
        }
    });
    
    // 連結畫面中的變數
    // 搜尋顯示結果Store a reference to the Search Info Panel.
    resultsPanel = document.getElementById("results-panel");

    // 搜尋欄輸入字串 Add key up event to the search box. 
    searchInput = document.getElementById("search-input");
    searchInput.addEventListener("keyup", searchInputKeyup);

    // 彈出視窗 Create a popup which we can reuse for each result.
    popup = new atlas.Popup();

    //當地圖功能準備好後，開始運行下列事件 Wait until the map resources are ready.
    map.events.add('ready', function () {

        //Add the zoom control to the map.
        map.controls.add(new atlas.control.ZoomControl(), {
            position: 'top-right'
        });

        //Create a data source and add it to the map.
        datasourceSearch = new atlas.source.DataSource();
        map.sources.add(datasourceSearch);

        //Add a layer for rendering the results.
        var searchLayer = new atlas.layer.SymbolLayer(datasourceSearch, null, {
            iconOptions: {
                image: 'pin-round-darkblue',
                anchor: 'center',
                allowOverlap: true
            }
        });
        map.layers.add(searchLayer);

         //Create a data source and add it to the map.
         datasourceRadius = new atlas.source.DataSource();
         map.sources.add(datasourceRadius);
        
         //Create a circle from a Point Feature and wrap it with the Shape class.
        point = new atlas.Shape(new atlas.data.Point([-73.985708, 40.75773]), null, {
            subType: "Circle",
            radius: 1000
        });

         //Add circle to the datasource.
         datasourceRadius.add(point);
 
         //Create a polygon layer to render the filled in area of the circle polygon, and add it to the map.
         map.layers.add(new atlas.layer.PolygonLayer(datasourceRadius, null, {
             fillColor: 'red',
             fillOpacity: 0.5
         }));

        //Create a dataKML source and add it to the map.
        datasourceKML = new atlas.source.DataSource();
        map.sources.add(datasourceKML);

        //Add a simple data layer for rendering the data.
        var KMLlayer = new atlas.layer.SymbolLayer(datasourceKML, null,{
            iconOptions:{
                image: 'pin-red',
                anchor:'center',
                allowOverlap: true
            }
        });

        map.layers.add(KMLlayer);

        //增加滑鼠的事件1：針對searchLayer Add a click event to the search layer and show a popup when a result is clicked.
        map.events.add("click", searchLayer, function (e) {
            //Make sure the event occurred on a shape feature.
            if (e.shapes && e.shapes.length > 0 ) {
                showPopup(e.shapes[0]);
            }
        });

        //增加滑鼠的事件2：針對KMLLayerAdd a click event to the search layer and show a popup when a result is clicked.
        map.events.add("click", KMLlayer, function (e) {
            //Make sure the event occurred on a shape feature.
            if (e.shapes && e.shapes.length > 0 ) {
                showPopupKML(e.shapes[0]);
            }
        });
    });
}

function searchInputKeyup(e) {
    centerMapOnResults = false;
    if (searchInput.value.length >= minSearchInputLength) {
        if (e.keyCode === 13) { //Enter按鍵
            centerMapOnResults = true;
        }
        //Wait 100ms and see if the input length is unchanged before performing a search. 
        //This will reduce the number of queries being made on each character typed.
        setTimeout(function () {
            if (searchInputLength == searchInput.value.length) {
                search();
            }
        }, keyStrokeDelay);
    } else {
        resultsPanel.innerHTML = '';
    }
    searchInputLength = searchInput.value.length;
}
function search() {
    //Remove any previous results from the map.
    datasourceSearch.clear();
    popup.close();
    resultsPanel.innerHTML = '';

    //Use MapControlCredential to share authentication between a map control and the service module.
    var pipeline = atlas.service.MapsURL.newPipeline(new atlas.service.MapControlCredential(map));

    //搜尋功能初始化 Construct the SearchURL object
    var searchURL = new atlas.service.SearchURL(pipeline);
    // 搜尋欄所輸入的字串
    var query = document.getElementById("search-input").value;
    searchURL.searchPOI(atlas.service.Aborter.timeout(10000), query, {
        lon: map.getCamera().center[0],
        lat: map.getCamera().center[1],
        maxFuzzyLevel: 4,
        language:'zh-HanT-TW',
        country:'zh-TW',
        view: 'Auto'
    }).then((results) => {

        //Extract GeoJSON feature collection from the response and add it to the datasource
        var data = results.geojson.getFeatures();
        datasourceSearch.clear()
        datasourceSearch.add(data);

        if (centerMapOnResults) {
            map.setCamera({
                bounds: data.bbox
            });
        }
        console.log(data);
        //產生搜尋結果清單 Create the HTML for the results list.
        var html = [];
        for (var i = 0; i < data.features.length; i++) {
            var r = data.features[i];
            html.push('<li onclick="itemClicked(\'', r.id, '\')" >')
            html.push('<div class="title">');
            if (r.properties.poi && r.properties.poi.name) {
                html.push(r.properties.poi.name);
            } else {
                html.push(r.properties.address.freeformAddress);
            }
            html.push('</div><div class="info">', r.properties.type, ': ', r.properties.address.freeformAddress, '</div>');
            if (r.properties.poi) {
                if (r.properties.phone) {
                    html.push('<div class="info">phone: ', r.properties.poi.phone, '</div>');
                }
                if (r.properties.poi.url) {
                    html.push('<div class="info"><a href="http://', r.properties.poi.url, '">http://', r.properties.poi.url, '</a></div>');
                }
            }
            html.push('</li>');
            resultsPanel.innerHTML = html.join('');
        }

    });
//半徑初始所顯示值 Set the initial radius value.
document.getElementById("text").innerHTML = 1000;
}
//取得滑桿所顯示的半徑值 Get radius value from the slider.
function getRadius() {
    rad = parseInt(slider.value);
    point.addProperty("radius", rad);
    document.getElementById("text").innerHTML = rad;
  }

//讀入特定顯示資料 Read a KML file from a URL or pass in a raw KML string.        
var delimitedFileUrl = "/speschool.KML";
// 加入特殊學校顯示功能
function getKML() {
    datasourceKML.clear;
    atlas.io.read(delimitedFileUrl, {
        dataFormat: "kml"
    }).then(r => {
        if (r) {
          //Add the feature data to the data source.
          datasourceKML.add(r);
        }
    });
}

//搜尋結果清單點選功能
function itemClicked(id) {
    resultsPanel.innerHTML ="";
    //Center the map over the clicked item from the result list.
    var shape = datasourceSearch.getShapeById(id);
    map.setCamera({
        center: shape.getCoordinates(),
        zoom: zoommap
    });
    datasourceRadius.clear();
    point = new atlas.Shape(new atlas.data.Point(shape.getCoordinates()), null, {
        subType: "Circle",
        radius: 1000
      });
    //Add circle to the datasource.
    datasourceRadius.add(point);
}

//彈出視窗顯示searchLayer資料設定
function showPopup(shape) {
    var properties = shape.getProperties();
    // Create the HTML content of the POI to show in the popup.
    var html = ['<div class="poi-box">'];
    // Add a title section for the popup.
    html.push('<div class="poi-title-box"><b>');
    html.push();
    if (properties.poi && properties.poi.name) {
        html.push(properties.poi.name);
    } else {
        html.push(properties.address.freeformAddress);
    }
    html.push('</b></div>');
    // Create a container for the body of the content of the popup.
    html.push('<div class="poi-content-box">');
    html.push('<div class="info location">', properties.address.freeformAddress, '</div>');
    if (properties.poi) {
        if (properties.poi.phone) {
            html.push('<div class="info phone">', properties.poi.phone, '</div>');
        }
        if (properties.poi.url) {
            html.push('<div><a class="info website" href="http://', properties.poi.url, '">http://', properties.poi.url, '</a></div>');
        }
    }
    html.push('</div></div>');
    popup.setPopupOptions({
        position: shape.getCoordinates(),
        content: html.join('')
    });
    popup.open(map);
}

//彈出視窗顯示KMLLayer資料設定
function showPopupKML(shape) {
    var properties = shape.getProperties();
    // Create the HTML content of the POI to show in the popup.
    var html = ['<div class="poi-box">'];
    // Add a title section for the popup.
    html.push('<div class="poi-title-box"><b>');
    html.push(properties.name);
    html.push('</b></div>');
    // Create a container for the body of the content of the popup.
    html.push('<div class="poi-content-box">');
   // html.push('<div class="info location">', properties.address.freeformAddress, '</div>');
    if (properties.poi) {
        if (properties.poi.phone) {
            html.push('<div class="info phone">', properties.poi.phone, '</div>');
        }
        if (properties.poi.url) {
            html.push('<div><a class="info website" href="http://', properties.poi.url, '">http://', properties.poi.url, '</a></div>');
        }
    }
    html.push('</div></div>');
    popup.setPopupOptions({
        position: shape.getCoordinates(),
        content: html.join('')
    });
    popup.open(map);
}

