var through2;

through2 = require('through2');

module.exports = function() {
  var filename, flush, matchLine, processLine, push, stream, surroundLine, tail, transform;
  filename = null;
  tail = null;
  surroundLine = /^(\d+):(.*)$/;
  matchLine = /^(\d+);(\d+) (\d+):(.*)$/;
  push = function(data) {
    return stream.push(data);
  };
  processLine = (function(_this) {
    return function(line) {
      var index, length, lineNumber, matches, value, _i, _j;
      if (line[0] === ':') {
        filename = line.slice(1);
        return push({
          filename: filename
        });
      } else if (matches = line.match(surroundLine)) {
        _i = matches.length - 2, lineNumber = matches[_i++], value = matches[_i++];
        return push({
          filename: filename,
          lineNumber: lineNumber,
          value: value
        });
      } else if (matches = line.match(matchLine)) {
        _j = matches.length - 4, lineNumber = matches[_j++], index = matches[_j++], length = matches[_j++], value = matches[_j++];
        return push({
          filename: filename,
          lineNumber: lineNumber,
          index: index,
          length: length,
          value: value
        });
      }
    };
  })(this);
  transform = function(data, encoding, callback) {
    var hasTail, line, lines, _i, _len;
    data = data.toString();
    if (tail != null) {
      data = tail + data;
    }
    hasTail = data[data.length - 1] !== '\n';
    lines = data.split('\n');
    tail = hasTail && lines.pop() || null;
    for (_i = 0, _len = lines.length; _i < _len; _i++) {
      line = lines[_i];
      processLine(line);
    }
    return callback();
  };
  flush = function(callback) {
    if (tail != null) {
      processLine(tail);
    }
    return callback();
  };
  return stream = through2.obj(transform, flush);
};
