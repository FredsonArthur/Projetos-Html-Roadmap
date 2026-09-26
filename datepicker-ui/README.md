/* =========================================
   1. Variáveis & Reset Global
   ========================================= */
:root {
    --bg-color: #f8fafc;
    --card-bg: #ffffff;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --border-color: #cbd5e1;
    --primary-color: #0f172a;
    --hover-color: #f1f5f9;
    --radius: 8px;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-primary);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

/* =========================================
   2. Contentor e Grupo de Input
   ========================================= */
.datepicker-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.datepicker {
    position: relative; /* Essencial para ancorar o dropdown posicionado absolutamente */
    width: 280px;
}

.datepicker-input-group {
    display: flex;
    align-items: center;
    border: 2px solid var(--border-color);
    border-radius: var(--radius);
    background-color: var(--card-bg);
    overflow: hidden;
    transition: border-color 0.2s;
}

.datepicker-input-group:focus-within {
    border-color: var(--primary-color);
}

.datepicker-input {
    width: 100%;
    padding: 12px 14px;
    border: none;
    outline: none;
    font-size: 0.95rem;
    color: var(--text-primary);
    background: transparent;
}

.datepicker-input::placeholder {
    color: var(--text-secondary);
}

.datepicker-btn {
    background: transparent;
    border: none;
    padding: 10px 14px;
    cursor: pointer;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
}

/* =========================================
   3. Painel do Calendário (Posicionamento Absoluto)
   ========================================= */
.calendar-dropdown {
    position: absolute; /* Posicionamento em relação ao contentor .datepicker */
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    background-color: var(--card-bg);
    border: 2px solid var(--border-color);
    border-radius: var(--radius);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
    padding: 16px;
    z-index: 10;
}

/* Cabeçalho do Mês */
.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}

.calendar-month {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--text-primary);
}

.nav-arrow {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: bold;
    color: var(--text-secondary);
    padding: 4px 8px;
    border-radius: 4px;
    transition: background 0.2s;
}

.nav-arrow:hover {
    background-color: var(--hover-color);
    color: var(--text-primary);
}

/* Dias da Semana */
.calendar-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 8px;
    text-transform: lowercase;
}

/* Grelha de Dias do Mês */
.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    row-gap: 4px;
    column-gap: 0;
}

.day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    color: var(--text-primary);
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.day:not(.empty):hover {
    background-color: var(--primary-color);
    color: #ffffff;
}

.day.empty {
    cursor: default;
}