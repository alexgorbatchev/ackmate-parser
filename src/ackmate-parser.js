import through2 from 'through2';

export default function() {
    let length, stream;
    let filename     = null;
    let tail         = null;
    let surroundLine = /^(\d+):(.*)$/;
    let matchLine    = /^(\d+);(\d+) (\d+):(.*)$/;

    let push = data => stream.push(data);

    let processLine = line => {
      let lineNumber, matches, value;
      if (line[0] === ':') {
        filename = line.slice(1);
        return push({filename});

      } else if (matches = line.match(surroundLine)) {
        lineNumber = matches[matches.length - 2], value = matches[matches.length - 1];
        return push({filename, lineNumber, value});

      } else if (matches = line.match(matchLine)) {
        let index;
        lineNumber = matches[matches.length - 4], index = matches[matches.length - 3], length = matches[matches.length - 2], value = matches[matches.length - 1];
        return push({filename, lineNumber, index, length, value});
      }
    };

    let transform = function(data, encoding, callback) {
      data    = data.toString();
      if (tail != null) { data    = tail + data; }
      let hasTail = data[data.length - 1] !== '\n';
      let lines   = data.split('\n');
      tail    = (hasTail && lines.pop()) || null;

      for (let line of Array.from(lines)) { processLine(line); }

      return callback();
    };

    let flush = function(callback) {
      if (tail != null) { processLine(tail); }
      return callback();
    };

    return stream = through2.obj(transform, flush);
  };
