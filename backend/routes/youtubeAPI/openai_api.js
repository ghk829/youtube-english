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
        content: "Please give me 7 different words and it's translation from the provided subtitles, along with different sentences and korean translations. For example, it should has {'word':$word,'translated_word':$tranlsated,'sentence':$example_sentence,'translated_sentence':$translated_example_sentence} in JSON. please final result as list that contains 7 object. the result should look like {data : []}",
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