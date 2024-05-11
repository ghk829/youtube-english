import * as deepl from 'deepl-node';
const translators = require("express").Router();

const authKey =process.env.DEEPL_API;
const translator = new deepl.Translator(authKey);

translators.post("/translator", async function(req, res, next){
    console.log("번역 중 ...")
    const result = await translator.translateText(req.body.subtitle, 'en', 'ko');
    res.send(result.text)
})

module.exports = translators;