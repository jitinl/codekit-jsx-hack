require('shelljs/global')
var fs = require("fs")
var expect = require('chai').expect;
var tempDir = tempdir() + 'tmpCodekitJsxHack/'

describe("Codekit JSX hack tests", function() {
    this.timeout(35000);
    it("should exit with code 0 when called without any arguments", function() {
        var output = exec('node main.js', {
            silent: true
        }).code
        expect(output).to.equal(0)
    })
    it("Should compile a JSX file with a .coffee extension to a .js file", function() {
        //cleanup temp directory
        rm('-rf', tempDir)
        mkdir('-p', tempDir)

        //write the test JSX script to the temp dir
        var script = "var jsxVariable=<div/>"
        script.to(tempDir + 'tmpscript.coffee')

        //Check that the script is processed successfuly
        var output = exec('node main.js --output ' + tempDir + ' --compile ' + tempDir + 'tmpscript.coffee', {
            silent: true
        }).code
        expect(output).to.be.equal(0)

        //check that the compiled file tmpscript.js exists
        var exists = ls(tempDir + 'tmpscript.js')
        expect(exists.length).to.be.equal(1)

        //check that the compiled file tmpscript.js is not empty
        var file = cat(tempDir + "tmpscript.js")
        expect(file.length).to.be.greaterThan(0)

        //cleanup temp dir
        rm('-rf', tempDir)
    })
    it("Should correctly compile a merged js-jsx file from CodeKit", function() {
        //cleanup temp directory
        rm('-rf', tempDir)
        mkdir('-p', tempDir)

        //write a test JS-(JSX/ES6) merged script to the temp dir - 1st and 3rd scripts are scripts using new ES6 features while 2nd and 4th are regular javascript
        //in practice, CodeKit will generate this script when merging Javascript and CoffeeScript files.
        var mergedScript = "[exports.x,,]=[1,2,4] `exports.v='hello'` let me='go'; exports.y=me`exports.w='bye'`"
        mergedScript.to(tempDir + 'tmpscript.coffee')

        //Check that the script is processed successfuly
        var output = exec('node main.js --output ' + tempDir + ' --compile ' + tempDir + 'tmpscript.coffee').code
        expect(output).to.be.equal(0)

        //check that the compiled file exists
        var exists = ls(tempDir + 'tmpscript.js')
        expect(exists.length).to.be.equal(1)

        //run the compiled file to see it does not throw any errors
        var testScript = require(tempDir + "tmpscript.js")
        expect(testScript.x).to.exist
        expect(testScript.y).to.exist
        expect(testScript.v).to.exist
        expect(testScript.w).to.exist

        //cleanup temp dir
        rm('-rf', tempDir)
    })
    it("Should generate source maps", function() {
        //cleanup temp directory
        rm('-rf', tempDir)
        mkdir('-p', tempDir)

        //Read the React.js file as a test script
        var script = fs.readFileSync("test/resources/react-0.13.3.js", {
            "encoding": "UTF-8"
        })
        script.to(tempDir + 'tmpscript.coffee')

        //Check that the script is processed successfuly
        var output=exec('node main.js --map --output ' + tempDir + ' --compile ' + tempDir + 'tmpscript.coffee').code
        expect(output).to.be.equal(0)

        //Check that the source map was created
		var file = cat(tempDir + "tmpscript.js.map")
        expect(file.length).to.be.greaterThan(10)

        //cleanup temp dir
        rm('-rf', tempDir)
    })
})
