class Game2048 {
    constructor(gridId, scoreId, gameOverId, gameOverTitleId) {
        this.gridId = gridId;
        this.scoreId = scoreId;
        this.gameOverId = gameOverId;
        this.gameOverTitleId = gameOverTitleId;
        
        this.grid = [];
        this.score = 0;
        this.best = localStorage.getItem('best2048') || 0;
        this.size = 4;
        this.gameOver = false;
        this.won = false;
        
        this.init();
    }

    init() {
        this.grid = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
        this.updateScore();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({row: i, col: j});
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateDisplay() {
        const gridElement = document.getElementById(this.gridId);
        if (!gridElement) return;
        
        gridElement.innerHTML = '';

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                
                if (this.grid[i][j] !== 0) {
                    tile.textContent = this.grid[i][j];
                    tile.classList.add(`tile-${this.grid[i][j]}`);
                }
                
                gridElement.appendChild(tile);
            }
        }
    }

    updateScore() {
        const scoreElement = document.getElementById(this.scoreId);
        if (scoreElement) {
            scoreElement.textContent = this.score;
        }
        
        // Only update best score for single player mode
        if (this.scoreId === 'score') {
            if (this.score > this.best) {
                this.best = this.score;
                localStorage.setItem('best2048', this.best);
            }
            const bestElement = document.getElementById('best');
            if (bestElement) {
                bestElement.textContent = this.best;
            }
        }
    }

    move(direction) {
        if (this.gameOver) return false;

        let moved = false;
        const previousGrid = this.grid.map(row => [...row]);

        switch (direction) {
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
        }

        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            this.updateScore();
            
            if (this.checkWin() && !this.won) {
                this.won = true;
                return 'win';
            } else if (this.checkGameOver()) {
                this.gameOver = true;
                return 'lose';
            }
        } else {
            // Check if game is over even when no move was made
            if (this.checkGameOver()) {
                this.gameOver = true;
                return 'lose';
            }
        }

        return moved;
    }

    moveLeft() {
        let moved = false;
        for (let i = 0; i < this.size; i++) {
            const row = this.grid[i].filter(val => val !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                }
            }
            while (row.length < this.size) {
                row.push(0);
            }
            
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== row[j]) {
                    moved = true;
                }
                this.grid[i][j] = row[j];
            }
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let i = 0; i < this.size; i++) {
            const row = this.grid[i].filter(val => val !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    j--;
                }
            }
            while (row.length < this.size) {
                row.unshift(0);
            }
            
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== row[j]) {
                    moved = true;
                }
                this.grid[i][j] = row[j];
            }
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let j = 0; j < this.size; j++) {
            const column = [];
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }
            
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                }
            }
            
            while (column.length < this.size) {
                column.push(0);
            }
            
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== column[i]) {
                    moved = true;
                }
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let j = 0; j < this.size; j++) {
            const column = [];
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }
            
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                    i--;
                }
            }
            
            while (column.length < this.size) {
                column.unshift(0);
            }
            
            for (let i = 0; i < this.size; i++) {
                if (this.grid[i][j] !== column[i]) {
                    moved = true;
                }
                this.grid[i][j] = column[i];
            }
        }
        return moved;
    }

    checkWin() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    checkGameOver() {
        // Check for empty cells
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    return false;
                }
            }
        }

        // Check for possible merges
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.grid[i][j];
                if ((i < this.size - 1 && this.grid[i + 1][j] === current) ||
                    (j < this.size - 1 && this.grid[i][j + 1] === current)) {
                    return false;
                }
            }
        }

        return true;
    }

    showGameOver(message) {
        const titleElement = document.getElementById(this.gameOverTitleId);
        const gameOverElement = document.getElementById(this.gameOverId);
        
        if (titleElement) titleElement.textContent = message;
        if (gameOverElement) gameOverElement.classList.remove('hidden');
    }

    hideGameOver() {
        const gameOverElement = document.getElementById(this.gameOverId);
        if (gameOverElement) gameOverElement.classList.add('hidden');
    }

    restart() {
        this.hideGameOver();
        this.init();
    }

    // Method to check if game should end (no moves available)
    hasMovesAvailable() {
        // Check for empty cells first
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    return true;
                }
            }
        }

        // Check if any moves are possible
        return this.canMove('left') || this.canMove('right') || 
               this.canMove('up') || this.canMove('down');
    }

    // Get available moves for AI
    getAvailableMoves() {
        const moves = [];
        const directions = ['left', 'right', 'up', 'down'];
        
        for (const direction of directions) {
            // Test if move is possible by creating a temporary test
            if (this.canMove(direction)) {
                moves.push(direction);
            }
        }
        
        return moves;
    }

    // Helper method to check if a move is possible without actually making it
    canMove(direction) {
        const testGrid = this.grid.map(row => [...row]);
        
        switch (direction) {
            case 'left':
                return this.canMoveLeft(testGrid);
            case 'right':
                return this.canMoveRight(testGrid);
            case 'up':
                return this.canMoveUp(testGrid);
            case 'down':
                return this.canMoveDown(testGrid);
            default:
                return false;
        }
    }

    canMoveLeft(grid) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 1; j < this.size; j++) {
                if (grid[i][j] !== 0 && (grid[i][j-1] === 0 || grid[i][j-1] === grid[i][j])) {
                    return true;
                }
            }
        }
        return false;
    }

    canMoveRight(grid) {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size - 1; j++) {
                if (grid[i][j] !== 0 && (grid[i][j+1] === 0 || grid[i][j+1] === grid[i][j])) {
                    return true;
                }
            }
        }
        return false;
    }

    canMoveUp(grid) {
        for (let i = 1; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (grid[i][j] !== 0 && (grid[i-1][j] === 0 || grid[i-1][j] === grid[i][j])) {
                    return true;
                }
            }
        }
        return false;
    }

    canMoveDown(grid) {
        for (let i = 0; i < this.size - 1; i++) {
            for (let j = 0; j < this.size; j++) {
                if (grid[i][j] !== 0 && (grid[i+1][j] === 0 || grid[i+1][j] === grid[i][j])) {
                    return true;
                }
            }
        }
        return false;
    }
}

class CPUPlayer extends Game2048 {
    constructor(gridId, scoreId, gameOverId, gameOverTitleId) {
        super(gridId, scoreId, gameOverId, gameOverTitleId);
        this.moveDelay = 1200; // Slightly faster CPU moves (1.2 seconds delay)
        this.isActive = false;
        this.moveTimeout = null;
        this.gameEndCallback = null; // Callback for when CPU game ends
    }

    // Set callback for when CPU game ends
    setGameEndCallback(callback) {
        this.gameEndCallback = callback;
    }

    start() {
        this.isActive = true;
        this.makeNextMove();
    }

    stop() {
        this.isActive = false;
        if (this.moveTimeout) {
            clearTimeout(this.moveTimeout);
            this.moveTimeout = null;
        }
    }

    makeNextMove() {
        if (!this.isActive || this.gameOver || this.won) return;

        this.moveTimeout = setTimeout(() => {
            if (!this.isActive || this.gameOver || this.won) return;
            
            const move = this.getBestMove();
            if (move) {
                const result = this.move(move);
                if (result === 'win') {
                    this.showGameOver('Computer Wins!');
                    this.stop();
                    if (this.gameEndCallback) this.gameEndCallback('cpu-win');
                    return 'win';
                } else if (result === 'lose') {
                    this.showGameOver('Computer Lost!');
                    this.stop();
                    if (this.gameEndCallback) this.gameEndCallback('cpu-lose');
                    return 'lose';
                }
            } else {
                // No valid moves available
                this.gameOver = true;
                this.showGameOver('Computer Lost!');
                this.stop();
                if (this.gameEndCallback) this.gameEndCallback('cpu-lose');
                return 'lose';
            }
            
            // Continue making moves if still active
            if (this.isActive && !this.gameOver && !this.won) {
                this.makeNextMove();
            }
        }, this.moveDelay);
    }

    // Simple AI strategy: prefer moves that create higher scores
    getBestMove() {
        const availableMoves = this.getAvailableMoves();
        if (availableMoves.length === 0) return null;

        let bestMove = availableMoves[0];
        let bestScore = -1;

        for (const move of availableMoves) {
            const score = this.evaluateMove(move);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }

    evaluateMove(direction) {
        // Create a completely separate test instance to avoid affecting the actual game
        const testGame = new Game2048('temp', 'temp', 'temp', 'temp');
        testGame.grid = this.grid.map(row => [...row]);
        testGame.score = this.score;
        testGame.gameOver = this.gameOver;
        testGame.won = this.won;
        
        // Test the move on the copy
        const moved = testGame.move(direction);
        if (!moved) return -1; // Invalid move
        
        return testGame.score - this.score;
    }
}

class GameManager {
    constructor() {
        this.currentMode = 'single';
        this.singlePlayerGame = null;
        this.playerGame = null;
        this.cpuGame = null;
        this.raceActive = false;
        
        this.init();
        this.bindEvents();
    }

    init() {
        this.showSinglePlayerMode();
        this.singlePlayerGame = new Game2048('grid', 'score', 'game-over', 'game-over-title');
    }

    showSinglePlayerMode() {
        this.currentMode = 'single';
        document.getElementById('single-player-mode').classList.remove('hidden');
        document.getElementById('race-mode').classList.add('hidden');
        document.getElementById('single-player-btn').classList.add('active');
        document.getElementById('race-mode-btn').classList.remove('active');
    }

    showRaceMode() {
        this.currentMode = 'race';
        document.getElementById('single-player-mode').classList.add('hidden');
        document.getElementById('race-mode').classList.remove('hidden');
        document.getElementById('single-player-btn').classList.remove('active');
        document.getElementById('race-mode-btn').classList.add('active');
        
        this.initRaceMode();
    }

    initRaceMode() {
        this.playerGame = new Game2048('player-grid', 'player-score', 'player-game-over', 'player-game-over-title');
        this.cpuGame = new CPUPlayer('cpu-grid', 'cpu-score', 'cpu-game-over', 'cpu-game-over-title');
        this.hideRaceWinner();
    }

    startRace() {
        // Stop any existing CPU game
        if (this.cpuGame) {
            this.cpuGame.stop();
        }
        
        // Restart both games
        if (this.playerGame) this.playerGame.restart();
        if (this.cpuGame) this.cpuGame.restart();
        
        this.raceActive = true;
        this.hideRaceWinner();
        
        // Set up CPU game end callback
        if (this.cpuGame) {
            this.cpuGame.setGameEndCallback((result) => {
                if (result === 'cpu-win') {
                    this.endRace('Computer Wins!');
                } else if (result === 'cpu-lose' && this.playerGame.gameOver) {
                    this.endRace('Draw - Both Lost!');
                } else if (result === 'cpu-lose' && !this.playerGame.gameOver && !this.playerGame.won) {
                    // CPU lost but player is still playing - player can still win
                    // Race continues until player wins or loses
                }
            });
        }
        
        // Start CPU player with a small delay to ensure everything is initialized
        setTimeout(() => {
            if (this.cpuGame && this.raceActive) {
                this.cpuGame.start();
            }
        }, 100);
        
        // Set up win detection
        this.checkRaceWinner();
    }

    checkRaceWinner() {
        if (!this.raceActive) return;

        const checkWin = () => {
            if (!this.raceActive) return;

            // Check for wins first
            if (this.playerGame && this.playerGame.won) {
                this.endRace('You Win!');
                return;
            } 
            
            if (this.cpuGame && this.cpuGame.won) {
                this.endRace('Computer Wins!');
                return;
            } 
            
            // Check for game over states
            if (this.playerGame && this.cpuGame) {
                if (this.playerGame.gameOver && this.cpuGame.gameOver) {
                    this.endRace('Draw - Both Lost!');
                    return;
                } else if (this.playerGame.gameOver && !this.cpuGame.gameOver && !this.cpuGame.won) {
                    // Player lost, CPU still playing - let CPU continue
                    // The race will end when CPU wins or loses
                } else if (this.cpuGame.gameOver && !this.playerGame.gameOver && !this.playerGame.won) {
                    // CPU lost, player still playing - let player continue
                    // Player can still win
                }
            }
            
            // Continue checking if race is still active
            if (this.raceActive) {
                setTimeout(checkWin, 100); // Check more frequently for better responsiveness
            }
        };

        setTimeout(checkWin, 100);
    }

    endRace(winnerText) {
        this.raceActive = false;
        if (this.cpuGame) this.cpuGame.stop();
        
        document.getElementById('winner-text').textContent = winnerText;
        document.getElementById('race-winner').classList.remove('hidden');
    }

    hideRaceWinner() {
        document.getElementById('race-winner').classList.add('hidden');
    }

    bindEvents() {
        // Mode toggle buttons
        document.getElementById('single-player-btn').addEventListener('click', () => {
            this.showSinglePlayerMode();
        });

        document.getElementById('race-mode-btn').addEventListener('click', () => {
            this.showRaceMode();
        });

        // Single player controls
        document.getElementById('restart').addEventListener('click', () => {
            if (this.singlePlayerGame) this.singlePlayerGame.restart();
        });

        document.getElementById('new-game').addEventListener('click', () => {
            if (this.singlePlayerGame) this.singlePlayerGame.restart();
        });

        // Race mode controls
        document.getElementById('start-race').addEventListener('click', () => {
            this.startRace();
        });

        document.getElementById('race-restart').addEventListener('click', () => {
            this.startRace();
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.currentMode === 'single' && this.singlePlayerGame) {
                this.handleKeyPress(e, this.singlePlayerGame);
            } else if (this.currentMode === 'race' && this.playerGame && this.raceActive) {
                this.handleKeyPress(e, this.playerGame);
            }
        });

        // Touch controls for mobile
        this.bindTouchControls();
    }

    handleKeyPress(e, game) {
        let result = false;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            result = game.move('left');
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            result = game.move('right');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            result = game.move('up');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            result = game.move('down');
        }

        // Handle game over states
        if (this.currentMode === 'single') {
            if (result === 'win') {
                game.showGameOver('You Win!');
            } else if (result === 'lose') {
                game.showGameOver('Game Over!');
            }
        } else if (this.currentMode === 'race' && this.raceActive) {
            if (result === 'win') {
                game.showGameOver('You Win!');
                this.endRace('You Win!');
            } else if (result === 'lose') {
                game.showGameOver('You Lost!');
                // Check if CPU also lost or is still playing
                if (this.cpuGame.gameOver) {
                    this.endRace('Draw - Both Lost!');
                } else if (this.cpuGame.won) {
                    this.endRace('Computer Wins!');
                } else {
                    // CPU is still playing, they might still win
                    // Race will end when CPU wins or loses via callback
                }
            }
        }
    }

    bindTouchControls() {
        let startX, startY;
        
        const handleTouchStart = (e, game) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        };

            const handleTouchEnd = (e, game) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            let result = false;
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 0) {
                    result = game.move('left');
                } else {
                    result = game.move('right');
                }
            } else {
                if (diffY > 0) {
                    result = game.move('up');
                } else {
                    result = game.move('down');
                }
            }

            // Handle game over states
            if (this.currentMode === 'single') {
                if (result === 'win') {
                    game.showGameOver('You Win!');
                } else if (result === 'lose') {
                    game.showGameOver('Game Over!');
                }
            } else if (this.currentMode === 'race' && this.raceActive) {
                if (result === 'win') {
                    game.showGameOver('You Win!');
                    this.endRace('You Win!');
                } else if (result === 'lose') {
                    game.showGameOver('You Lost!');
                    // Check if CPU also lost or is still playing
                    if (this.cpuGame.gameOver) {
                        this.endRace('Draw - Both Lost!');
                    } else if (this.cpuGame.won) {
                        this.endRace('Computer Wins!');
                    } else {
                        // CPU is still playing, they might still win
                        // Race will end when CPU wins or loses via callback
                    }
                }
            }

            startX = null;
            startY = null;
        };

        // Single player touch controls
        const singlePlayerContainer = document.querySelector('#single-player-mode .game-container');
        singlePlayerContainer.addEventListener('touchstart', (e) => {
            if (this.singlePlayerGame) handleTouchStart(e, this.singlePlayerGame);
        });
        singlePlayerContainer.addEventListener('touchend', (e) => {
            if (this.singlePlayerGame) handleTouchEnd(e, this.singlePlayerGame);
        });

        // Race mode player touch controls
        const playerContainer = document.querySelector('#player-grid').parentElement;
        playerContainer.addEventListener('touchstart', (e) => {
            if (this.playerGame && this.raceActive) handleTouchStart(e, this.playerGame);
        });
        playerContainer.addEventListener('touchend', (e) => {
            if (this.playerGame && this.raceActive) handleTouchEnd(e, this.playerGame);
        });
    }
}

// Initialize the game manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameManager();
});