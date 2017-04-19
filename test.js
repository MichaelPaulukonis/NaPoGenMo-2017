// let util = new require(`./util.js`)({statusVerbosity: 0, seed: options.config.seed });
let util = new require(`./util.js`)({statusVerbosity: 0});

// TODO: make this a module, as well....
var reduceCorpora = function(texts) {
  var strategies = [ corporaSevenStrategy,
                     corporaSevenStrategy,
                     corporaFilterStrategy(`oz|apocalypsenow`),
                     corporaFilterStrategy(`finnegan|oz`),
                     corporaFilterStrategy(`oz|egypt`),
                     corporaFilterStrategy(`sms`),
                     corporaFilterStrategy(`shakespeare`),
                     corporaFilterStrategy(`cyberpunk`),
                     corporaFilterStrategy(`western`),
                     corporaFilterStrategy(`gertrudestein`),
                     corporaFilterStrategy(`computerculture`),
                     corporaFilterStrategy(`filmscripts`),
                     corporaFilterStrategy(`spam`),
                     corporaFilterStrategy(`spam.0`),
                     corporaFilterStrategy(`2001`),
                     corporaFilterStrategy(`odyssey`),
                     corporaFilterStrategy(`singing`),
                     corporaFilterStrategy(`egypt`),
                     corporaFilterStrategy(`manifesto`),
                     corporaFilterStrategy(`ascii|emoticon`),
                     corporaFilterStrategy(`marx`),
                     corporaFilterStrategy(`james.joyce`),
                     corporaFilterStrategy(`poetry`),
                     corporaFilterStrategy(`eliot`),
                     corporaFilterStrategy(`imagist`),
                     corporaFilterStrategy(`whitman`),
                     corporaFilterStrategy(`longfellow`),
                     corporaFilterStrategy(`moby`),
                     corporaFilterStrategy(`pride.and.prejudice`),
                     corporaFilterStrategy(`lowell`),
                     corporaFilterStrategy(`rome`),
                     corporaFilterStrategy(`sentences`)
                   ],
      strategy;

  // not a parameter in the function. hrm.....
  // if (config.corporaFilter) {
    // strategy = corporaFilterStrategy(config.corporaFilter);
  // } else {
    strategy = util.pick(strategies);
  // }

  return strategy(texts);
};

// Todo: get a generic one to take in a numeric parameter
var corporaSevenStrategy = function(corpus) {
  var newCorpus = [];

  for (var i = 0; i < 7; i++) {
    newCorpus.push(util.pickRemove(corpus));
  }

  return newCorpus;
};

// TODO: hrm. corpora now has a filter....
var corporaFilterStrategy = function(filter) {
  return function(corpus) {
    var r = new RegExp(filter, `i`);
    return corpus.filter(m => m.name.match(r) !== null);
  };
};


let corpora = new require(`common-corpus`)(),
    texts = reduceCorpora(corpora.texts),
    lsys = require('./lsys'),
    walker = require('./textWalker'),
    // source = 'APRIL is the cruellest month breeding Lilacs out of the dead land, mixing  Memory and desire, stirring Dull roots with spring rain. Winter kept us warm, covering Earth in forgetful snow, feeding A little life with dried tubers.',
    source = texts.map(t => t.text()).join('\n'),
    chars = 5000,
    startPos = util.randomInRange(0, source.length - chars),
    // TODO: blob may start in the middle of a word - discard up to the first space?
    blob = (source.length <= chars ? source :  source.slice(startPos,startPos+chars)),
    tokens = blob.split(' '),
    // TODO: look @ https://github.com/Objelisks/lsystembot/blob/master/generator.js
    // TODO: pass in seed to ruleGen
    // TODO: rules can go negative
    // in which case, we get a lot of 'undefined's in the output
    ruleGen = require('./rule.js'),
    ruleBlob = ruleGen(),
    seed = ruleBlob.start,
    rules = ruleBlob.rules;
    // seed = '--PNP',
    // rules = {"P":"P[++NTP]-P","T":"TT","+":"++"},
    // TODO: unit-test the rule-gen?
    // because it would be nice to algorithmically clean-up the rules (make them better)

var instructions = lsys.applyRecursive(rules, seed, ruleBlob.depth);
var output = walker.walkTokens(tokens, instructions);

console.log(`rules: ${JSON.stringify(ruleBlob,null,2)}\ninstructions: ${instructions}`);

console.log(`output: ${JSON.stringify(output)}`);

let text = output
      .map((token) => (token && token.match(/\t|\n/) ? token : token + ' '))
      .join('')
      .replace(/\t/g, '  ')
      .trim();


// output = output.join(" ")
//     .replace(/\t/g, '  ');
// .replace(/\n/g, "<br>") // eh, this is webifying it
// .replace(/\t/g, "&nbsp;&nbsp;&nbsp;");

console.log(text);
