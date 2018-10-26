#!/usr/bin/env node
const injectSsmParams = require('./inject-ssm-params');

const usageMsg = `\
Usage: aws-param-inject <String>

<String> can contain any number of patterns like \${ssm:/path/to/param},
which will be injected into the input string.

Example:

MY_TEXT="
Value=\${ssm:/my/path/to/param1}
OtherValue=\${ssm:/my/path/to/param2}
"
aws-param-inject "$MY_TEXT"`;

const readInput = () => {
  const input = process.argv[2];
  return input ? Promise.resolve(input) : Promise.reject(new Error(usageMsg));
};

readInput()
  .then(injectSsmParams)
  .then(console.log)
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
