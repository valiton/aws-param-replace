# AWS PARAM REPLACE

This is a simple tool inject AWS SSM Parameters into text.
If text contains pattern like this `${ssm:/my/path/to/param}`,
it will be replaced with the values of the parameter `/my/path/to/param`.

This can for example be used in a Deployment script when we want to fetch and
inject variables from the Parameter Store into an ECS Task definition.

It can generally be used for putting any paramter into a string. just keep
in mind that the parameter will be contained in your string in plain text
afterwards so make sure the string is only used in secure places.

## Use

You can use the tool on the command line or in a node script. For all the examples, make sure
yo have AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY_ID and AWS_REGION(AWS_DEFAULT_REGION) configured in one of the ways described here for [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html) or here for the node [AWS-SDK](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/configuring-the-jssdk.html).
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
npx -p @valiton/aws-param-replace aws-param-replace "$MY_TEXT"

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
