#!/usr/bin/env node

var babel = require('babel-core')
var fs = require('fs')
var argv = require('yargs').argv
var path = require('path')

var inFile = argv.compile
var outDir = argv.output || '.'
var map = argv.map
var outScripts
var outMap

//abort if inFile is not specified
if (inFile == null) {
    console.error('Error: no input file specified.')
    process.exit(0) //exiting with 0 to make this program work with CodeKit
}

//Read the merged script from CodeKit
var inScripts = " " + fs.readFileSync(inFile, {
        "encoding": "UTF-8"
    }) //space added to ensure first script below is always a JSX/ES6 script (for the edge case where the first script begins with a backtick)



if (map == true) {
    //combine all scripts and compile the result using Babel
    var scripts = inScripts.replace("`", ";")
    var result = babel.transform(scripts, {
        blacklist: ["strict"],
        sourceMaps: true,
        sourceFileName: path.basename(inFile),
        sourceMapTarget: path.basename(inFile,'.coffee')+'.js'

    })
    outScripts = result.code+"\n\n//# sourceMappingURL="+path.basename(inFile,'.coffee')+'.js.map\n'
    outMap = result.map
} else {
    //Only the .coffee scripts will be combined by Babel and plain JS scripts with the .js extension will be left alone.
    //Split the scripts by the backtick character (CodeKit encloses plain JS scripts within backticks)
    var scripts = inScripts.split('`')
    for (var i = 0; i < scripts.length; i++) {
        //odd-numbered scripts are plain JS scripts to be left alone; even-numbered scripts are JSX/ES6 scripts to be compiled by Babel (counting begins from 0)
        if (i % 2 == 0) {
            var result = babel.transform(scripts[i], {
                blacklist: ["strict"]
            })
            scripts[i] = result.code
        }
    }
    outScripts = scripts.join(';')
}



//write the compiled and merged script
var scriptPath = outDir + "/" + path.basename(inFile, '.coffee') + '.js'
fs.writeFile(scriptPath, outScripts, function(err) {
        if (err) {
            console.error("Error while trying to write compiled script:", err)
            process.exit(1)
        }
    })

//write the source map
if (map == true) {
    var mapPath = scriptPath + '.map'
    var finalMap={"version":outMap.version, "file":outMap.file, "sourceRoot": outMap.sourceRoot, "sources": outMap.sources, "names":[], "mappings":outMap.mappings  }
    fs.writeFile(mapPath, JSON.stringify(finalMap, null, 2), function(err) {
        if (err){
            console.error("Error while trying to write source map: ", err)
            process.exit(1)
        }
        
    })
}
