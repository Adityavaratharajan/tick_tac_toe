const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

function checkWinner(board, player) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(cond => cond.every(i => board[i] === player));
}

function computerMove(board) {
    const available = board.map((v, i) => v === ' ' ? i : null).filter(v => v !== null);
    
    // Try to win
    for (let move of available) {
        board[move] = 'O';
        if (checkWinner(board, 'O')) return move;
        board[move] = ' ';
    }
    
    // Block player
    for (let move of available) {
        board[move] = 'X';
        if (checkWinner(board, 'X')) {
            board[move] = 'O';
            return move;
        }
        board[move] = ' ';
    }
    
    // Center
    if (board[4] === ' ') return 4;
    
    // Corners
    const corners = [0, 2, 6, 8].filter(c => board[c] === ' ');
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    
    // Any
    return available[0];
}

app.post('/move', (req, res) => {
    const { board, move } = req.body;
    
    if (board[move] !== ' ') {
        return res.json({ error: 'Invalid move' });
    }
    
    board[move] = 'X';
    
    if (checkWinner(board, 'X')) {
        return res.json({ board, winner: 'X' });
    }
    
    if (!board.includes(' ')) {
        return res.json({ board, winner: 'draw' });
    }
    
    const compMove = computerMove(board);
    board[compMove] = 'O';
    
    if (checkWinner(board, 'O')) {
        return res.json({ board, winner: 'O' });
    }
    
    if (!board.includes(' ')) {
        return res.json({ board, winner: 'draw' });
    }
    
    res.json({ board, winner: null });
});

app.listen(5000, () => console.log('Server running on port 5000'));
