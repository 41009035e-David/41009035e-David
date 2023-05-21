$(document).ready(function(){
    //do something
    $("#thisButton").click(function(){
        processImage().then(function(data) {
            var nouns = extractNounsFromData(data); // 提取名詞
            $("#exampleSentences").append("<li>" + nouns + "</li>");
            if (nouns.length > 0) {
                var firstNoun = nouns[0];
                searchExample(firstNoun);
            } else {
                console.log("No nouns found in the image description.");
            }
        });
    });

    $("#inputImageFile").change(function(e){
        processImageFile(e.target.files[0]);
    });
});

function processImageFile(imageObject) {  
    //確認區域與所選擇的相同或使用客製化端點網址
    var url = "https://eastus.api.cognitive.microsoft.com/";
    var uriBase = url + "vision/v2.1/analyze";
    
    var params = {
        "visualFeatures": "Object",
        "details": "",
        "language": "en",
    };
    //顯示分析的圖片
    var sourceImageUrl = URL.createObjectURL(imageObject);
    document.querySelector("#sourceImage").src = sourceImageUrl;
    //送出分析
    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request header
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        processData:false,
        contentType:false,
        // Request body 將資料打包送給微軟進行分析
        data:  imageObject
    })
    .done(function(data) { //data為微軟分析過後之訊息
        //顯示JSON內容
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        $("#picDescription").text();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        //丟出錯誤訊息
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
};

function processImage() {
    
    //確認區域與所選擇的相同或使用客製化端點網址
    var url = "https://eastus.api.cognitive.microsoft.com/";
    var uriBase = url + "vision/v2.1/describe";
    
    var params = {
        "visualFeatures": "Object",
        "details": "",
        "language": "en",
    };
    //顯示分析的圖片
    var sourceImageUrl = document.getElementById("inputImage").value;
    document.querySelector("#sourceImage").src = sourceImageUrl;
    //送出分析
    return $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request header
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        // Request body
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    .done(function(data) {
        //顯示JSON內容
        $("#responseTextArea").val(JSON.stringify(data, null, 2));
        $("#picDescription").text();
        for (var x = 0; x < data.Object.length;x++){
            $("#picDescription").append(data.Object[x].text + "<br>");
        }
        // $("#picDescription").append("這裡有"+data.faces.length+"個人");
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        //丟出錯誤訊息
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
        alert(errorString);
    });
}

function extractNounsFromData(data) {
    var nouns = [];

    if (data && data.description && data.description.tags && data.description.tags.length > 0) {
        for (var i = 0; i < data.description.tags.length; i++) {
            var tag = data.description.tags[i];
            if (tag.indexOf(":") === -1) { // 排除標註中的冒號
                nouns.push(tag);
            }
        }
    }

    return nouns;
}

function searchExample(word) {
    var searchUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;

    $.get(searchUrl, function(response) {
        var meanings = [];

        if (Array.isArray(response) && response.length > 0) {
            var firstEntry = response[0];
            if (firstEntry.meanings && firstEntry.meanings.length > 0) {
                var firstMeaning = firstEntry.meanings[0];
                if (firstMeaning.definitions && firstMeaning.definitions.length > 0) {
                    var definition = firstMeaning.definitions[0].definition;
                    meanings.push(definition);
                }
            }
        }

        $("#exampleSentences").empty();
        $("#exampleSentences").append("<strong>" + "Word: "+ "</strong>" + word );
        meanings.forEach(function(meaning) {
            $("#exampleSentences").append( "<li>" + "Definition: " + meaning + "</li>");
        });
    });
}
