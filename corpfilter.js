`use strict`;

let CorporaFilter = function(util) {

  if(!(this instanceof CorporaFilter)) {
    return new CorporaFilter(util);
  }

  // Todo: get a generic one to take in a numeric parameter
  var corporaSevenStrategy = function(corpus) {
    var newCorpus = [];

    for (var i = 0; i < 7; i++) {
      newCorpus.push(util.pickRemove(corpus));
    }

    return newCorpus;
  };

  // TODO: hrm. corpora now has a filter....
  /// BUT we are passing in the corpora.texts array not the corpora object. hrm.
  var corporaFilterStrategy = function(filter) {
    return function(corpus) {
      var r = new RegExp(filter, `i`);
      return corpus.filter(m => m.name.match(r) !== null);
    };
  };

  this.reduceCorpora = function(texts, filter) {
    let strategies = [ corporaSevenStrategy,
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

    if (filter) {
      strategy = corporaFilterStrategy(filter);
    } else {
      strategy = util.pick(strategies);
    }

    return strategy(texts);
  };

};

module.exports = CorporaFilter;
