require('dotenv').config({ path: require('os').homedir() + '/.env' });
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function renderQuizSentences(subtitles) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "Please give me 20 words and it's translation from the provided subtitles, along with sentences for practice in English and korean translations from the provided subtitles. For example, for each line, it should has {'word':$word,'korean':$tranlsated,'sentence':$example_sentence} in JSON",
      },
      { role: "user", content: subtitles },
    ],
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
  });
  return completion.choices[0].message.content;
}

module.exports = {
  renderQuizSentences : renderQuizSentences
}