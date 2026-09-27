import { useState } from "react";
import "./App.css";
import ProgressBar from "./components/ProgressBar";
import FlashCard from "./components/FlashCard";
import { flashcards } from "./data/flashcards";

function App() {
  // Índice do flashcard atual sendo exibido (começa no primeiro, índice 0).
  const [currentIndex, setCurrentIndex] = useState(0);

  // Controla se a resposta do card atual está visível ou escondida.
  const [showAnswer, setShowAnswer] = useState(false);

  // Card atualmente selecionado, derivado do índice.
  const currentCard = flashcards[currentIndex];

  // Progresso em porcentagem, usado na barra de progresso.
  // Ex: card 5 de 20 -> (5 / 20) * 100 = 25%
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  function handleNext() {
    // Só avança se não estivermos no último card.
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      // Ao trocar de card, a resposta volta a ficar escondida.
      setShowAnswer(false);
    }
  }

  function handlePrevious() {
    // Só volta se não estivermos no primeiro card.
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setShowAnswer(false);
    }
  }

  function handleToggleAnswer() {
    // Alterna entre mostrar e esconder a resposta.
    setShowAnswer((prev) => !prev);
  }

  return (
    <div className="app">
      <h1>Flash Cards</h1>

      {/* Barra de progresso recebe a porcentagem calculada e o texto "X de Y" */}
      <ProgressBar
        progress={progress}
        current={currentIndex + 1}
        total={flashcards.length}
      />

      {/* Card recebe a pergunta/resposta atual e as funções de navegação */}
      <FlashCard
        question={currentCard.question}
        answer={currentCard.answer}
        showAnswer={showAnswer}
        onToggleAnswer={handleToggleAnswer}
        onNext={handleNext}
        onPrevious={handlePrevious}
        isFirst={currentIndex === 0}
        isLast={currentIndex === flashcards.length - 1}
      />
    </div>
  );
}

export default App;