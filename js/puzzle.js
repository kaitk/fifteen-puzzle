const { Board, END_GRID, X } = require('./board');
const Game = require('./game');
const MoronSolver = require('./moronSolver');
const StupidSolver = require('./stupidSolver');
const Solver = require('./solver');

const SAMPLE_GRID = [
   [6,13,7,10],
   [8,9,11,X],
   [15,2,12,5],
   [14,3,1,4],
];

const EASY_GRID = [
   [2,X,6,3],
   [1,10,8,4],
   [5,11,7,14],
   [9,13,15,12],
];

const game = new Game(new Board(SAMPLE_GRID));
// const game = new Game(Board.generate());

// const solver = new MoronSolver(game);
//const solver = new StupidSolver(game);
const solver = new Solver(game);

console.log('Started solving this board:');
console.log(game.initialBoard.toString());
console.time('solver');
solver.solve();
console.timeEnd('solver');

console.log('Started with this board:');
console.log(game.initialBoard.toString());
console.log('Solution in:', game.steps.length ,'steps');

console.log('Validating ...');
const validationGame = new Game(game.initialBoard);
validationGame.replayEntireBoard(game.steps);
console.log('validated:', validationGame.solved());
console.log('Solved board is:');
console.log(validationGame.board.toString());
