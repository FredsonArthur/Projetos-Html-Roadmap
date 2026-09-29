import "./StartScreen.css";

function StartScreen({ totalQuestions, onStart }) {
  return (
    <div className="start-card">
      <h1>JavaScript Quiz</h1>
      <p className="description">
        Test your knowledge with {totalQuestions} multiple-choice questions.
        You'll have 1 minute to answer each one, and your score decreases if
        time runs out before you answer.
      </p>

      <ul className="rules">
        <li>{totalQuestions} questions in total</li>
        <li>60 seconds per question</li>
        <li>+1 point for each correct answer</li>
        <li>-1 point if time runs out</li>
      </ul>

      <button type="button" className="start-btn" onClick={onStart}>
        Start Quiz
      </button>
    </div>
  );
}

export default StartScreen;