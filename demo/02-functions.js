// Functions Demo

// Function declaration
function greet(name) {
  return `Hello, ${name}!`;
}

// Function expression
const add = function(a, b) {
  return a + b;
};

// Arrow function
const multiply = (a, b) => a * b;

// Arrow function with block body
const divide = (a, b) => {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
};

console.log("Functions Demo:");
console.log(greet("World"));
console.log(add(5, 3));
console.log(multiply(4, 7));
console.log(divide(10, 2));
