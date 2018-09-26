extern crate rand;

use board::{flatten, SixteenBoard};

mod board;
mod grids;

const EASY_GRID: [[u8; 4]; 4] = [
    [2, 0, 6, 3],
    [1, 10, 8, 4],
    [5, 11, 7, 14],
    [9, 13, 15, 12],
];

const END_GRID: [[u8; 4]; 4] = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0],
];


fn main() {
    let solved = SixteenBoard::new(flatten(END_GRID));
    solved.print();
    println!("Is the board solved? {}", solved.solved());
    solved.shuffle_test();

    let easy = SixteenBoard::new(flatten(EASY_GRID));
    easy.print();
    println!("Is the board solved? {}", easy.solved());
    easy.shuffle_test();
}
