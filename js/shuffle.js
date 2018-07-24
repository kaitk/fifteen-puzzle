function randInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(array) {
    let elem;
    for (let idx = array.length - 1; idx > 0; idx--) {
        let randIdx = randInt(idx + 1);
        let elem = array[idx];
        array[idx] = array[randIdx];
        array[randIdx] = elem;
    }
    return array;
}


module.exports = shuffle;