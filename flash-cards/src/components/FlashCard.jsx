import "./FlashCard.css";

function FlashCard({
  question,
  answer,
  showAnswer,
  onToggleAnswer,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}) {
  return (
    <div className="flashcard-wrapper">
      {/* Área principal do card: mostra a pergunta, ou a resposta se showAnswer for true */}
      <div className="flashcard-body">
        <p className="flashcard-text">{showAnswer ? answer : question}</p>
      </div>

      {/* Barra de navegação: Previous | Show/Hide Answer | Next */}
      <div className="flashcard-footer">
        <button
          type="button"
          className="nav-btn"
          onClick={onPrevious}
          disabled={isFirst}
        >
          &#8249; Previous
        </button>

        <button type="button" className="toggle-btn" onClick={onToggleAnswer}>
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>

        <button
          type="button"
          className="nav-btn"
          onClick={onNext}
          disabled={isLast}
        >
          Next &#8250;
        </button>
      </div>
    </div>
  );
}

export default FlashCard;