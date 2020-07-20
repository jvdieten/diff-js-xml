[![Travis-ci Build Status](https://travis-ci.com/jvdieten/diff-js-xml.svg?branch=master)](https://travis-ci.com/jvdieten/diff-js-xml)
[![NPM](https://nodei.co/npm/diff-js-xml.png)](https://nodei.co/npm/diff-js-xml/)

# diff-js-xml
Module to compare XML or JSON objects very useful for A-B testing main features:

- Compare elements and element values
- Compare with wildcards for element values
- Clear reporting of differences in result array see below

## Installation
```
$ npm install diff-js-xml --save
```
### Usage for comparing XML
```javascript
const tool = require('diff-js-xml');
 
tool.diffAsXml(lhsXML, rhsXML, schema, options, (result) => {

});
```
Before comparing xml is first transformed into JSON object with **xml-js** module  

**lhsXML and rhsXML** are the two XML strings to compare.

**schema**  options for specific keys for example skip one of them or null if not needed

```javascript
const schema = { elementA: { skipKey:true}}
```

**options** generic options or null if not needed current options available:
- **compareElementValues** to disable comparing of element values default is true
- **xml2jsOptions** pass through options to xml-js. xml-js has its own default options, and we override a handful: 
`compact: true, ignoreDoctype: true, ignoreDeclaration: true, ignoreAttributes: true`
You can override these, or others, but most option combinations have not been tested carefully so use caution.

```javascript
const options = {compareElementValues: false}
```

**result** array returned from the diff method containing all the differences with following result types:

**missing element** xml element is not found in leftXML or rightXML

**difference in element value** values of elements is not equal 

**Example of result**
```
[ { path: 'element.subelement',
    type: 'difference in field value',
    message: 'field element.subelement has lhs value TestA and rhs value TestB' } ]
```

#### wildcard values

For A-B testing purposes it can be very handy to compare with wildcards if for exammple you are not interested in all 
the data. You can put an * in the first (lhs) xml file. The result of this compare will be no differences.

```javascript
const lhsxml =
    '<string-array name="languages_array"><item>*</item><item2>Chinese</item2><item3>French</item3><item4>Spanish</item4></string-array>'
const string =
    '<string-array name="languages_array"><item>Dutch</item><item2>Chinese</item2><item3>French</item3><item4>Spanish</item4></string-array>'
```

### Usage for comparing JSON
```javascript
const tool = require('diff-js-xml');
 
tool.diff(lhsObject, rhsObject, schema, options, (result) => {

});
```
**lhsObject and rhsObject** are the two JSON objects to compare.
**result** is an array returned from the diff method containing all the differences see above.


## Contributors
* Joost van Dieten <joost.van.dieten@testassured.nl> (http://www.testassured.nl)
