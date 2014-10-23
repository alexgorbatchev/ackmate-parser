fs = require 'fs'
Stream = require 'stream'
{expect} = require 'chai'
ackmateParser = require '../lib/ackmate-parser'

getFixtureStream = ->
  fixture = fs.readFileSync "#{__dirname}/fixture.txt", 'utf8'
  fixture = fixture.split ''

  stream = new Stream()

  setTimeout ->
    do push = ->
      slice = fixture.splice 0, Math.round(Math.random() * 25) + 5

      if slice.length
        stream.emit 'data', slice.join ''
        setTimeout push, 2 if slice?
      else
        stream.emit 'end'

  stream

describe 'ackmate-parser', ->
  describe '::fromStream', ->
    it 'streams data', (done) ->
      getFixtureStream().pipe stream = ackmateParser()
      lines = []

      stream.on 'data', ({filename, lineNumber, index, length, value}) ->
        return lines.push "#{lineNumber}/#{index}/#{length}/#{value}" if length?
        return lines.push "#{lineNumber}/#{value}" if value?
        lines.push ">#{filename}"

      stream.on 'end', ->
        actual = lines.join '\n'
        expect(actual).to.eql fs.readFileSync "#{__dirname}/expected.txt", 'utf8'
        done()

    it 'emits error', (done) ->
      inputStream = getFixtureStream().pipe stream = ackmateParser()

      setTimeout ->
        inputStream.emit 'error', new Error 'foo'

      stream.on 'error', (e) ->
        expect(e).to.be.instanceOf Error
        done()
