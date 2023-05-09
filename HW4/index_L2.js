'use strict';
const line = require('@line/bot-sdk'),
      express = require('express'),
      configGet = require('config');
const {TextAnalyticsClient, AzureKeyCredential} = require("@azure/ai-text-analytics");

//Line config
const configLine = {
  channelAccessToken:configGet.get("CHANNEL_ACCESS_TOKEN"),
  channelSecret:configGet.get("CHANNEL_SECRET")
};

//Azure Text Sentiment
const endpoint = configGet.get("ENDPOINT");
const apiKey = configGet.get("TEXT_ANALYTICS_API_KEY");

const client = new line.Client(configLine);
const app = express();

const port = process.env.PORT || process.env.port || 3001;

app.listen(port, ()=>{
  console.log(`listening on ${port}`);
   
});

async function MS_TextSentimentAnalysis(thisEvent){
    console.log("[MS_TextSentimentAnalysis] in");
    const analyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));
    let documents = [];
    documents.push(thisEvent.message.text);
    const results = await analyticsClient.analyzeSentiment(documents,"zh-Hant",{includeOpinionMining: true});
    console.log("[results] ", JSON.stringify(results));
    
    const sentiment = results[0].sentiment;
    const confidenceScores = results[0].confidenceScores;
    
    let replyText = "";
    if (sentiment === "positive") {
      replyText = "正面訊息";
    } else if (sentiment === "negative") {
      replyText = "負面訊息";
    } else {
      replyText = "中性訊息";
    }

    const confidenceText = `信心指數：
    (正面: ${confidenceScores.positive.toFixed(2)}, 負面: ${confidenceScores.negative.toFixed(2)},中性: ${confidenceScores.neutral.toFixed(2)})`;

    const echo = {
      type: 'text',
      text: `${replyText}\n${confidenceText}`
    };

    return client.replyMessage(thisEvent.replyToken, echo);


}

app.post('/callback', line.middleware(configLine),(req, res)=>{
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result)=>res.json(result))
    .catch((err)=>{
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event){
  if(event.type !== 'message' || event.message.type !== 'text'){
    return Promise.resolve(null);
  }

  MS_TextSentimentAnalysis(event)
    .catch((err) => {
      console.error("Error:", err);
    }); 
}