// Modern JavaScript Features (ES6+)

// 1. Spread Operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

console.log("Spread Operator:");
console.log({ arr2, obj2 });

// 2. Destructuring
const person = { name: "Alice", age: 30, city: "NYC" };
const { name, age } = person;

const numbers = [10, 20, 30, 40];
const [first, second, ...rest] = numbers;

console.log("\nDestructuring:");
console.log({ name, age, first, second, rest });

// 3. Default Parameters
function greet(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log("\nDefault Parameters:");
console.log(greet()); // "Hello, Guest!"
console.log(greet("Bob")); // "Hello, Bob!"

// 4. Rest Parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

console.log("\nRest Parameters:");
console.log(sum(1, 2, 3, 4, 5)); // 15

// 5. Arrow Functions and Lexical this
const counter = {
  count: 0,
  increment() {
    // Arrow function preserves 'this' from enclosing scope
    setTimeout(() => {
      this.count++;
      console.log("\nArrow Function 'this':", this.count);
    }, 100);
  }
};

counter.increment();

// 6. Classes
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks!`;
  }
}

const dog = new Dog("Max", "Golden Retriever");
console.log("\nClasses:");
console.log(dog.speak()); // "Max barks!"
