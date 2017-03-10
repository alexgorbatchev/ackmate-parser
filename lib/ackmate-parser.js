'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var length = void 0,
      stream = void 0;
  var filename = null;
  var tail = null;
  var surroundLine = /^(\d+):(.*)$/;
  var matchLine = /^(\d+);(\d+) (\d+):(.*)$/;
  var push = function push(data) {
    return stream.push(data);
  };

  function processLine(line) {
    var lineNumber = void 0,
        matches = void 0,
        value = void 0;

    if (line[0] === ':') {
      filename = line.slice(1);
      return push({ filename: filename });
    } else if (matches = line.match(surroundLine)) {
      lineNumber = matches[matches.length - 2];
      value = matches[matches.length - 1];
      return push({ filename: filename, lineNumber: lineNumber, value: value });
    } else if (matches = line.match(matchLine)) {
      var index = matches[matches.length - 3];
      lineNumber = matches[matches.length - 4];
      length = matches[matches.length - 2];
      value = matches[matches.length - 1];
      return push({ filename: filename, lineNumber: lineNumber, index: index, length: length, value: value });
    }
  }

  function transform(data, encoding, callback) {
    data = data.toString();

    if (tail != null) {
      data = tail + data;
    }

    var hasTail = data[data.length - 1] !== '\n';
    var lines = data.split('\n');

    tail = hasTail && lines.pop() || null;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Array.from(lines)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var line = _step.value;

        processLine(line);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return callback();
  }

  function flush(callback) {
    if (tail != null) {
      processLine(tail);
    }
    return callback();
  }

  return stream = _through2.default.obj(transform, flush);
};

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
//# sourceMappingURL=ackmate-parser.js.map
