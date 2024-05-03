require('dotenv').config({ path: require('os').homedir() + '/.env' });
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "test"
});

async function renderQuizChoices(quizJson) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "Below is my English learning voca and example sentence. I want to make a blank-fill quiz that a user select the word from 4 choices. Could you generate the quizs? and please generate each quiz into JSON. {'answer':$word, 'sentence' : $sentence, 'choices' : $choices}. But in $sentence, the answer should be blank   the result should look like {data : []}",
      },
      { role: "user", content: quizJson },
    ],
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
  });
  return completion.choices[0].message.content;
}

const subtitles = [
    {
        "word": "geometric",
        "translated_word": "기하학적",
        "sentence": "both are examples of geometric brownie",
        "translated_sentence": "모두 기하학적 브라우니의 예시입니다"
    },
    {
        "word": "brownie",
        "translated_word": "브라우니",
        "sentence": "both are examples of geometric brownie",
        "translated_sentence": "모두 기하학적 브라우니의 예시입니다"
    },
    {
        "word": "motion",
        "translated_word": "운동",
        "sentence": "in motion that means if you take the log",
        "translated_sentence": "운동 중이라는 것은 로그를 취하는 경우를 의미합니다"
    },
    {
        "word": "fluctuations",
        "translated_word": "변동",
        "sentence": "remove the linear Trend the fluctuations are random",
        "translated_sentence": "선형 트렌드를 제거하면 변동이 무작위입니다"
    },
    {
        "word": "random",
        "translated_word": "랜덤",
        "sentence": "fluctuations are random it's like flipping a coin each step",
        "translated_sentence": "변동은 무작위이며 각 단계에서 동전을 뒤집는 것과 같습니다"
    },
    {
        "word": "coin",
        "translated_word": "동전",
        "sentence": "it's like flipping a coin each step if the coin is",
        "translated_sentence": "각 단계에서 동전을 뒤집는 것과 같습니다 만약 동전이"
    },
    {
        "word": "heads",
        "translated_word": "앞면",
        "sentence": "heads the line goes up Tails it goes down",
        "translated_sentence": "앞면이 나오면 선이 올라가고 꼬리면 내려갑니다"
    },
    {
        "word": "Tails",
        "translated_word": "꼬리",
        "sentence": "heads the line goes up Tails it goes down",
        "translated_sentence": "앞면이 나오면 선이 올라가고 꼬리면 내려갑니다"
    },
    {
        "word": "Trends",
        "translated_word": "추세",
        "sentence": "3x+ 1 is just like the random Wiggles of the stock market",
        "translated_sentence": "3x + 1은 주식 시장의 랜덤한 흔들림과 같습니다"
    },
    {
        "word": "market",
        "translated_word": "시장",
        "sentence": "3x+ 1 is just like the random Wiggles of the stock market",
        "translated_sentence": "3x + 1은 주식 시장의 랜덤한 흔들림과 같습니다"
    },
    {
        "word": "analyze",
        "translated_word": "분석",
        "sentence": "another way to analyze 3x + 1",
        "translated_sentence": "3x + 1을 분석하는 또 다른 방법은"
    },
    {
        "word": "leading",
        "translated_word": "선두의",
        "sentence": "looking at the leading digit of each number",
        "translated_sentence": "각 숫자의 선두 자리수를 살펴 보는 것"
    },
    {
        "word": "digit",
        "translated_word": "숫자",
        "sentence": "looking at the leading digit of each number",
        "translated_sentence": "각 숫자의 선두 자리수를 살펴 보는 것"
    },
    {
        "word": "sequence",
        "translated_word": "순서",
        "sentence": "in a sequence",
        "translated_sentence": "순서대로"
    }
]


module.exports = {
    renderQuizChoices : renderQuizChoices
  }

//renderQuizChoices(subtitles).then(console.log).catch(console.error);
