import "./ResultScreen.css";

function ResultScreen({ score, total, answers, onRestart }) {
  return (
    <div className="result-card">
      <h1>Quiz Completed!</h1>

      <p className="score-summary">
        You scored <strong>{score}</strong> out of {total}
      </p>

      <ul className="results-list">
        {answers.map((answer, index) => (
          <li
            key={index}
            className={`result-item ${answer.isCorrect ? "correct" : "incorrect"}`}
          >
            <p className="result-question">
              {index + 1}. {answer.question}
            </p>
            <p className="result-answer">
              {answer.skipped ? (
                <span className="result-status">Time's up — skipped</span>
              ) : (
                <>
                  Your answer: {answer.selected}{" "}
                  <span className="result-status">
                    {answer.isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </>
              )}
              {!answer.isCorrect && (
                <>
                  <br />
                  Correct answer: {answer.correctAnswer}
                </>
              )}
            </p>
          </li>
        ))}
      </ul>

      <button type="button" className="restart-btn" onClick={onRestart}>
        Play Again
      </button>
    </div>
  );
}

export default ResultScreen;