import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = .5 }) {

  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    // create array-of-arrays of true/false values
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      let boardRow = [];
      for (let x = 0; x < ncols; x++) {
        if (Math.random() < chanceLightStartsOn) {
          boardRow.push(true);
        } else {
          boardRow.push(false);
        }
      };
      initialBoard.push(boardRow);
    }
    return initialBoard;
  };

  function hasWon() {
    // check the board in state to determine whether the player has won.
    console.log("hasWon board -> ", board);
    return board.every(row => row.every(cell => cell === false));
  };

  function flipCellsAround(coord) {

    let coordId = coord.target.id
    console.log("coordId -> ", coordId);

    setBoard(oldBoard => {
      const [y, x] = coordId.split("-").map(Number);
      console.log("y, x ->", y, x);

      const flipCell = (y, x, boardCopy) => {

        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        };
      };

      // Make a (deep) copy of the oldBoard
      let newBoard = oldBoard.map(row => [...row]);

      // in the copy, flip this cell and the cells around it
      flipCell(y, x, newBoard);
      flipCell(y + 1, x, newBoard);
      flipCell(y - 1, x, newBoard);
      flipCell(y, x - 1, newBoard);
      flipCell(y, x + 1, newBoard);

      // return the copy
      return newBoard;
    });
  };

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return (
      <div>
        <p>You win!</p>
      </div>
    );
  };

  //make board table
  let tableBoard = board.map((row, rowIndx) => {
    return (
    <tr key={`${rowIndx}`}>
      {row.map((cell, cellIndx) =>
        <Cell key={`${rowIndx}${cellIndx}`}
          flipCellsAroundMe={flipCellsAround}
          isLit={cell}
          id={`${rowIndx}-${cellIndx}`} />)}
    </tr>
    );
  });

  return (
    <div className="Board">
      <table>
        <tbody>
          {tableBoard}
        </tbody>
      </table>
    </div>
  );

}

export default Board;
