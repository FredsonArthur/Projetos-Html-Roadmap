import "./ProgressBar.css";

function ProgressBar({ progress, current, total }) {
  return (
    <div className="progress-wrapper">
      {/* Barra de fundo (trilho) + barra preenchida, com largura proporcional ao progresso */}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        ></div>
        <span className="progress-percent">{Math.round(progress)}%</span>
      </div>

      {/* Contador "X of Y" */}
      <span className="progress-count">
        {current} of {total}
      </span>
    </div>
  );
}

export default ProgressBar;