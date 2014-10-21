through2 = require 'through2'

module.exports =
  fromStream: (inputStream) ->
    filename = null
    tail = null
    surroundLine = /^(\d+):(.*)$/
    matchLine = /^(\d+);(\d+) (\d+):(.*)$/

    processLine = (line) ->
      if line[0] is ':'
        filename = line[1..]
        stream.emit 'file', {filename}

      else if matches = line.match surroundLine
        [..., lineNumber, value] = matches
        stream.emit 'surround', {filename, lineNumber, value}

      else if matches = line.match matchLine
        [..., lineNumber, index, length, value] = matches
        stream.emit 'match', {filename, lineNumber, index, length, value}

    inputStream.on 'data', (data) ->
      data    = data.toString()
      data    = tail + data if tail?
      hasTail = data[data.length - 1] isnt '\n'
      lines   = data.split '\n'
      tail    = hasTail and lines.pop() or null

      processLine line for line in lines

    inputStream.on 'end', ->
      processLine tail if tail?
      stream.emit 'end'

    inputStream.on 'error', (err) ->
      stream.emit 'error', err

    stream = through2.obj()
