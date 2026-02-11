// TypeScript Basics Demo

// Type annotations
const message: string = "Hello TypeScript";
const count: number = 42;
const isActive: boolean = true;

// Function with types
function add(a: number, b: number): number {
  return a + b;
}

// Interfaces for object shapes
// Interfaces define the structure (shape) of objects
// They specify what properties an object must have and their types
interface User {
  id: number;
  name: string;
  email?: string; // Optional property
  readonly createdAt: Date; // Readonly property
}

const user: User = {
  id: 1,
  name: "Bob",
  createdAt: new Date()
};

// Interfaces can describe any object shape
interface Product {
  id: number;
  title: string;
  price: number;
  inStock: boolean;
}

const product: Product = {
  id: 101,
  title: "Laptop",
  price: 999.99,
  inStock: true
};

// Type alias
type Point = {
  x: number;
  y: number;
};

const origin: Point = { x: 0, y: 0 };

// Union types
type Status = "pending" | "approved" | "rejected";
const currentStatus: Status = "pending";

// Array types
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ["Alice", "Bob"];

console.log("TypeScript Demo:");
console.log({ message, count, isActive });
console.log({ user, origin, currentStatus });
