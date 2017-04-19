// from https://github.com/aparrish/linear-lsystem-poetry
// modified slightly
'use strict';

// TODO: I don't think underscore is really required anymore for that _.each....
var _ = require('underscore');
var lsys = require('./lsys');

function wrapped(list, index) {
  index = index >= 0 ? index : list.length - index; // trap for negative indexes
  return list[index % list.length];
}

function walkTokens(tokens, instructions) {
    var pos = 0;
    var output = [];
    var stack = [];
    _.each(instructions.split(''), function(ch) {
        switch (ch) {
            case 'P':
                output.push(wrapped(tokens, pos));
                pos++;
                break;
            case '+':
                pos++;
                break;
            case '-':
                pos--;
                break;
            case 'N':
                output.push('\n');
                break;
            case 'T':
                output.push('\t');
                break;
            case '[':
                stack.push(pos);
                break;
            case ']':
                pos = stack.pop();
                break;
        }
    });
    return output;
}

module.exports = {
    walkTokens: walkTokens
};
