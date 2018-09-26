use rand::{thread_rng, Rng};
use num::{abs, Integer};
use smallvec::SmallVec;


const DIM: usize = 4;
// TODO hardcoded for now, dynamic needs SmallVec
const FLAT_DIM: usize = DIM * DIM;
const X: u8 = 0;

const FLAT_END_GRID: [u8; 16] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, X];

// pub const MOVES_AS_STR: [&str; 4] = ["LEFT", "UP", "RIGHT", "DOWN"];

#[derive(Debug)]
#[derive(PartialEq)]
pub enum Moves {
    LEFT,
    UP,
    RIGHT,
    DOWN,
}

#[derive(Debug)]
pub struct SixteenBoard {
    flat: [u8; 16],
    dist: i32,
    x_idx: usize,
}

pub fn flatten(grid: [[u8; DIM]; DIM]) -> [u8; FLAT_DIM] {
    let mut flat: [u8; FLAT_DIM] = [0; FLAT_DIM];
    for (idx, elem) in grid.iter().flatten().enumerate() {
        flat[idx] = *elem;
    }
    flat
}

fn calc_distance(flat: [u8; FLAT_DIM]) -> i32 {
    return flat
        .iter().enumerate()
        .fold(0, |sum, (idx, elem)| sum + elem_idx_distance(*elem, idx));
}

fn elem_idx_distance(elem: u8, idx: usize) -> i32 {
    if elem == 0 {
        return 0;
    }

    let end_idx: i32 = (elem as i32) - 1;
    let dim = DIM as i32;
    let idx = idx as i32;

    let col_dist: i32 = abs(idx.div_floor(&dim) - end_idx.div_floor(&dim));
    let row_dist: i32 = abs((end_idx % dim) - (idx % dim));
    col_dist + row_dist
}

fn elem_inversions(elem: u8, idx: usize, flat: [u8; 16]) -> i32 {
    let mut invs = 0;
    if elem < 2 {
        return 0;
    }

    for i in idx + 1..flat.len() {
        let other = flat[i];
        if other != X && elem > other {
            invs += 1;
        }
    }
    return invs;
}

fn is_solvable(dim: usize, inversions: i32, x_idx: usize) -> bool {
    if dim % 2 == 1 {
        // Only solvable if inversions is even
        return inversions % 2 == 0;
    }

    let dim = dim as i32;
    // Odd is solvable when inversions is even and vice versa.
    // Works as index is 0 based.
    let row_of_empty: i32 = (x_idx as i32).div_floor(&dim);
    (inversions % 2) + (row_of_empty % 2) == 1
}

fn index_of(flat: [u8; 16], elem: u8) -> usize {
    flat.iter().position(|&e| e == elem).unwrap()
}

impl SixteenBoard {
    pub fn new(flat: [u8; FLAT_DIM]) -> SixteenBoard {
        SixteenBoard::new_with_dist(flat, calc_distance(flat))
    }

    pub fn new_with_dist(flat: [u8; FLAT_DIM], dist: i32) -> SixteenBoard {
        SixteenBoard { flat, dist, x_idx: index_of(flat, X) }
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

    fn inversions(&self) -> i32 {
        self.flat.iter().enumerate()
            .fold(0, |sum, (idx, elem)| sum + elem_inversions(*elem, idx, self.flat))
    }

    fn is_solvable(&self) -> bool {
        is_solvable(DIM, self.inversions(), self.x_idx)
    }

    fn elem_distance(&self, elem: u8) -> i32 {
        elem_idx_distance(elem, self.index(elem))
    }

    fn calc_distance(&self) -> i32 {
        calc_distance(self.flat)
    }

    fn index(&self, elem: u8) -> usize {
        index_of(self.flat, elem)
    }

    // Moves
    fn valid_moves(&self) -> SmallVec<[Moves; 4]> {
        let mut moves = SmallVec::new();
        println!("x_idx {}, DIM {}, right: {}", self.x_idx, DIM, (self.x_idx + 1) % DIM);
        if self.x_idx % DIM != 0 {
            moves.push(Moves::LEFT);
        }
        if self.x_idx > DIM {
            moves.push(Moves::UP);
        }
        if (self.x_idx + 1) % DIM != 0 {
            moves.push(Moves::RIGHT);
        }
        if self.x_idx < DIM * (DIM - 1) {
            moves.push(Moves::DOWN);
        }
        moves
    }
}


#[cfg(test)]
mod tests {
    use super::*;
    use grids::{EASY_GRID, END_GRID, SAMPLE_GRID, UNSOLVABLE_GRID};

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

    #[test]
    fn finds_indeces() {
        let sample = SixteenBoard::new(flatten(SAMPLE_GRID));
        assert_eq!(sample.index(6), 0);
        assert_eq!(sample.index(13), 1);
        assert_eq!(sample.index(9), 5);
        assert_eq!(sample.index(12), 10);
        assert_eq!(sample.index(4), 15);
    }


    #[test]
    fn calculates_elem_distance() {
        let sample = SixteenBoard::new(flatten(SAMPLE_GRID));
        assert_eq!(sample.elem_distance(6), 2);
        assert_eq!(sample.elem_distance(13), 4);
        assert_eq!(sample.elem_distance(9), 2);
        assert_eq!(sample.elem_distance(12), 1);
        assert_eq!(sample.elem_distance(4), 3);
    }


    #[test]
    fn calculates_distance() {
        let solved = SixteenBoard::new(flatten(END_GRID));
        let easy = SixteenBoard::new(flatten(EASY_GRID));
        let sample = SixteenBoard::new(flatten(SAMPLE_GRID));

        assert_eq!(solved.calc_distance(), 0);
        assert_eq!(easy.calc_distance(), 17);
        assert_eq!(sample.calc_distance(), 40);
    }

    #[test]
    fn calculates_inversions() {
        let sample = SixteenBoard::new(flatten(SAMPLE_GRID));
        let unsolvable = SixteenBoard::new(flatten(UNSOLVABLE_GRID));
        assert_eq!(sample.inversions(), 62);
        assert_eq!(unsolvable.inversions(), 56);
    }

    #[test]
    fn validates_solvable() {
        let sample = SixteenBoard::new(flatten(SAMPLE_GRID));
        let unsolvable = SixteenBoard::new(flatten(UNSOLVABLE_GRID));

        assert!(sample.is_solvable());
        assert!(!unsolvable.is_solvable());
    }

    #[test]
    fn valid_moves_of_staring_position() {
        let sample = SixteenBoard::new(flatten(SAMPLE_GRID));
        let expected: SmallVec<[Moves; 4]> = smallvec![Moves::LEFT, Moves::UP, Moves::DOWN];
        assert_eq!(sample.valid_moves(), expected);
    }
}