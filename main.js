#!/usr/bin/env node

var babel = require('babel-core')
var fs = require('fs')
var argv = require('yargs').argv
var path = require('path')

var inFile = argv.compile
var outDir = argv.output || '.'

if (inFile == null) {
    console.error('Error: no input file specified.')
    process.exit(0) //exiting with 0 to make this program work with CodeKit
}

babel.transformFile(inFile, function(err, result) {
    if (err != null) {
        console.error("Error while trying to transform the file " + inFile + ":" + err)
        process.exit(1)
    }
    fs.writeFile(outDir + "/" + path.basename(inFile, '.coffee') + '.js', result.code, function(err) {
        if (err != null) {
            console.error("Error when trying to write the compiled output file:", err)
            process.exit(1)
        }
    })
})