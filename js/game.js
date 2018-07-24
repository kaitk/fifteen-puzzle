const { Board, Moves, MovesAsStr, ReverseMoves } = require('./board');

//FIXME disabled for now, buggy!
const PARTIAL_REPLAY_TRESHOLD = 90;

class Game {

  constructor(board) {
    this.initialBoard = board;
    this.board = board.clone();
    this.steps = [];
  }

  
  moveBoardToState(board, steps) {
    for(let step of steps) {
      board.move(step);
    }
  }

  lastSameMoveIdx(steps, lastSteps) {
    const length = Math.min(lastSteps.length, steps.length);
    for(let i = 0; i < length; i++) {
      if(lastSteps[i] !== steps[i]) {
        return i;
      }
    }
    return length - 1;
  }


  diffSteps(steps, lastSteps, lastSameMoveIdx) {
    const moves = [];
    for(let i = lastSteps.length - 1; i > lastSameMoveIdx; i--) {
      moves.push(lastSteps[i]);
    }
    for(let i = lastSameMoveIdx + 1; i < steps.length; i++) {
      moves.push(steps[i]);
    }
    return moves;
  }

  replayEntireBoard(steps) {
    this.board = this.initialBoard.clone();
    this.moveBoardToState(this.board, steps);
    this.steps = steps;
  }

  undoAndReplayPartially(steps, lastSteps, lastSameMoveIdx) {
    const diffSteps = this.diffSteps(steps, lastSteps, lastSameMoveIdx);
    this.moveBoardToState(this.board, diffSteps);
    this.steps = steps;
  }

  updateBoardForSteps(steps, lastSteps) {
    if(!lastSteps || steps.length < PARTIAL_REPLAY_TRESHOLD) {
      this.replayEntireBoard(steps);
    } else {
      const lastSameMoveIdx = this.lastSameMoveIdx(steps, lastSteps);
      const diffMoveCount = lastSteps.length - lastSameMoveIdx + steps.length - lastSameMoveIdx;
      if(diffMoveCount < steps.length) {
        this.undoAndReplayPartially(steps, lastSteps, lastSameMoveIdx);
      } else {
        this.replayEntireBoard(steps);
      }

    }
  }

  updateBoardForGrid(grid, dist, steps) {
    this.board = new Board(grid, true);
    this.steps = steps;
  }

  stepsAsStr() {
    return this.steps.map(m => MovesAsStr[m]);
  }

  //DELEGATES

  distance() {
    return this.board.dist;
  }

  move(move) {
    this.board.move(move);
  }

  undoMove(move) {
    this.board.move(ReverseMoves[move]);
  }

  solved() {
    return this.board.solved();
  }

  validMoves() {
    return this.board.validMoves();
  }

  grid() {
    return new Uint8Array(this.board.flat);
  }

}

module.exports = Game;