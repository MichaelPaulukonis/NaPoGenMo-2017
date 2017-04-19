// based on code from https://github.com/Objelisks/lsystembot/blob/master/generator.js

let RuleGen = function(config) {
  if (!(this instanceof RuleGen)) {
    return new RuleGen(config);
  }

  // TODO: redo this
  let util = config.util;

  // let util = new require(`./util.js`)({statusVerbosity: 0});

  function chooseRandom(arr) {
    return util.pick(arr);
  }

  function genRandomString(min, max, charSet) {
    let length = util.randomInRange(min, max),
        str = '';

    for(var i = 0; i < length; i++) {
      var char = chooseRandom(charSet);
      if(char === ']') {
        var insertIndex = util.random(str.length-1);
        str = str.substring(0, insertIndex) + '[' + str.substring(insertIndex);
      }
      str += char;
    }
    return str;
  }

  this.generate = function() {
    var system = {};
    var killOrder = ['a', 'iter'];
    var charSet = ['P'];
    var alphabet = 'PNT+-'.split('');
    var controlCharSet = ['N', 'T', '+', '-', ']'];
    var i, index;

    var extraSymbols = util.randomInRange(1,5);
    for(i = 0; i < extraSymbols; i++) {
      index = util.random(alphabet.length-1);
      charSet.push(alphabet.splice(index, 1)[0]);
    }

    system.start = genRandomString(1, 5, charSet);

    system.rules = {};
    charSet.forEach(function(char) {
      var ruleStr = genRandomString(0, 10, charSet.concat(controlCharSet));
      if(ruleStr.length > 0) {
        system.rules[char] = ruleStr;
      }
    });

    system.depth = util.randomInRange(1,5);
    system.seed = util.seed;

    return system;

  };
};

module.exports = RuleGen;
