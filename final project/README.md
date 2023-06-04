# **111-2 臺師大教育大數據微學程-特教地圖建置**
### 組員：特教114 戴瑋彩 生科115 廖子萱
### 指導老師：Pecu老師 Ryan老師

#### 簡報
### 成品呈現：
#### 介面顯示：
![介面顯示](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/10.%E4%BB%8B%E9%9D%A2%E9%A1%AF%E7%A4%BA.png "介面顯示")
#### 步驟1：於搜尋欄中輸入地點。
![搜尋畫面](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/11.%E6%90%9C%E5%B0%8B%E7%95%AB%E9%9D%A2.png "搜尋畫面")
#### 步驟2：點選搜尋結果。
![點選](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/12.%E9%BB%9E%E9%81%B8%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C.png "點選")
#### 步驟3：地點點選。
![點選2](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/13.%E9%BB%9E%E9%81%B8%E5%9C%96%E7%A4%BA.png "點選2")
#### 步驟4：點選特殊學校按鈕，顯示特定標記點之位置。
![特殊學校](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/15%E9%BB%9E%E7%89%B9%E6%AE%8A%E5%AD%B8%E6%A0%A1%E4%B9%8B%E6%8C%89%E9%88%95.png "特殊學校")
#### 步驟5：調整半徑，了解與學校之距離。
![調整半徑顯示資訊](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/14.%E8%AA%BF%E6%95%B4%E5%8D%8A%E5%BE%91%E9%A1%AF%E7%A4%BA%E8%B3%87%E8%A8%8A.png "調整半徑顯示資訊")

### 專題程式碼：
 * [專題-GetMap.js](https://github.com/41009035e-David/LAT/blob/main/final%20project/GetMap.js)
 * [專題-MapSearch.html](https://github.com/41009035e-David/LAT/blob/main/final%20project/MapSearch.html)

### 專題程式碼說明：
#### html檔-1：加入所需使用的三個現有的函式庫，分別為瀏覽器顯示、地圖磚抓取與空間模組。
![加入所需使用的三個套件](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/1.%E5%8A%A0%E5%85%A5%E6%89%80%E9%9C%80%E8%A6%81%E4%BD%BF%E7%94%A8%E7%9A%84%E4%B8%89%E5%80%8B%E5%A5%97%E4%BB%B6.png "加入所需使用的三個套件")
#### html檔-2：加入現有函式庫以外的自訂化功能GetMap.js。
![地圖功能手動加入](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/2.%E5%9C%B0%E5%9C%96%E5%8A%9F%E8%83%BD%E6%89%8B%E5%8B%95%E5%8A%A0%E5%85%A5.png "地圖功能手動加入")
#### html檔-3：呼叫自訂化功能GetMap.js。
![呼叫自訂化功能](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/3.%E5%91%BC%E5%8F%AB%E5%89%9B%E5%89%9B%E5%AF%AB%E7%9A%84%E5%9C%B0%E5%9C%96%E5%8A%9F%E8%83%BD.png "呼叫自訂化功能")
#### html檔-4：地圖自訂化加入的功能：地圖顯示、搜尋服務、圓形半徑調整以及特定地點顯示。
![自訂化](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/4.%E5%9C%B0%E5%9C%96%E5%8A%9F%E8%83%BD%E4%B8%AD%E6%9C%89%E5%8C%85%E5%90%AB%E7%9A%84%E5%8A%9F%E8%83%BD.png "自訂化")
#### js檔-1：GetMap功能進行設定
![GetMap功能設定](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/5.%20js%E6%AA%94%E4%B8%ADgetMap%E7%9A%84%E5%8A%9F%E8%83%BD%E8%A8%AD%E5%AE%9A.png "GetMap功能設定")
#### js檔-2：在兩層上，滑鼠點擊建設定。
![Layer](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/6.%E5%8A%A0%E5%85%A5%E4%BA%92%E5%8B%95%E5%8A%9F%E8%83%BD.png "Layer")
#### js檔-3：新增特定資料-特殊學校。
![Layer](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/7.%E5%8A%A0%E5%85%A5%E7%89%B9%E5%AE%9A%E8%B3%87%E6%96%99%E5%91%88%E7%8F%BE.png "Layer")
#### js檔-4：彈出視窗功能設定。
![彈出視窗](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/8.%E5%9C%96%E5%B1%A4%E5%BD%88%E5%87%BA%E8%A6%96%E7%AA%97%E8%A8%AD%E5%AE%9A-1.png "彈出視窗")
![彈出視窗2](https://github.com/41009035e-David/LAT/blob/main/final%20project/images/9.%E5%9C%96%E5%B1%A4%E5%BD%88%E5%87%BA%E8%A6%96%E7%AA%97-2.png "彈出視窗2")
