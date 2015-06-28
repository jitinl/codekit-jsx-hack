## What is it
A hack to compile JSX files and ES6 code in CodeKit using the  <a href="http://babeljs.io">Babel</a> compiler.

Codekit does not support compiling JSX files at the moment. But I really wanted to use CodeKit with my React code. Hence this project - it tricks CodeKit into thinking it's compiling CoffeeScript files while it's actually compiling JSX files.  

Supports `@codekit-prepend` and `@codekit-append` for combining multiple JSX/ES6 and JS files.

## Installation
(you need to have node and npm installed)   
Create an installation folder and run   
`npm install codekit-jsx-hack`

Open CodeKit, go to preferences > compilers > CoffeeScript , set it to use a custom compiler and choose the compiler to be `yourInstallationFolder/node_modules/codekit-jsx-hack/main.js`

Set CodeKit to stop checking CoffeeScript syntax  
Rename .jsx files to .coffee files so that CodeKit thinks they are CoffeeScript files

That's it - CodeKit should now compile your .coffee files (which are actually jsx files) using the Babel compiler.   
`@codekit-prepend` and `@codekit-append` should also work as expected.

## How it works
CodeKit lets you use a custom compiler for CoffeeScript code. We do our thing by creating a compiler that makes CodeKit think it's a CoffeeScript compiler while behind the scenes it's the Babel compiler compiling JSX code into .js files.   
Essentially, we create fake .coffee files that are actually .jsx files and compile them using a fake CoffeeScript compiler that is actually the Babel compiler for jsx files.

## Limitations   
- You cannot use backticks in your code. This has to do with the way CodeKit merges Javascript and CoffeScript code. It encloses the plain JavaScript code within backticks so that the CoffeeScript compiler does not process it. We use it in a similar way.   
Backticks in .js files will be removed by CodeKit. But backticks in your (fake) .coffee files (for example in comments or if you are using the ES6 backtick operator) will cause issues.
- Another drawback is that you have to rename your .jsx files to .coffee files to make CodeKit believe it is a CoffeeScript file.   
- And obviously if you are a CoffeeScript programmer and need the default compiler for your CoffeeScript code then this is not for you.

#### Using all ES6 features
If you wish to take advantage of all ES6 features in your code - such as maps, you need to include the Babel browser-polyfill.js file. You can do this through a `<script>` tag or by prefixing it the CodeKit way. You need to include this file **before** the compiled code.   
Read more at <a href="http://babeljs.io/docs/usage/polyfill/">Babel docs</a>.

#### Quick way to rename all my jsx files to coffee files?
    npm install -g renamer

    renamer --insensitive --regex --find '\.jsx$' --replace '.coffee' '**/*.jsx' --dry-run
Recursively renames files in the current directory. This is a dry run. Check the output and if it seems okay, remove the `--dry-run` parameter to actually rename the files.

#### And renaming coffee files back to jsx:
    renamer --insensitive --regex --find '\.coffee$' --replace '.jsx' '**/*.coffee' --dry-run
Remove the `--dry-run` param when you are sure about the output.


## Run tests
    npm test