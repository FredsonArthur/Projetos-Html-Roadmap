import { useState } from "react";
import "./App.css";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import ResultScreen from "./components/ResultScreen";
import { questions } from "./data/questions";

// Estados possíveis do quiz
const STATUS = {
  START: "start",
  PLAYING: "playing",
  FINISHED: "finished",
};

function App() {
  // Controla em qual tela estamos: início, jogando ou resultado final
  const [status, setStatus] = useState(STATUS.START);

  // Índice da pergunta atual dentro do array de questions
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pontuação acumulada do usuário
  const [score, setScore] = useState(0);

  // Histórico de respostas, usado na tela final para mostrar todos os resultados
  const [answers, setAnswers] = useState([]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  function handleStart() {
    // Reseta tudo antes de começar (útil também para o botão "jogar de novo")
    setStatus(STATUS.PLAYING);
    setCurrentIndex(0);
    setScore(0);
    setAnswers([]);
  }

  function goToNextQuestion() {
    if (isLastQuestion) {
      setStatus(STATUS.FINISHED);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  // Chamada pelo componente Question quando o usuário clica em uma resposta
  function handleAnswer(selectedOption) {
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Guarda o resultado dessa pergunta para exibir no resumo final
    setAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selected: selectedOption,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
        skipped: false,
      },
    ]);
  }

  // Chamada pelo componente Question quando o tempo de 1 minuto acaba
  function handleTimeUp() {
    // Penaliza com -1 ponto quando a pergunta é pulada por falta de tempo
    setScore((prev) => prev - 1);

    setAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selected: null,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: false,
        skipped: true,
      },
    ]);
  }

  return (
    <div className="app">
      {status === STATUS.START && (
        <StartScreen
          totalQuestions={questions.length}
          onStart={handleStart}
        />
      )}

      {status === STATUS.PLAYING && (
        <Question
          key={currentQuestion.id}
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          onTimeUp={handleTimeUp}
          onNext={goToNextQuestion}
        />
      )}

      {status === STATUS.FINISHED && (
        <ResultScreen
          score={score}
          total={questions.length}
          answers={answers}
          onRestart={handleStart}
        />
      )}
    </div>
  );
}

export default App;