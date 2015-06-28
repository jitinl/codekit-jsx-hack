require('shelljs/global')
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

		//check that exit code==0
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
})