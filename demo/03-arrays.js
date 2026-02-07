// Arrays Demo

const numbers = [1, 2, 3, 4, 5];

// Array methods
console.log("Arrays Demo:");
console.log("Original:", numbers);

// map - transform each element
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// filter - select elements
const evens = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens);

// reduce - accumulate values
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum);

// Array destructuring
const [first, second, ...rest] = numbers;
console.log({ first, second, rest });
