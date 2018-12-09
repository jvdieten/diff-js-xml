# diff-js-xml
Project to compare xml or json objects very useful for A-B testing

## Installation
```
$ npm install diff-js-xml --save
```
### Usage for comparing XML
```
var tool = require('diff-js-xml');
 
tool.diffAsXml(leftXML, rightXML, schema, options, (result) => {

}
```
Before comparing xml is first transformed into JSON object with **xml-js** module  

**leftXML and rightXML** are the two XML strings to compare.
**result** is an array returned from the diff method containing all the differences with following types:

**missing field** xml element is not found in leftXML or rightXML

**difference in field value** values of elements is not equal 

**type equality** value types of element are not equal

### Usage for comparing JSON
```
var tool = require('diff-js-xml');
 
tool.diff(leftcompare, rightcompare, schema, options, (result) => {

}
```
**leftcompare and rightcompare** are the two JSON objects to compare.
**result** is an array returned from the diff method containing all the differences


## Contributors
* Joost van Dieten <joost.van.dieten@testassured.nl> (http://www.testassured.nl)
