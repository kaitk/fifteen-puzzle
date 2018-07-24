const TinyQueue = require('tinyqueue');

const { ReverseMoves } = require('./board');


//Every 15-puzzle should be solved with less moves
//TODO add other sizes
const MAX_MOVES = 80;

//Slightly better than moron, finds best solution
class StupidSolver {

  constructor(game) {
    this.queue = new TinyQueue([], this.stateComparator);
    this.game = game;
    this.maxMoves = MAX_MOVES;
    this.minDist = MAX_MOVES;
  }

  stateComparator(s1, s2) {
    if (s1.dist == s2.dist) {
      return s1.score - s2.score;
    }
    return s1.dist - s2.dist
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
    return this.filterOutBack(previousMoves, nextMoves);
  }

  nextMoveInThreshold(previousMoves, dist) {
    return previousMoves.length + dist < this.maxMoves;
  }


  enqueueMoveIfValid(lastSteps, nextMove) {
    const dist = this.game.distance();
    if(this.nextMoveInThreshold(lastSteps, dist)) {
      const steps = lastSteps.concat(nextMove);
      this.queue.push({
        steps: steps,
        dist: dist,
        score: dist + steps.length 
      });
    }
  }

  enqueueNextMoves(game) {
    const candidateMoves = this.candidateMoves(game.steps, game.validMoves());
    for(let move of candidateMoves) {
      game.move(move);
      this.enqueueMoveIfValid(game.steps, move);
      game.undoMove(move);
    }
  }

  solveStep(state) {
    if(state.dist < this.minDist) {
      this.minDist = state.dist;
      console.log('min distance so far:', this.minDist);
    }
    //validate move still within threshold
    if(this.maxMoves != MAX_MOVES) {
      if(state.dist >= this.maxMoves) {
        return true; //break loop, no further solutions possible
      }
      if(state.score >= this.maxMoves) {
        return false; // prune but continue loop
      }
    }

    const lastSteps = this.game.steps;
    if(state && lastSteps) {
      this.game.updateBoardForSteps(state.steps, lastSteps);
    }

    if(this.game.solved()) {
      this.maxMoves = this.game.steps.length;
      this.bestSolution = this.game.steps;
      return false; // continue loop
    }

    this.enqueueNextMoves(this.game);
  }

  solve() {
    if(this.game.solved()) {
      return [];
    }
    
    this.enqueueNextMoves(this.game);
    while(this.queue.length) {
      if(this.solveStep(this.queue.pop())) {
        break;
      }
    }

    this.game.updateBoardForSteps(this.bestSolution);
    return this.bestSolution;
  }
}

module.exports = StupidSolver;