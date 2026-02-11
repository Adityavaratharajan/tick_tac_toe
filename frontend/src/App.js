import React, { useState } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState(Array(9).fill(' '));
  const [winner, setWinner] = useState(null);

  const handleClick = async (index) => {
    if (board[index] !== ' ' || winner) return;

    const res = await fetch('http://localhost:5000/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ board: [...board], move: index })
    });

    const data = await res.json();
    if (data.error) return;

    setBoard(data.board);
    setWinner(data.winner);
  };

  const reset = () => {
    setBoard(Array(9).fill(' '));
    setWinner(null);
  };

  return (
    <div className="App">
      <h1>Tic Tac Toe</h1>
      <p>You (X) vs Computer (O)</p>
      <div className="board">
        {board.map((cell, i) => (
          <div key={i} className="cell" onClick={() => handleClick(i)}>
            {cell !== ' ' ? cell : ''}
          </div>
        ))}
      </div>
      {winner && (
        <div className="result">
          <h2>
            {winner === 'X' ? '🎉 You win!' : winner === 'O' ? '💻 Computer wins!' : '😐 Draw!'}
          </h2>
          <button onClick={reset}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
