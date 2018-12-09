# diff-js-xml
Project to compare xml or json objects very useful for A-B testing

## Installation
```
$ npm install diff-js-xml --save
```

### Usage for comparing JSON
```
var tool = require('diff-js-xml');
 
tool.diff(lhs,rhs,schema, options, (result) => {

}
```
**lhs and rhs** are the two JSON objects to compare.

### Usage for comparing XML
```
var tool = require('diff-js-xml');
 
tool.diffAsXml(lhs,rhs,schema, options, (result) => {

}
```
**lhs and rhs** are the two XML strings to compare.

#### Options for both compare functions
**schema** - you can specify a schema to apply to the comparison to compare just by type or skip the field
example:
```
var schema = { a: { skipKey:true, compareValues: true, compareTypes: true  }}

```
in this example when it gets to compare the a field, we tell the comparison to:
     skipKey: don't compare at all, exclude it from the report
     compareValues: if false we compare the types but not the values of the property
     compareType: if false we don't compare neither the values nor the types of a property

**options** is an object with 2 fields:
  **options.filter(a,b)** is a function you can pass to the comparison, it's yield every time 2 fields are compared, if the function return true the comparison for those fields is skipped.
  **options.stringCaseInsensitive** is a boolean, if true the string comparison is done case insensitive

**result** is an array returned from the diff method containing all the differences

## Contributors
* Joost van Dieten <joost.van.dieten@testassured.nl> (http://www.testassured.nl)
