// Lista de flashcards com perguntas e respostas sobre JavaScript.
// Cada item precisa ter "question" e "answer".
// Para adicionar mais cards, basta incluir novos objetos no array.

export const flashcards = [
  {
    question: "What is the difference between var, let, and const?",
    answer:
      "In JavaScript, var is function-scoped and can be re-declared; let and const are block-scoped, with let allowing re-assignment and const preventing it. However, const objects can have their contents modified.",
  },
  {
    question: "What is a closure in JavaScript?",
    answer:
      "A closure is a function that remembers the variables from the scope in which it was created, even after that outer scope has finished executing.",
  },
  {
    question: "What is the difference between '==' and '==='?",
    answer:
      "'==' compares values after converting them to a common type (loose equality), while '===' compares both value and type without conversion (strict equality).",
  },
  {
    question: "What is the event loop?",
    answer:
      "The event loop is the mechanism that allows JavaScript to perform non-blocking operations by moving callbacks from the task queue to the call stack once it's empty.",
  },
  {
    question: "What is a Promise?",
    answer:
      "A Promise is an object representing the eventual completion or failure of an asynchronous operation, allowing you to attach callbacks with .then() and .catch().",
  },
  {
    question: "What is destructuring in JavaScript?",
    answer:
      "Destructuring is a syntax that allows unpacking values from arrays or properties from objects into distinct variables.",
  },
  {
    question: "What is the difference between null and undefined?",
    answer:
      "undefined means a variable has been declared but not assigned a value, while null is an explicit assignment representing 'no value'.",
  },
  {
    question: "What is the 'this' keyword in JavaScript?",
    answer:
      "'this' refers to the object that is currently executing the function, and its value depends on how the function is called.",
  },
  {
    question: "What is a higher-order function?",
    answer:
      "A higher-order function is a function that takes one or more functions as arguments, returns a function, or both.",
  },
  {
    question: "What is the spread operator used for?",
    answer:
      "The spread operator (...) expands an iterable, like an array or object, into individual elements, often used for copying or merging.",
  },
];