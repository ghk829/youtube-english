const generateQuiz = async () => {

    if (translations.length > 0) {
      try {
        console.log("번역 JSON parse중")
        setTranslatedJson(JSON.parse(translations).data);
      } catch (error) {
        console.error('번역 생성 중 오류:', error);
      } finally {
      }
    }
  };
  useEffect(() => {
    generateQuiz();
  }, [translations]);


  
  useEffect(() => {
    const findTranslation = (script, translatedJson) => {
      if(script)
      {
        const usedTranslations = new Set();

        const toUniqueWords = (sentence) => {
        return [...new Set(sentence.split(/\s+/))];
      };

      const originalWords = toUniqueWords(script.text);

      for (let t of translatedJson) {
        
      if (usedTranslations.has(t.sentence)) {
        continue;
      }
        const translatedWords = toUniqueWords(t.sentence);
        const commonWordsCount = originalWords.filter(word => translatedWords.includes(word)).length;

        if (commonWordsCount >= 5) {
          usedTranslations.add(t.sentence);

          return t;
        }
      }
}
      return null;
    };

    const mergeScriptsAndTranslations = () => {
      console.log(" 자막 내역")
      console.log(scripts)

      console.log(" json 내역")
      console.log(translatedJson)

      if(scripts){
      const merged = scripts.map(script => {
        const translation = findTranslation(script, translatedJson);
        return {
          ...script,
          translatedText: translation ? translation.translated_sentence : "없음"
        };
      });
      let newMerged = [];
      let previous = null;

      for (let i = 0; i < merged.length; i++) {
        if (i !== merged.length - 1) {
          if (merged[i].translatedText === "없음" || merged[i].translatedText === merged[i + 1].translatedText) {
            previous = {
              ...merged[i],
              text: previous ? previous.text + " " + merged[i].text : merged[i].text + " " + merged[i + 1].text,
              translatedText: merged[i + 1].translatedText,
              start: previous ? previous.start : merged[i].start
            };
          } else {
            if (previous) {
              newMerged.push(previous);
              previous = null;
            } else {
              newMerged.push(merged[i]);
            }
          }
        } else {
          if (previous) {
            newMerged.push({
              ...previous,
              text: previous.text + " " + merged[i].text
            });
          } else {
            newMerged.push(merged[i]);
          }
        }
      }

      console.log(" translated script")
      console.log(newMerged)
      
      setTranslatedScripts(newMerged);
      translatedScriptsRef.current=newMerged;
    }
    };


    if (scripts && translatedJson.length>0) {
      setIsLoading(true);
      mergeScriptsAndTranslations();
      console.log("번역 패치 완료")
      console.log(translatedScriptsRef.current)

      if ( translatedScriptsRef.current.length > 1) {
        setIsLoading(false);
      }
    }
  }, [scripts, translatedJson]);