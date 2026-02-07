// Objects Demo

const person = {
  name: "Alice",
  age: 30,
  city: "New York",
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};

console.log("Objects Demo:");
console.log(person.name); // Dot notation
console.log(person["age"]); // Bracket notation
console.log(person.greet());

// Object destructuring
const { name, age, city } = person;
console.log({ name, age, city });

// Spread operator
const updatedPerson = { ...person, age: 31, country: "USA" };
console.log("Updated:", updatedPerson);
