# ackmate-parser

[![GitTip](http://img.shields.io/gittip/alexgorbatchev.svg?style=flat)](https://www.gittip.com/alexgorbatchev/)
[![Dependency status](http://img.shields.io/david/alexgorbatchev/ackmate-parser.svg?style=flat)](https://david-dm.org/alexgorbatchev/ackmate-parser)
[![devDependency Status](http://img.shields.io/david/dev/alexgorbatchev/ackmate-parser.svg?style=flat)](https://david-dm.org/alexgorbatchev/ackmate-parser#info=devDependencies)
[![Build Status](http://img.shields.io/travis/alexgorbatchev/ackmate-parser.svg?style=flat&branch=master)](https://travis-ci.org/alexgorbatchev/ackmate-parser)

[![NPM](https://nodei.co/npm/ackmate-parser.svg?style=flat)](https://npmjs.org/package/ackmate-parser)

Streaming parser for the results produced by [The Silver Searcher](https://github.com/ggreer/the_silver_searcher) (aka `ag`) with the `--ackmate` flag.

## Installation

    npm install ackmate-parser

## Usage Example

```javascript
var ackmateParser = require('ackmate-parser');
var inputStream = getInputStream();
var stream = ackmateParser.fromStream(inputStream);

// whenever a new file in the stream is encountered
stream.on('file', function(data) {
  console.log(data.filename);
});

// if `ag` was called with `--before` or `--after`
stream.on('surround', function(data) {
  console.log(data.filename, data.lineNumber, data.value);
});

// for each match in the stream
stream.on('match', function(_arg) {
  console.log(data.filename, data.index, data.length, data.lineNumber, data.value);
});

stream.on('end', function() {
  ...
});
```

## Testing

    npm test

## License

The MIT License (MIT)

Copyright 2014 Alex Gorbatchev

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
