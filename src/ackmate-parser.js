import through2 from 'through2';

export default function () {
  let length, stream;
  let filename = null;
  let tail = null;
  const surroundLine = /^(\d+):(.*)$/;
  const matchLine = /^(\d+);(\d+) (\d+):(.*)$/;
  const push = data => stream.push(data);

  function processLine(line) {
    let lineNumber, matches, value;

    if (line[0] === ':') {
      filename = line.slice(1);
      return push({ filename });
    } else if (matches = line.match(surroundLine)) {
      lineNumber = matches[matches.length - 2];
      value = matches[matches.length - 1];
      return push({ filename, lineNumber, value });
    } else if (matches = line.match(matchLine)) {
      const index = matches[matches.length - 3];
      lineNumber = matches[matches.length - 4];
      length = matches[matches.length - 2];
      value = matches[matches.length - 1];
      return push({ filename, lineNumber, index, length, value });
    }
  }

  function transform(data, encoding, callback) {
    data = data.toString();

    if (tail != null) {
      data = tail + data;
    }

    let hasTail = data[data.length - 1] !== '\n';
    let lines = data.split('\n');

    tail = (hasTail && lines.pop()) || null;

    for (let line of Array.from(lines)) {
      processLine(line);
    }

    return callback();
  }

  function flush(callback) {
    if (tail != null) {
      processLine(tail);
    }
    return callback();
  }

  return stream = through2.obj(transform, flush);
};
