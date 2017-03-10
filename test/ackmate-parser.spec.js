import fs from 'fs';
import Stream from 'stream';
import { expect } from 'chai';
import ackmateParser from '../src/ackmate-parser';

function getFixtureStream() {
  const stream = new Stream();
  const fixture = fs
    .readFileSync(`${__dirname}/fixture.txt`, 'utf8')
    .split('');

  setTimeout(function () {
    function push() {
      let slice = fixture.splice(0, Math.round(Math.random() * 25) + 5);

      if (slice.length) {
        stream.emit('data', slice.join(''));

        if (slice != null) {
          return setTimeout(push, 2);
        }
      } else {
        return stream.emit('end');
      }
    }

    push();
  });

  return stream;
}

describe('ackmate-parser', () =>
  describe('::fromStream', function () {
    it('streams data', function (done) {
      const stream = ackmateParser();
      const lines = [];

      getFixtureStream().pipe(stream);

      stream.on('data', function ({ filename, lineNumber, index, length, value }) {
        if (length != null) {
          return lines.push(`${lineNumber}/${index}/${length}/${value}`);
        }

        if (value != null) {
          return lines.push(`${lineNumber}/${value}`);
        }

        lines.push(`>${filename}`);
      });

      stream.on('end', function () {
        const actual = lines.join('\n');
        expect(actual).to.eql(fs.readFileSync(`${__dirname}/expected.txt`, 'utf8'));
        done();
      });
    });

    return it('emits error', function (done) {
      const stream = ackmateParser();
      const inputStream = getFixtureStream().pipe(stream);

      setTimeout(() => inputStream.emit('error', new Error('foo')));

      stream.on('error', function (e) {
        expect(e).to.be.instanceOf(Error);
        done();
      });
    });
  })
);
