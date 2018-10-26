# AWS PARAM REPLACE

This is a simple tool to replace this patter `${ssm:/my/path/to/param}` with the
value of `/my/path/to/param` in the AWS Parameter store.

This can for example be used in a Deployment script when we want to fetch and
inject variables from the Parameter Store into an ECS Task definition.

It can generally be used for putting any paramter into a string. just keep
in mind that the parameter will be contained in your string in plain text
afterwards so make sure the string is only used in secure places.

## Use

You can use the tool on the command line or in a node script.
**Note: Make sure to escape dollow signs properly if using doubly quoted shell strings
or ES6 template strings ($ -> \\$)**

### CLI

Assume your parameter on AWS SSM look like this:
- /my/path/to/param1=Hello
- /my/path/to/param2=World

```sh
# Make sure to escape the dollar sign in the string in shell script
MY_TEXT="
Value=\${ssm:/my/path/to/param1}
OtherValue=\${ssm:/my/path/to/param2}
"
npx aws-param-replace "$MY_TEXT"

# Outputs:
#
# Value=Hello
# OtherValue=World
```

**For everyone with NPM version lower than 5.7**

Since `npm ci` will not be available install the package globally first
```sh
npm i -g aws-param-replace
# then run it
aws-param-replace "..."
```

### Node API

```js
const replaceSsmParams = require('aws-param-replace');

// Make sure to escape the dollar sign in the template string
const input = `
Value=\${ssm:/my/path/to/param1}
OtherValue=\${ssm:/my/path/to/param2}
`

replaceSsmParams(input)
```

## Requirements

Node 8+

## Credits

Made my [Valiton](https://www.valiton.com/).
