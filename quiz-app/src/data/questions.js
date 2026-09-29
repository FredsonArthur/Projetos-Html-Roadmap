// Banco de perguntas do quiz.
// "correctAnswer" precisa ser exatamente igual a um dos itens de "options".

export const questions = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: [
      "Hyper Trainer Marking Language",
      "Hyper Text Markup Language",
      "Hyper Text Marketing Language",
      "Hyper Text Markup Leveler",
    ],
    correctAnswer: "Hyper Text Markup Language",
  },
  {
    id: 2,
    question: "Which company developed the JavaScript language?",
    options: ["Microsoft", "Netscape", "Sun Microsystems", "Google"],
    correctAnswer: "Netscape",
  },
  {
    id: 3,
    question: "Which HTML tag is used to define an internal style sheet?",
    options: ["<css>", "<script>", "<style>", "<link>"],
    correctAnswer: "<style>",
  },
  {
    id: 4,
    question: "Which CSS property controls the text size?",
    options: ["text-style", "font-size", "text-size", "font-style"],
    correctAnswer: "font-size",
  },
  {
    id: 5,
    question: "Which JavaScript keyword declares a block-scoped variable?",
    options: ["var", "let", "static", "global"],
    correctAnswer: "let",
  },
  {
    id: 6,
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Creative Style Sheets",
      "Colorful Style Sheets",
    ],
    correctAnswer: "Cascading Style Sheets",
  },
  {
    id: 7,
    question: "Which method converts a JSON string into a JavaScript object?",
    options: [
      "JSON.parse()",
      "JSON.stringify()",
      "JSON.toObject()",
      "JSON.convert()",
    ],
    correctAnswer: "JSON.parse()",
  },
  {
    id: 8,
    question: "Which operator is used for strict equality in JavaScript?",
    options: ["==", "=", "===", "!=="],
    correctAnswer: "===",
  },
  {
    id: 9,
    question: "Which HTML element is used to specify a footer for a document?",
    options: ["<bottom>", "<section>", "<footer>", "<end>"],
    correctAnswer: "<footer>",
  },
  {
    id: 10,
    question: "Which array method adds one or more elements to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correctAnswer: "push()",
  },
];