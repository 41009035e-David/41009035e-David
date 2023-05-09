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

async function extractKeywords(text){
  const analyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));
  const results = await analyticsClient.extractKeyPhrases([text], "zh-Hant");
  return results[0].keyPhrases;
}

async function MS_TextSentimentAnalysis(thisEvent){
    console.log("[MS_TextSentimentAnalysis] in");
    const analyticsClient = new TextAnalyticsClient(endpoint, new AzureKeyCredential(apiKey));
    let documents = [];
    documents.push(thisEvent.message.text);
    const results = await analyticsClient.analyzeSentiment(documents,"zh-Hant",{includeOpinionMining: true});
    console.log("[results] ", JSON.stringify(results));
    
    const sentiment = results[0].sentiment;
    const confidenceScores = results[0].confidenceScores;
    const comment = thisEvent.message.text.toLowerCase();
    const keywords = await extractKeywords(comment);
    //const mainSubject = keywords[0]; //取得主詞
    
    let improvementText = "";
    if (sentiment ==='negative') {
        if(keywords.length > 0){
          const mainSubject = keywords[0]; //取得主詞
          improvementText = `感謝您的評論，我們將努力針對${mainSubject}這部分進行改進，以提供更好的服務。`;
        } else {
          improvementText=`感謝您的回饋，我們會持續努力，歡迎下次光臨。`;
        }
    } else if (sentiment === 'positive'){
      if(keywords.length > 0){
          const mainSubject = keywords[0]; //取得主詞
          improvementText = `感謝您針對 ${mainSubject} 的評論，您的肯定是我們前進的動力。`; 
      } else {
        improvementText = `感謝您的肯定，我們會持續努力。`
      }
    } else {
      improvementText= `感謝您的評論，我們將持續努力提供優質的服務。`;
    }

    const confidenceText = `信心指數：
    (正面: ${confidenceScores.positive.toFixed(2)}, 負面: ${confidenceScores.negative.toFixed(2)},中性: ${confidenceScores.neutral.toFixed(2)})`;

    const echo = {
      type: 'text',
      text: improvementText
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