## What is it
A hack to compile JSX files and ES6 code in CodeKit using Babeljs.   
Codekit does not support compiling JSX files at the moment. But I really wished to use CodeKit with my React code. Hence this project. It tricks CodeKit into thinking it's compiling CoffeeScript files when actualy it's compiling JSX files.   
So we create fake .coffee files that are actually .jsx files and compile them using a fake CoffeeScript compiler that is actually the <a href="http://babeljs.io">Babel</a> compiler for jsx files.

##Installation
Clone this repo and run `npm install`

Open CodeKit, go to preferences > compilers > CoffeeScript , set it to use a custom compiler and choose the compiler to be `installationFolder/node_modules/codekit-jsx-hack/main.js`

Set CodeKit to stop checking CoffeeScript syntax  
Rename .jsx files to .coffee files so that CodeKit thinks they are CoffeeScript files

That's it - CodeKit should now compile your .coffee files (which are actually jsx files) using the Babel compiler.

## How it works
CodeKit lets you use a custom compiler for CoffeeScript code. We do our thing by creating a compiler that makes CodeKit think it's a CoffeeScript compiler while behind the scenes it's the Babel compiler compiling JSX code into .js files.

## Limitations   
Does not support mixing Javascript and JSX files.
Another drawback is that you have to rename your .jsx files to .coffee files to make CodeKit believe it is a CoffeeScript file.   
And obviously if you are a CoffeeScript programmer and need the default compiler for your CoffeeScript code then this is not for you.

##Quick way to rename all my jsx files to coffee files?
    npm install -g renamer

    renamer --insensitive --regex --find '\.jsx$' --replace '.coffee' '**/*.jsx' --dry-run
Recursively renames files in the current directory. This is a dry run. Check the output and if it's okay, remove the `--dry-run` parameter to actually rename the files.

### Renaming coffee files back to jsx:
    renamer --insensitive --regex --find '\.coffee$' --replace '.jsx' '**/*.coffee' --dry-run
Rename the `--dry-run` param when you are sure the output is correct.

## Run tests
    npm test