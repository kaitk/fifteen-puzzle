const shuffle = require('./shuffle');

const DIM = 4;
const X = 0;

const END_GRID = [
   [1,2,3,4],
   [5,6,7,8],
   [9,10,11,12],
   [13,14,15,X],
];


function flatten(board) {
  return board.reduce((result, row) => result.concat(row), []);
}

const FLAT_END_GRID = new Uint8Array(flatten(END_GRID));

const MovesAsStr = ['LEFT', 'UP', 'RIGHT', 'DOWN'];

const Moves = {
  LEFT: 0,
  UP: 1,
  RIGHT: 2,
  DOWN: 3
}

const ReverseMoves = [2,3,0,1];

// fixed for 15-puzzle for now
// TODO maybe keep the board flattened always?
class Board {

  static generate() {
    let board;
    do {
      // shuffled in place
      const flatBoardArray = shuffle(Array.from(FLAT_END_GRID));
      board = new Board(flatBoardArray, true);
    } while(board.isSolvable());
    return board;
  }

  // board as a 2D array
  // dim currently only tested for 4
  // we'll always keep the board flattened for easier use
  constructor(board, flat = false, dist = -1) {
    if(flat) {
      this.dim = Math.sqrt(board.length);
      this.flat = new Uint8Array(board);
    } else {
      this.dim = board.length;
      this.flat = new Uint8Array(flatten(board));  
    }
    this.dist = dist !== -1 ? dist : this.calcDistance();
  }

  clone() {
    return new Board(this.flat, true, this.dist);
  }

  toBoard() {
    const board = new Array(4).fill([]);
    return board.map((row, idx) => {
      const uint18Slice = this.flat.slice(idx * this.dim, (idx + 1) * this.dim);
      return Array.from(uint18Slice);
    });
  }

  toString() {
    const border = () => '-'.repeat(this.dim * 3);  
    const suffix = (idx) => (idx + 1) % this.dim ? ', ' : '\n';
    const reducer = (str, e, idx) => str + (e == X ? '-' : e) + suffix(idx)
    return border() + '\n' + 
      this.flat.reduce(reducer, '')
      + border();
  }

  equals(other) {
    return this.flat.every((elem, idx) => elem == other.flat[idx]);
  }

  solved() {
    return this.flat.every((elem, idx) => elem == FLAT_END_GRID[idx]);;
  }

  elemDist(elem, idx) {
    idx = idx || this.flat.indexOf(elem);
    const endIdx = elem - 1;
    const colDist = Math.abs(Math.floor(idx / this.dim) - Math.floor(endIdx / this.dim));
    const rowDist = Math.abs(endIdx % this.dim - idx % this.dim);
    return colDist + rowDist;
  }

  calcDistance() {
    return this.flat.reduce(
      (sum, elem, idx) => sum + (elem === X ? 0 : this.elemDist(elem, idx)),
    0);
  }

  distance() {
    return this.dist;
  }

  elemInversions(elem, idx, array) {
    let invs = 0;
    if(elem < 2) return 0;
    for(let i = idx + 1; i < array.length; i++) {
      const other = array[i];
      if(other !== X && elem > other) {
        invs += 1;
      }
    }
    return invs;
  }

  // TODO calc inversions?
  inversions(flat = this.flat) {
    return flat
      .map(this.elemInversions)
      .reduce((acc, inv) => acc + inv);
  }

  isSolvable() {
    if(this.dim % 2 == 1) {
      // Only solvable if invesrions is even
      return this.inversions() % 2 == 0;
    }
    // Odd is solvable when inversions is even and vice versa.
    // Works as index is 0 based.
    const rowOfEmpty = Math.floor(this.flat.indexOf(X) / this.dim);
    return (this.inversions() % 2) + (rowOfEmpty % 2) == 1;
  }

  swap(idx1, idx2) {
    const elem = this.flat[idx1];
    this.flat[idx1] = this.flat[idx2];
    this.flat[idx2] = elem;
  }

  validMoves() {
    const xIdx = this.flat.indexOf(X);
    const moves = [];
    if(xIdx % 4) {
      moves.push(Moves.LEFT);
    }
    if(xIdx > this.dim) {
      moves.push(Moves.UP);
    }
    if((xIdx + 1) % 4) {
      moves.push(Moves.RIGHT);
    }
    if(xIdx < this.dim * (this.dim - 1)) {
      moves.push(Moves.DOWN);
    }
    return moves;
  }


  moveIdx(move, xIdx) {
    if(move === Moves.LEFT) {
      return xIdx - 1;
    }
    else if(move === Moves.UP) {
      return xIdx - this.dim;
    }
    else if(move === Moves.RIGHT) {
      return xIdx + 1;
    }
    else if(move === Moves.DOWN) {
      return xIdx + this.dim;
    }
  }

  validMovesAsStr() {
    return this.validMoves().map(m => MovesAsStr[m]);
  }

  move(move) {
    const xIdx = this.flat.indexOf(X);
    const moveIdx = this.moveIdx(move, xIdx);
    // console.log('move', move, MovesAsStr[move], 'xIdx', xIdx, 'toIdx', moveIdx);
    this.updateDist(xIdx, moveIdx);
    this.swap(xIdx, moveIdx);
  }

  updateDist(xIdx, moveIdx) {
    const elem = this.flat[moveIdx];
    const nextElemDist = this.elemDist(elem, xIdx);
    const curElemDist = this.elemDist(elem, moveIdx);
    this.dist = this.dist - curElemDist + nextElemDist;
  }
}


module.exports = {
  X,
  END_GRID,
  Moves,
  MovesAsStr,
  ReverseMoves,
  Board
};
