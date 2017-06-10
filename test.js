
let thingy = function(config) {

  let util = new require(`./util.js`)({statusVerbosity: 0, seed: config.seed});

  let corpora = new require(`common-corpus`)(),
      corpFilter = new require('./corpfilter')(util),
      texts = corpFilter.reduceCorpora(corpora.texts, config.corporaFilter),
      lsys = require('./lsys'),
      walker = require('./textWalker'),
      source = texts.map(t => t.text()).join('\n'),
      chars = 5000,
      startPos = util.randomInRange(0, source.length - chars),
      // TODO: blob may start in the middle of a word - discard up to the first space?
      blob = (source.length <= chars ? source :  source.slice(startPos,startPos+chars)),
      tokens = blob.split(' '),
      ruleGen = new require('./rule.js')({util: util}),
      ruleBlob = ruleGen.generate(),
      seed = ruleBlob.start,
      rules = ruleBlob.rules;
  // TODO: make a bank of known working rulesets
  // seed = '--PNP',
  // rules = {"P":"P[++NTP]-P","T":"TT","+":"++"},
  // rules: {
  //   "start": "PP",
  //   "rules": {
  //     "P": "[PP][P]TNP"
  //   },
  //   "depth": 4
  // }
  // rules: {"start":"P","rules":{"P":"P+P[PN]T","T":"PP"}, depth: 5 }
  // rules: {"start":"+010010","rules":{"0":"010","1":"0[++0P]0","+":"++","-":"--P","P":"-1[P1]-"}, "depth":5}
  // TODO: unit-test the rule-gen?
  // because it would be nice to algorithmically clean-up the rules (make them better)
  // T*N => N
  // -+|+- => <nothing>

  let instructions = lsys.applyRecursive(rules, seed, ruleBlob.depth),
      output = walker.walkTokens(tokens, instructions);


  // console.log(`output: ${JSON.stringify(output)}`);

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

  console.log(`rules: ${JSON.stringify(ruleBlob,null,2)}\ninstructions: ${instructions}`);

};

let config = {},
    program = require(`commander`);

program
  .version(`0.0.2`)
  .option(`-c, --corporaFilter [string]`, `filename substring filter (non-case sensitive)`)
  .option(`-s --seed [string]`, `seed for random generator`)
  // .option(`-f --file [string]`, `external source file`)
  .parse(process.argv);

if (program.corporaFilter) {
  config.corporaFilter = program.corporaFilter;
}

if (program.seed) {
  config.seed = program.seed;
}

thingy(config);
