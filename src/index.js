#!/usr/bin/env node
const replaceSsmParams = require('./replace-ssm-params');

const input = process.argv[2];

if (!input) {
  const usageMsg = `
Usage: aws-param-replace <String>

<String> can contain any number of patterns like \${ssm:/path/to/param},
which will be replaced into the input string.

Example:

MY_TEXT="
Value=\${ssm:/my/path/to/param1}
OtherValue=\${ssm:/my/path/to/param2}
"
aws-param-replace "$MY_TEXT"
`;
  console.info(usageMsg);
  process.exit(1);
}

replaceSsmParams(input)
  .then(console.log)
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
