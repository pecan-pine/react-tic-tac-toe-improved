import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// base square for the game
// the onClick is inherited from the Board class
function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {/*store null, 'X', or 'O'*/}
      {props.value}
    </button>
  );
}

function squareMatrixConstructor(sideLength) {
  let squareMatrix = [];
  for (let row = 0; row < sideLength; row++){
    let rowItems = [];
    for (let col = 0; col < sideLength; col++){
      rowItems.push(["(",row, col,")"], null);
    }
    rowItems.push(<br key={row}/>);
    squareMatrix.push(rowItems);
  }
  console.log(squareMatrix);
  return squareMatrix;
}

// the board and control buttons

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xTurn: true,
    };

    this.changeSize = this.changeSize.bind(this);
  }

  // draw a square with value squares[i]
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.squareClick(i)}
        key={i}
      />
    );
  }

  // if a square has not been filled already,
  // and no-one has won, fill in the square with
  // either 'X' or 'O', depending on whose turn it is
  squareClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xTurn ? 'X' : 'O';
    this.setState({
      squares: squares,
      xTurn: !this.state.xTurn,
    });
  }

  // change size of the board using a select menu
  // gives the board a new blank array of the desired size
  changeSize(event) {
    this.setState({
      squares: Array(event.target.value ** 2).fill(null),
      xTurn: true,
    })
  }

  // make a new game by re-setting squares to be an empty array
  newGame() {
    const squaresLength = this.state.squares.length
    this.setState({
      squares:Array(squaresLength).fill(null),
      xTurn: true,
    });
  }

  render() {
    // display who is the next player
    let status ='Next player: ' + (this.state.xTurn ? 'X' : 'O');

    // copy of squares
    const squares = this.state.squares.slice();
    // number of cells along one side of the square
    const numCells = Math.sqrt(squares.length);

    // see if there is a winner yet
    // if so, change the status to display the winner
    var winner = calculateWinner(squares);
    if (winner) {
      status = "Winner: " + winner;
    }

    // make a list [0,1,2,3, ... ]
    // to label the squares with
    const cellNumList = [];
    for (let i = 0; i < Math.sqrt(this.state.squares.length); i++){
      cellNumList.push(i);
    }

    // matrix with rows like [this.renderSquare(0), this.rendersquare(1), ...]
    // this will be used to make the square board
    const renderSquareMatrix = [];
    for (let row = 0; row < Math.sqrt(this.state.squares.length); row++){
      let rowItems = [];
      for (let col = 0; col < Math.sqrt(this.state.squares.length); col++){
        // each new row increments by the side-length of the square
        let squareNum = col + row * Math.sqrt(this.state.squares.length);
        rowItems.push(this.renderSquare(squareNum));
      }
      renderSquareMatrix.push(rowItems);
    }

    // give 10 options for cell numbers
    const numCellsOptions = [];
    for (let i = 0; i < 10; i++){
      numCellsOptions.push(<option value={i} key={i}>{i}x{i}</option>);
    }

    return (
      <div id="fullBoard">
        <div id="mainBoard" style={{float: "left"}}>
        {/*display the current status of the game */}
        <div className="status">{status}</div>
        {/*display the board squares*/}
        {cellNumList.map((rowNumber) =>
          <div className="board-row" key={rowNumber}>
            {renderSquareMatrix[rowNumber]}
          </div>
        )}
        </div>

       <br/>

       <div id="boardControls" style={{float: "right"}}>
        <button onClick={() => this.newGame()}>New Game</button>
        <br/>
        <label htmlFor="numCells">Choose the board size:</label>
        <br/>
        <select
          name="numCells"
          id="numCells"
          defaultValue={numCells}
          onChange={this.changeSize}
        >
          {numCellsOptions}
        </select>
        <br/>
      </div>
    </div>
    );
  }
}

function calculateWinner(squares) {
  const sideLength = Math.sqrt(squares.length);
  const lines = [];

  if (sideLength == 0){
    return 'X';
  }

  // arrays to store diagonal and counter diagonal lines
  const diagonal = [];
  const counterDiagonal = [];

  // put all lines in the list lines
  for (let i = 0; i < sideLength; i++){
    // get vertical and horizontal lines
    let verticalLine = [];
    let horizontalLine = [];
    for (let j = 0; j < sideLength; j++){
      verticalLine.push(i + j * sideLength);
      horizontalLine.push(i * sideLength + j);
    }
    lines.push(verticalLine);
    lines.push(horizontalLine);

    // get diagonal lines
    diagonal.push(i * (sideLength + 1));
    counterDiagonal.push(sideLength - 1 + i * (sideLength - 1));
  }
  lines.push(diagonal);
  lines.push(counterDiagonal);

  // determine if there is a winner
  for (let i = 0; i < lines.length; i++) {
    const lineCoords = lines[i];
    // list of values at the line coordinate positions
    const lineVals = lineCoords.map(coord => squares[coord]);

    // if the entry on the end is non-null and all other entries are
    // equal to it, someone has won
    if (lineVals[0] && lineVals.every( (val) => val === lineVals[0])){
      return lineVals[0];
    }
  }

  // check if there is a tie
  // (this could be made more strict, i.e. if it is X's turn
  // and the only open line has an O in it, the program will wait until
  // X makes a move to declare a tie)

  // if the board is 2x2 or smaller, there is no way to have a tie
  if (squares.length < 9){
    return null;
  }

  
  for (let i = 0; i < lines.length; i++) {
    const lineCoords = lines[i];
    const lineVals = lineCoords.map(coord => squares[coord]);

    let pairs = [];
    for (let a = 0; a < lines.length - 1; a++){
      for (let b = a + 1; b < lines.length; b++){
        pairs.push([lineVals[a], lineVals[b]]);
      }
    }
    // if there is a pair of non-null squares with non-equal values,
    // then this line (line i) cannot be won. Skip to the next line
    if (pairs.some(
      (pair) => pair[0] && pair[1] && pair[0] !== pair[1]
    )) {
      continue;
    }
    // if the line is not bad, someone could still win the game
    return null;
  }
  // if all lines are bad, it is a tie
  return 'Tie';
}

// ========================================

ReactDOM.render(
  <Board/>,
  document.getElementById('root')
);
