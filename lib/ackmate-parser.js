var through2;

through2 = require('through2');

module.exports = {
  fromStream: function(inputStream) {
    var filename, matchLine, processLine, stream, surroundLine, tail;
    filename = null;
    tail = null;
    surroundLine = /^(\d+):(.*)$/;
    matchLine = /^(\d+);(\d+) (\d+):(.*)$/;
    processLine = function(line) {
      var index, length, lineNumber, matches, value, _i, _j;
      if (line[0] === ':') {
        filename = line.slice(1);
        return stream.emit('file', {
          filename: filename
        });
      } else if (matches = line.match(surroundLine)) {
        _i = matches.length - 2, lineNumber = matches[_i++], value = matches[_i++];
        return stream.emit('surround', {
          filename: filename,
          lineNumber: lineNumber,
          value: value
        });
      } else if (matches = line.match(matchLine)) {
        _j = matches.length - 4, lineNumber = matches[_j++], index = matches[_j++], length = matches[_j++], value = matches[_j++];
        return stream.emit('match', {
          filename: filename,
          lineNumber: lineNumber,
          index: index,
          length: length,
          value: value
        });
      }
    };
    inputStream.on('data', function(data) {
      var hasTail, line, lines, _i, _len, _results;
      data = data.toString();
      if (tail != null) {
        data = tail + data;
      }
      hasTail = data[data.length - 1] !== '\n';
      lines = data.split('\n');
      tail = hasTail && lines.pop() || null;
      _results = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        _results.push(processLine(line));
      }
      return _results;
    });
    inputStream.on('end', function() {
      if (tail != null) {
        processLine(tail);
      }
      return stream.emit('end');
    });
    inputStream.on('error', function(err) {
      return stream.emit('error', err);
    });
    return stream = through2.obj();
  }
};
