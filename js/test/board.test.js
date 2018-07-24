const {Board, X, Moves, END_GRID } = require('../Board');

describe('Board', () => {

  const SAMPLE_GRID = [
     [6,13,7,10],
     [8,9,11,X],
     [15,2,12,5],
     [14,3,1,4],
  ];

  const UNSOLVABLE_GRID = [
     [3,9,1,15],
     [14,11,4,6],
     [13,X,10,12],
     [2,7,8,5],
  ];

  it('knows when board is solved', () => {
    expect(new Board(END_GRID).solved()).to.be.true;
    expect(new Board(SAMPLE_GRID).solved()).to.be.false;
  })

  it('calculates inversions correctly', () => {
    expect(new Board(SAMPLE_GRID).inversions()).to.eq(62);
    expect(new Board(UNSOLVABLE_GRID).inversions()).to.eq(56);
  });

  it('isSolvable works correctly', () => {
    expect(new Board(SAMPLE_GRID).isSolvable()).to.be.true;
    expect(new Board(UNSOLVABLE_GRID).isSolvable()).to.be.false;
  });

  it('equals works', () => {

    const testEnd = [
      [1,2,3,4],
      [5,6,7,8],
      [9,10,11,12],
      [13,14,15,0],
    ];

    const testNotEnd = [
      [1,2,3,4],
      [5,6,7,9],
      [8,10,11,12],
      [13,14,15,0],
    ];
    
    expect(new Board(testEnd).equals(new Board(END_GRID))).to.be.true;
    expect(new Board(testNotEnd).equals(new Board(END_GRID))).to.be.false;
  });


  describe('Distance', () => {
    it('calculates elemDistance', () => {
      const board = new Board(SAMPLE_GRID);
      expect(board.elemDist(6)).to.equal(2);
      expect(board.elemDist(13)).to.equal(4);
      expect(board.elemDist(9)).to.equal(2);
      expect(board.elemDist(12)).to.equal(1)
      expect(board.elemDist(4)).to.equal(3);
    });

    it('calculates total distance', () => {
      const board = new Board(SAMPLE_GRID);
      expect(board.distance()).to.equal(40);
    });

    it('recomputes distance correctly', () => {
      const movedGrid = [
        [6,13,7,10],
        [8,9,11,5],
        [15,2,12,4],
        [14,3,1,X],
      ];

      const board = new Board(SAMPLE_GRID);
      board.move(Moves.DOWN);
      board.move(Moves.DOWN);
      expect(board.distance()).to.equal(38);
      expect(board.distance()).to.equal(board.calcDistance());
      expect(board.distance()).to.equal(new Board(movedGrid).distance());
      
    })
    
  });

  

  describe('Moves', () => {

    it('knows valid moves for start position', () => {
      const board = new Board(SAMPLE_GRID);
      expect(board.validMovesAsStr()).to.eql(['LEFT', 'UP', 'DOWN']);
    });

    it('knows board for start position', () => {
      const board = new Board(SAMPLE_GRID);
      expect(Array.from(board.toBoard())).to.eql([
        [6, 13, 7, 10], 
        [8, 9, 11, 0], 
        [15, 2, 12, 5], 
        [14, 3, 1, 4]
      ]);
    });

    it('moves and validates correctly', () => {
      
      const board = new Board(SAMPLE_GRID);
      
      board.move(Moves.DOWN);
      board.move(Moves.DOWN);
      
      expect(Array.from(board.toBoard())).to.eql([
        [6, 13, 7, 10], 
        [8, 9, 11, 5], 
        [15, 2, 12, 4], 
        [14, 3, 1, 0]
      ]);
      expect(board.validMovesAsStr()).to.eql(['LEFT', 'UP']);


      board.move(Moves.LEFT);
      board.move(Moves.LEFT);
      
      expect(Array.from(board.toBoard())).to.eql([
        [6, 13, 7, 10], 
        [8, 9, 11, 5], 
        [15, 2, 12, 4], 
        [14, 0, 3, 1]
      ]);
      expect(board.validMovesAsStr()).to.eql(['LEFT', 'UP', 'RIGHT']);
      board.move(Moves.LEFT);
      board.move(Moves.UP);
      
      expect(Array.from(board.toBoard())).to.eql([
        [6, 13, 7, 10], 
        [8, 9, 11, 5], 
        [0, 2, 12, 4], 
        [15, 14, 3, 1]
      ]);
      expect(board.validMovesAsStr()).to.eql(['UP', 'RIGHT','DOWN']);


      board.move(Moves.UP);
      board.move(Moves.UP);
      board.move(Moves.RIGHT);

      expect(Array.from(board.toBoard())).to.eql([
        [13, 0, 7, 10], 
        [6, 9, 11, 5], 
        [8, 2, 12, 4], 
        [15, 14, 3, 1]
      ]);
      expect(board.validMovesAsStr()).to.eql(['LEFT', 'RIGHT', 'DOWN']);
    });

  });

}); 