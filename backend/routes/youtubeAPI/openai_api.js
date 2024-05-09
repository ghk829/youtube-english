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
        content: "Please give me at most 6 words and it's translation from the provided subtitles, along with full sentences and korean translations from the provided subtitles by order. They should be in one full sentences without any duplication. For example, for each full sentence, it should has {'word':$word,'translated_word':$tranlsated,'sentence':$example_sentence,'translated_sentence':$translated_example_sentence} in JSON. please final result as list that contains 6 object. the result should look like {data : []}",
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