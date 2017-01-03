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
      var i, index, j, length, lineNumber, matches, value;
      if (line[0] === ':') {
        filename = line.slice(1);
        return push({
          filename: filename
        });
      } else if (matches = line.match(surroundLine)) {
        i = matches.length - 2, lineNumber = matches[i++], value = matches[i++];
        return push({
          filename: filename,
          lineNumber: lineNumber,
          value: value
        });
      } else if (matches = line.match(matchLine)) {
        j = matches.length - 4, lineNumber = matches[j++], index = matches[j++], length = matches[j++], value = matches[j++];
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
    var hasTail, i, len, line, lines;
    data = data.toString();
    if (tail != null) {
      data = tail + data;
    }
    hasTail = data[data.length - 1] !== '\n';
    lines = data.split('\n');
    tail = hasTail && lines.pop() || null;
    for (i = 0, len = lines.length; i < len; i++) {
      line = lines[i];
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
