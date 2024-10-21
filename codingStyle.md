# coding style

### naming convention
- Folder names - kebab-case?: map-api, servo-location
- camelCase for variables, functions and methods (getMapAPI, getNewServo)

### indentation
- 4 spaces
- 2 linebreaks between sections & functions

variables
variables
variables


function


function


### functions
const handleClick = () => {

}

word
    .toLowerCase()
    .toUpperCase()
    .toLowerCase()


### objects, arrays
const mapServo = {
    Shell: 50,
    SmthElse: 20
}

const arrays = [
    'stuff',
    'more stuff',
    'even more stuff'
]


### if statements
if (guardCondition) {
	return guard 
}

if (laterCondition) {
	return functionResult
} else if (otherCondition) {
	return functionResult
} else {
	return functionResult
}

### HTML
tag hierarchy - property = camelcase, tag = kebabcase
mapServo-img

<div class="class", id="id", value="value">

### modules
- express
- pg
- dotenv


### dev dependency modules
- nodemon