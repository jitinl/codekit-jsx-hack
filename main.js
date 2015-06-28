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


var inScripts=" "+fs.readFileSync(inFile,{"encoding":"UTF-8"}) //space added to ensure first script below is always a JSX/ES6 script (for the edge case where the first script begins with a backtick)
var scripts=inScripts.split('`')
//odd scripts are plain JS scripts and even scripts are JSX/ES6 scripts to be compiled by Babel (counting begins from 0)
for (var i=0;i<scripts.length;i++){
    if(i%2==0){
        var result=babel.transform(scripts[i],{blacklist:["strict"]})
        scripts[i]=result.code
    }
}

var outScripts=scripts.join(';')
var scriptPath=outDir + "/" + path.basename(inFile, '.coffee') + '.js'
fs.writeFileSync(scriptPath,outScripts)

/*
babel.transformFile(inFile,{ blacklist: ["strict"] }, function(err, result) {
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
})*/