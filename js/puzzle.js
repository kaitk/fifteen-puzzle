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
    [2,6,4,14],
    [10,X,8,3],
    [1,5,15,7],
    [9,13,12,11],
 ];

const MEDIUM_GRID = [
   [2,10,6,3],
   [1,11,X,8],
   [5,13,14,4],
   [9,15,7,12],
];


const solve = (name, SolverClass, game) => {
    const solver = new SolverClass(game);
    console.time(name);
    solver.solve();
    console.timeEnd(name);   
    console.log('Solution in:', game.steps.length ,'steps');
    console.log();
    
    const validationGame = new Game(game.initialBoard);
    validationGame.replayEntireBoard(game.steps);
    console.log('validated:', validationGame.solved());
    // console.log('Solved board is:');
    // console.log(validationGame.board.toString());
}


const easyBoard = new Board(EASY_GRID);
const mediumBoard = new Board(MEDIUM_GRID);
const sampleBoard = new Board(SAMPLE_GRID);
const randomBoard = Board.generate();

const board = mediumBoard;

console.log('Solving this board:');
console.log(board.toString());
console.log('distance', board.distance());

solve('moronSolver', MoronSolver, new Game(board));
solve('stupidSolver', StupidSolver, new Game(board));
solve('solver', Solver, new Game(board));