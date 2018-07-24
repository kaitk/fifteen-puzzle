const { Board, END_GRID, X } = require('../board');
const Game = require('../game');
const MoronSolver = require('../moronSolver');

const IDIOT_GRID = [
   [2,X,3,4],
   [1,6,7,8],
   [5,10,11,12],
   [9,13,14,15],
];

const RETARD_GRID = [
   [2,6,3,4],
   [1,10,7,8],
   [5,11,14,X],
   [9,13,15,12],
];


describe('MoronSolver', () => {

   it('Solves solved puzzle in 0 steps', () => {
      const game = new Game(new Board(END_GRID));

      new MoronSolver(game).solve();

      expect(game.solved()).to.be.true;
      expect(game.steps).to.eql([]);
   });

   it('Solves solves Idiot-grid in 7 steps', () => {
      const game = new Game(new Board(IDIOT_GRID));

      new MoronSolver(game).solve();

      expect(game.solved()).to.be.true;
      expect(game.board.equals(new Board(END_GRID))).to.be.true;
      expect(game.steps.length).to.eql(7);
   });

   it('Solves solves Retard-grid in 13 steps', () => {
      const game = new Game(new Board(RETARD_GRID));

      new MoronSolver(game).solve();

      expect(game.solved()).to.be.true;
      expect(game.board.equals(new Board(END_GRID))).to.be.true;
      expect(game.steps.length).to.eql(13);
   });

});



// Optimizations ... if inversion is 0 just move X to last?
// MAX moves is 80
// NO more moves should be required than the sum of distances
