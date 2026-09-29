import { useState, useEffect } from "react";
import "./Question.css";

const TIME_LIMIT = 60; // 1 minuto por pergunta, em segundos

function Question({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onTimeUp,
  onNext,
}) {
  // Opção que o usuário clicou (null enquanto não respondeu)
  const [selectedOption, setSelectedOption] = useState(null);

  // Indica se essa pergunta já foi resolvida (respondida ou expirada pelo tempo)
  const [isAnswered, setIsAnswered] = useState(false);

  // Contagem regressiva desta pergunta
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

  // Timer: decrementa a cada segundo. Para automaticamente quando a pergunta
  // é respondida, e reinicia sozinho quando o componente é recriado
  // (graças ao key={currentQuestion.id} usado no App.jsx).
  useEffect(() => {
    if (isAnswered) return;

    if (timeLeft === 0) {
      setIsAnswered(true);
      onTimeUp();
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, isAnswered, onTimeUp]);

  function handleSelect(option) {
    if (isAnswered) return; // impede trocar de resposta depois de já ter respondido

    setSelectedOption(option);
    setIsAnswered(true);
    onAnswer(option);
  }

  // Decide a classe visual de cada botão de opção
  function getOptionClass(option) {
    if (!isAnswered) return "option-btn";

    const isCorrectOption = option === question.correctAnswer;
    const isSelectedOption = option === selectedOption;

    if (isCorrectOption) return "option-btn correct";
    if (isSelectedOption && !isCorrectOption) return "option-btn incorrect";
    return "option-btn disabled";
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-progress">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className={`timer ${timeLeft <= 10 ? "timer-warning" : ""}`}>
          {timeLeft}s
        </span>
      </div>

      <h2 className="question-text">{question.question}</h2>

      <div className="options">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            className={getOptionClass(option)}
            onClick={() => handleSelect(option)}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>

      {isAnswered && (
        <button type="button" className="next-btn" onClick={onNext}>
          Next
        </button>
      )}
    </div>
  );
}

export default Question;