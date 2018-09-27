use board::{Move, SixteenBoard};
use smallvec::SmallVec;

pub const MAX_MOVES: i32 = 80;

#[allow(dead_code)]
pub struct Game {
    initial_board: SixteenBoard,
    board: SixteenBoard,
    steps: SmallVec<[Move; 128]>,
}

impl Game {
    pub fn new(board: SixteenBoard) -> Game {
        Game {
            initial_board: board,
            board: board.clone(),
            steps: SmallVec::with_capacity(MAX_MOVES as usize)
        }
    }

    pub fn move_board_to_state(&mut self, steps: SmallVec<[Move; 128]>) {
        for step in steps {
            self.board.move_elem(step);
        }
        // TODO FIXME: this is needed
        // self.steps = steps;
    }

    pub fn replay_entire_board(&mut self, steps: SmallVec<[Move; 128]>) {
        self.board = self.initial_board.clone();
        self.move_board_to_state(steps);
    }

    pub fn distance(&self) -> i32 {
        return self.board.dist();
    }

    pub fn move_elem(&mut self, move_type: Move) {
        self.board.move_elem(move_type);
    }

    pub fn undo_move(&mut self, move_type: Move) {
        self.board.reverse_move(move_type);
    }

    pub fn solved(&self) -> bool {
        return self.board.solved();
    }

    pub fn valid_moves(&self) -> SmallVec<[Move; 4]> {
        return self.board.valid_moves();
    }
}
