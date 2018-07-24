const TinyQueue = require('tinyqueue');
const shuffle = require('./shuffle');

const { ReverseMoves } = require('./board');


//Every 15-puzzle should be solved with less moves
//TODO add other sizes
const MAX_MOVES = 80;

//Djikstra solver (hopefully A* soon) with correct visited node count 
class Solver {

  constructor(game) {
    this.queue = new TinyQueue([], this.stateComparator);
    this.visited = {};
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
    return shuffle(this.filterOutBack(previousMoves, nextMoves));
  }

  nextMoveInThreshold(previousMoves, dist) {
    return previousMoves.length + dist < this.maxMoves;
  }


  enqueueMoveIfValid(game, nextMove) {
    const dist = game.distance();
    if(this.nextMoveInThreshold(game.steps, dist)) {
      const grid = game.grid();
      const visitedDist = this.visited[grid.toString()];
      if(!visitedDist || dist <= visitedDist) {
        const steps = game.steps.concat(nextMove);
        this.queue.push({
          grid: grid,
          steps: steps,
          dist: dist,
          score: dist + steps.length
        });
        this.visited[grid.toString()] = dist;
      }
    }
  }

  enqueueNextMoves(game) {
    const candidateMoves = this.candidateMoves(game.steps, game.validMoves());
    for(let move of candidateMoves) {
      game.move(move);
      this.enqueueMoveIfValid(game, move);
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

    // this.game.updateBoardForSteps(state.steps);
    this.game.updateBoardForGrid(state.grid, state.dist, state.steps);

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

module.exports = Solver;