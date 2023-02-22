const { dockStart } = require('@nlpjs/basic');
const fs = require('fs');

(async () => {
  const dock = await dockStart({
    settings: {
      nlp: {
        modelFileName: 'model.private.nlp',
        languages: ['en'],
      },
    },
    use: ['Basic'],
  });

  const nlp = dock.get('nlp');

  if (fs.existsSync('./model.private.nlp')) {
    try {
      nlp.load('./model.private.nlp');
    } catch (error) {
      console.error(error);
    }
  }

  // Adds the utterances and intents for the NLP
  nlp.addDocument('en', 'hello', 'greeting');
  nlp.addDocument('en', 'hi', 'greeting');
  nlp.addDocument('en', 'howdy', 'greeting');
  nlp.addDocument('en', 'hey', 'greeting');
  nlp.addDocument('en', 'grettings', 'greeting');
  nlp.addDocument('en', 'good morning', 'greeting');
  nlp.addDocument('en', 'good afternoon', 'greeting');
  nlp.addDocument('en', 'good night', 'greeting');
  nlp.addDocument('en', 'good evening', 'greeting');

  nlp.addDocument('en', 'goodbye', 'farewell');
  nlp.addDocument('en', 'goodbye for now', 'farewell');
  nlp.addDocument('en', 'bye bye take care', 'farewell');
  nlp.addDocument('en', 'okay see you later', 'farewell');
  nlp.addDocument('en', 'bye for now', 'farewell');
  nlp.addDocument('en', 'i must go', 'farewell');

  nlp.addDocument('en', 'sure', 'agreeing');
  nlp.addDocument('en', 'yes', 'agreeing');
  nlp.addDocument('en', 'okay', 'agreeing');
  nlp.addDocument('en', 'maybe', 'agreeing');

  nlp.addDocument('en', 'no', 'refusing');
  nlp.addDocument('en', 'nah', 'refusing');
  nlp.addDocument('en', 'nope', 'refusing');

  nlp.addDocument('en', 'show products', 'showProducts');
  nlp.addDocument('en', 'show product', 'showProducts');

  nlp.addDocument('en', 'I want to buy', 'addToCart');
  nlp.addDocument('en', 'I would like to buy', 'addToCart');
  nlp.addDocument('en', 'I want', 'addToCart');
  nlp.addDocument('en', 'Add the', 'addToCart');

  nlp.addDocument('en', 'checkout', 'checkout');
  nlp.addDocument('en', 'check out', 'checkout');

  // Adds the utterances and entities for the NER
  nlp.addNerRuleOptionTexts('en', 't-shirt', 'green', ['green']);
  nlp.addNerRuleOptionTexts('en', 't-shirt', 'red', ['red']);

  await nlp.train();
  await nlp.save('model.private.nlp');
})();
