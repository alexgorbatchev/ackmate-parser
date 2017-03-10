import fs from 'fs';
import Stream from 'stream';
import { expect } from 'chai';
import ackmateParser from '../lib/ackmate-parser';

let getFixtureStream = function() {
  let fixture = fs.readFileSync(`${__dirname}/fixture.txt`, 'utf8');
  fixture = fixture.split('');

  let stream = new Stream();

  setTimeout(function() {
    let push;
    return push = function() {
      let slice = fixture.splice(0, Math.round(Math.random() * 25) + 5);

      if (slice.length) {
        stream.emit('data', slice.join(''));
        if (slice != null) { return setTimeout(push, 2); }
      } else {
        return stream.emit('end');
      }
    }();
  });

  return stream;
};

describe('ackmate-parser', () =>
  describe('::fromStream', function() {
    it('streams data', function(done) {
      let stream;
      getFixtureStream().pipe(stream = ackmateParser());
      let lines = [];

      stream.on('data', function({filename, lineNumber, index, length, value}) {
        if (length != null) { return lines.push(`${lineNumber}/${index}/${length}/${value}`); }
        if (value != null) { return lines.push(`${lineNumber}/${value}`); }
        return lines.push(`>${filename}`);
      });

      return stream.on('end', function() {
        let actual = lines.join('\n');
        expect(actual).to.eql(fs.readFileSync(`${__dirname}/expected.txt`, 'utf8'));
        return done();
      });
    });

    return it('emits error', function(done) {
      let stream;
      let inputStream = getFixtureStream().pipe(stream = ackmateParser());

      setTimeout(() => inputStream.emit('error', new Error('foo')));

      return stream.on('error', function(e) {
        expect(e).to.be.instanceOf(Error);
        return done();
      });
    });
  })
);
