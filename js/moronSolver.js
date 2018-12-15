const TinyQueue = require('tinyqueue');
const shuffle = require('./shuffle');

const { ReverseMoves } = require('./board');


//Every 15-puzzle should be solved with less moves
//TODO add other sizes
const MAX_MOVES = 80;

//Stupid internet solver that sucks
//finds *a* solution (not the best solution) and no visited node logic
class MoronSolver {

  constructor(game) {
    this.queue = new TinyQueue([], this.stateComparator);
    this.game = game;
    this.minDist = MAX_MOVES;
  }

  stateComparator(s1, s2) {
    return s1.score - s2.score;
  }


  filterOutBack(previousMoves, nextMoves) {
    if(previousMoves.length > 0) {
      const lastMove = previousMoves[previousMoves.length - 1];
      // filter out opposite directions
      return nextMoves.filter(move => move !== ReverseMoves[lastMove]);
    }
    return nextMoves;
  }

  candidateMoves(previousMoves, nextMoves) {
    //return shuffle(this.filterOutBack(previousMoves, nextMoves));
    return this.filterOutBack(previousMoves, nextMoves);
  }

  nextMoveValid(previousMoves, dist) {
    return previousMoves.length + 1 + dist <= MAX_MOVES;
  }

  enqueueMoveIfValid(lastSteps, nextMove) {
    const dist = this.game.board.distance();
    if(this.nextMoveValid(lastSteps, dist)) {
      this.queue.push({
        steps: lastSteps.concat(nextMove),
        score: dist
      });
    }
  }

  enqueueNextMoves(steps, candidateMoves) {
    for(let move of candidateMoves) {
      this.game.move(move);
      this.enqueueMoveIfValid(steps, move);
      this.game.undoMove(move);
    }
  }

  solveStep(state) {
    if(state.score < this.minDist) {
      this.minDist = state.score;
      // console.log('min distance so far:', this.minDist);
    }
    const lastSteps = this.game.steps;
    if(state && lastSteps) {
      this.game.updateBoardForSteps(state.steps, lastSteps);
    }

    if(this.game.solved()) {
      return true;
    }

    const candidateMoves = this.candidateMoves(state.steps, this.game.validMoves());
    this.enqueueNextMoves(state.steps, candidateMoves);
  }

  solve() {
    if(this.game.solved()) {
      return [];
    }
    
    const candidateMoves = this.candidateMoves(this.game.steps, this.game.validMoves());
    this.enqueueNextMoves(this.game.steps, candidateMoves);
    while(this.queue.length) {
      const solved = this.solveStep(this.queue.pop());
      if(solved) break;
    }

    return this.steps;
  }
}

module.exports = MoronSolver;