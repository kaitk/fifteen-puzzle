use rand::{thread_rng, Rng};

const DIM: usize = 4; // TODO hardcoded for now, dynamic needs SmallVec
const FLAT_DIM: usize = DIM * DIM;
const X: u8 = 0;

const FLAT_END_GRID: [u8; 16] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, X];

// pub const MOVES_AS_STR: [&str; 4] = ["LEFT", "UP", "RIGHT", "DOWN"];

#[allow(dead_code)]
pub enum Moves {
    LEFT,
    UP,
    RIGHT,
    DOWN
}

#[derive(Debug)]
#[allow(dead_code)]
pub struct SixteenBoard {
    dim: usize,
    flat: [u8; 16],
    dist: u32,
}

pub fn flatten(grid: [[u8; DIM]; DIM]) -> [u8; FLAT_DIM] {
    let mut flat: [u8; FLAT_DIM] = [0; FLAT_DIM];
    for (idx, elem) in grid.iter().flatten().enumerate() {
        flat[idx] = *elem;
    }
    flat
}

impl SixteenBoard {
    pub fn new(board: [u8; FLAT_DIM]) -> SixteenBoard {
        SixteenBoard {
            dim: board.len(),
            flat: board,
            dist: 0,
        }
    }

    pub fn print(&self) {
        println!("The flat array is: {:?}", self.flat);
    }

    pub fn shuffle_test(&self) {
        let mut flat = self.flat;
        thread_rng().shuffle(&mut flat);
        println!("Shuffled: {:?}", flat);
    }

    pub fn solved(&self) -> bool {
        self.flat == FLAT_END_GRID
    }
}


#[cfg(test)]
mod tests {

    use board::{flatten, SixteenBoard};
    use grids::{EASY_GRID, END_GRID};

    #[test]
    fn it_considers_sovled_board_solved() {
        let solved = SixteenBoard::new(flatten(END_GRID));
        assert!(solved.solved());
    }

    #[test]
    fn it_considers_initial_board_unsolved() {
        let easy = SixteenBoard::new(flatten(EASY_GRID));
        assert!(!easy.solved());
    }
}