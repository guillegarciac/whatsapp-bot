const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

/* Create an instance of Client which gives us access to the whatsapp-web.js functionality */
const client = new Client();

/* Registering event handler functions for the qr and ready event and making sure that the WhatApp client is successfully initialized */
client.on('qr', (qr) => {
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();


/* Initializing a Configuration object and passing an object to the constructor containing the property apiKey. */
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


/* Passing on the message (after the # sign) to the runCompletion function and sending back the result we’re receiving from OpenAI */
client.on('message', message => {
  console.log(message.body);

  if(message.body.startsWith("#")) {
      runCompletion(message.body.substring(1)).then(result => message.reply(result));
  }
});

/* Implement an async runCompletion function */
async function runCompletion (message) {
  const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      max_tokens: 200,
  });
  return completion.data.choices[0].text;
}