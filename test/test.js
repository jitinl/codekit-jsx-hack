require('shelljs/global')
var fs=require("fs")
var expect=require('chai').expect;

describe("Codekit JSX hack tests",function(){
	this.timeout(5000);
	it("should exit with code 0 when called without any arguments",function(){
		var output=exec('node main.js',{silent:true}).code
		expect(output).to.equal(0)
	})
	it("Should compile a JSX file with a .coffee extension to a .js file",function(){
		var tempDir=tempdir()+'tmpCodekitJsxHack/'

		//cleanup temp directory
		rm('-rf',tempDir)
		mkdir('-p',tempDir)

		//write the test JSX script to the temp dir
		var script="var jsxVariable=<div/>"
		script.to(tempDir+'tmpscript.coffee')

		//check that exit code==0 on executing script on test file
		var output=exec('node main.js --output '+tempDir+' --compile '+tempDir+'tmpscript.coffee', {silent:true}).code
		expect(output).to.equal(0)

		//check that the compiled file tmpscript.js exists
		var exists=ls(tempDir+'tmpscript.js')
		expect(exists.length).to.be.equal(1)

		//check that the compiled file tmpscript.js is not empty
		var file=cat(tempDir+"tmpscript.js")
		expect(file.length).to.be.greaterThan(0)

		//cleanup temp dir
		rm('-rf',tempDir) 
	})
	it("Should correctly compile a merged js-jsx file from CodeKit",function(){
		var tempDir=tempdir()+'tmpCodekitJsxHack/'

		//cleanup temp directory
		rm('-rf',tempDir)
		mkdir('-p',tempDir)

		//write a test JS-(JSX/ES6) merged script to the temp dir - 1st and 3rd scripts are scripts using new ES6 features while 2nd and 4th are regular javascript
		var mergedScript="[exports.x,,]=[1,2,4] `exports.v='hello'` let me='go'; exports.y=me`exports.w='bye'`"

		var script=mergedScript
		script.to(tempDir+'tmpscript.coffee')

		//check that exit code==0 on executing script on test file
		var output=exec('node main.js --output '+tempDir+' --compile '+tempDir+'tmpscript.coffee').code
		expect(output).to.equal(0)

		//check that the compiled file exists
		var exists=ls(tempDir+'tmpscript.js')
		expect(exists.length).to.be.equal(1)

		//run the compiled file to see it does not throw any errors
		var testScript=require(tempDir+"tmpscript.js")
		expect(testScript.x).to.exist
		expect(testScript.y).to.exist
		expect(testScript.v).to.exist
		expect(testScript.w).to.exist

		//cleanup temp dir
		rm('-rf',tempDir)
	})
})