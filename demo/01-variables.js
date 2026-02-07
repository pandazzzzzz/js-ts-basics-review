// Variables and Data Types Demo

// Variable declarations
var oldStyle = "var is function-scoped";
let modernStyle = "let is block-scoped";
const constant = "const cannot be reassigned";

// Primitive types
const stringType = "Hello World";
const numberType = 42;
const booleanType = true;
const nullType = null;
const undefinedType = undefined;
const symbolType = Symbol("unique");
const bigIntType = 9007199254740991n;

console.log("Variables Demo:");
console.log({ stringType, numberType, booleanType });
console.log({ nullType, undefinedType, symbolType, bigIntType });
