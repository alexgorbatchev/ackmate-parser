through2 = require 'through2'

module.exports = ->
    filename     = null
    tail         = null
    surroundLine = /^(\d+):(.*)$/
    matchLine    = /^(\d+);(\d+) (\d+):(.*)$/

    push = (data) ->
      stream.push data

    processLine = (line) =>
      if line[0] is ':'
        filename = line[1..]
        push {filename}

      else if matches = line.match surroundLine
        [..., lineNumber, value] = matches
        push {filename, lineNumber, value}

      else if matches = line.match matchLine
        [..., lineNumber, index, length, value] = matches
        push {filename, lineNumber, index, length, value}

    transform = (data, encoding, callback) ->
      data    = data.toString()
      data    = tail + data if tail?
      hasTail = data[data.length - 1] isnt '\n'
      lines   = data.split '\n'
      tail    = hasTail and lines.pop() or null

      processLine line for line in lines

      callback()

    flush = (callback) ->
      processLine tail if tail?
      callback()

    stream = through2.obj transform, flush
