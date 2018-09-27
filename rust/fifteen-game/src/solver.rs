use game::{MAX_MOVES, Game};

pub struct Solver {
    game: Game,
    min_dist: i32
    // TODO priority queue
}

impl Solver {
    pub fn new(game: Game) -> Solver {
        Solver {
            game,
            min_dist: MAX_MOVES
        }
    }
}