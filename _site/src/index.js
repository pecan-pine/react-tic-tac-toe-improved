import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(this.props.numCells ** 2).fill(null),
      xTurn: true,
      newGame: false,
    };
  }
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
        key={i}
      />
    );
  }

  handleClick(i) {
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

  newGame() {
    this.setState({
      squares:Array(this.props.numCells ** 2).fill(null),
      xTurn: true,
    });
  }

  componentDidUpdate() {
    if (this.state.newGame === true){
      this.newGame();
    }
  }

  render() {
    let status ='Next player: ' + (this.state.xTurn ? 'X' : 'O');

    const squares = this.state.squares.slice();
    var winner = calculateWinner(squares);

    if (winner) {
      status = "Winner: " + winner;
    }

    const cellNumList = [];
    for (let i = 0; i < this.props.numCells; i++){
      cellNumList.push(i);
    }

    const renderSquareMatrix = [];
    for (let row = 0; row < this.props.numCells; row++){
      let rowItems = [];
      for (let col = 0; col < this.props.numCells; col++){
        let squareNum = col + row * this.props.numCells;
        rowItems.push(this.renderSquare(squareNum));
      }
      renderSquareMatrix.push(rowItems);
    }

    return (
      <div>
        <div className="status">{status}</div>
        {cellNumList.map((rowNumber) =>
          <div className="board-row" key={rowNumber}>
            {renderSquareMatrix[rowNumber]}
          </div>
        )}

       <br/>

        <button onClick={() => this.newGame()}>New Game</button>
        {this.state.squares.length}
        <br/>
        {this.state.squares}
      </div>
    );
  }
}

class BoardSizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 3,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  render() {
    const numCellsOptions = [];
    for (let i = 0; i < 10; i++){
      numCellsOptions.push(<option value={i} key={i}>{i}</option>);
    }

  return (
    <div className="game">
      <div className="game-board">
        <Board numCells={this.state.value}/>
        <br/>
        <form>
          <label htmlFor="numCells">Choose the board size:</label>
          <select
            name="numCells"
            id="numCells"
            defaultValue={this.state.value}
            onChange={this.handleChange}
          >
            {numCellsOptions}
          </select>
          <br/>
        </form>
      </div>
    </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
        <BoardSizer />
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){
      return squares[a];
    }
  }
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[b] && squares[a] !== squares[b]){
      continue;
    }
    else if (squares[b] && squares[c] && squares[b] !== squares[c]){
      continue;
    }
    else if (squares[a] && squares[c] && squares[a] !== squares[c]){
      continue;
    }
    return null;
  }
  return 'Tie';
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
