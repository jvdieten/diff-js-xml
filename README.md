[![Travis-ci Build Status](https://travis-ci.com/jvdieten/diff-js-xml.svg?branch=master)](https://travis-ci.com/jvdieten/diff-js-xml)
[![NPM](https://nodei.co/npm/diff-js-xml.png)](https://nodei.co/npm/diff-js-xml/)

# diff-js-xml
Project to compare xml or json objects very useful for A-B testing:

## Installation
```
$ npm install diff-js-xml --save
```
### Usage for comparing XML
```
var tool = require('diff-js-xml');
 
tool.diffAsXml(lhsXML, rhsXML, schema, options, (result) => {

}
```
Before comparing xml is first transformed into JSON object with **xml-js** module  

**lhsXML and rhsXML** are the two XML strings to compare.
**result** is an array returned from the diff method containing all the differences with following result types:

**missing element** xml element is not found in leftXML or rightXML

**difference in element value** values of elements is not equal 

**Example of result**
```
[ { path: 'element.subelement',
    type: 'difference in field value',
    message: 'field element.subelement has lhs value TestA and rhs value TestB' } ]
```


### Usage for comparing JSON
```
var tool = require('diff-js-xml');
 
tool.diff(lhsObject, rhsObject, schema, options, (result) => {

}
```
**lhsObject and rhsObject** are the two JSON objects to compare.
**result** is an array returned from the diff method containing all the differences see above.


## Contributors
* Joost van Dieten <joost.van.dieten@testassured.nl> (http://www.testassured.nl)
