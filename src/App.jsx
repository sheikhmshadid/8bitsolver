import React, { useState, useEffect } from 'react';
import './App.css';

//used to create 3x3 grid
const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

//solved state conditions
const SOLVED_STATE = [...Array(TILE_COUNT - 1).keys()].map(i => i + 1);
SOLVED_STATE.push(0); // [1, 2, 3, 4, 5, 6, 7, 8, 0]


function App() {
  const [tiles, setTiles] = useState([...SOLVED_STATE]);
  const [isSolved, setIsSolved] = useState(true);

  //checks if current board can be solved
  const isSolvable = (tiles) => {
    let inversions = 0;
    const puzzle = tiles.filter(t => t !== 0);
    for (let i = 0; i < puzzle.length - 1; i++) {
      for (let j = i + 1; j < puzzle.length; j++) {
        if (puzzle[i] > puzzle[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  // shuffles tiles and checks if randomized tiles solvable
  const shuffleTiles = () => {
    let newTiles;
    
    do {
      newTiles = [...SOLVED_STATE]
        .sort(() => Math.random() - 0.5); 
    } 

    while (!isSolvable(newTiles)); 
    setTiles(newTiles);
    setIsSolved(false);
  };

  //shuffles on launch
  useEffect(() => {
    shuffleTiles();
  }, []);

  // checks if game is solved
  const checkSolved = (currentTiles) => {
    const solved = currentTiles.every((val, index) => val === SOLVED_STATE[index]);
    setIsSolved(solved);
  };

  //handles when you click on a tile
  const handleTileClick = (clickedIndex) => {
    if (isSolved) return;

    const emptyIndex = tiles.indexOf(0);
    
    //separates grid into rows and columns
    const clickedRow = Math.floor(clickedIndex / GRID_SIZE);
    const clickedCol = clickedIndex % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    // checks for adjacency (manhattan distance of 1)
    const isAdjacent = Math.abs(clickedRow - emptyRow) + Math.abs(clickedCol - emptyCol) === 1;

    if (isAdjacent) {
      //swap the clicked tile with the empty tile
      const newTiles = [...tiles];
      [newTiles[clickedIndex], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[clickedIndex]];
      
      setTiles(newTiles);
      checkSolved(newTiles);
    }
  };

  return (
    <div className="app">
      <h1>8 Bit Solver</h1>

      <button className="generate-button" onClick={shuffleTiles}>
        Generate New Puzzle
      </button>

      <button className="solve-button" onClick={shuffleTiles}>
        Solve
      </button>
      
      <div className="board">
        
        {/*board with 8 tiles and empty space*/}
        {SOLVED_STATE.slice(0, -1).map(tileValue => {
          const index = tiles.indexOf(tileValue);
          const row = Math.floor(index / GRID_SIZE);
          const col = index % GRID_SIZE;

          //calculates position of each tile
          const style = {
            transform: `translate3d(${col * 105}px, ${row * 105}px, 0)`,
          };

          return (
            <div
              key={tileValue}
              className="tile"
              style={style}
              onClick={() => handleTileClick(index)}
            >
              {tileValue}
            </div>
          );
        })}
      </div>

      {isSolved && <div className="solved-message">You Win! </div>}
    </div>
  );
}

export default App;