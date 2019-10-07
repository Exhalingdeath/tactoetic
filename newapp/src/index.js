import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
        console.log("winner",props.winnerSquare);
      return (
        <button className={props.winnerSquare ? 'winner' : 'square'} onClick={props.onClick}>
          {props.value}
        </button>
      );
  }
  
  class Board extends React.Component {
    
    renderSquares() {
        let squares = [];
        let i = 0;
        let counter = 0;
        for(i; i < 3; i++){
            let innerSquares = [];
            let j = 0;
            for(j; j < 3; j++) {
                innerSquares.push(this.renderSquare(counter));
                counter++;
            }
            squares.push(<div key={counter} className='board-row'>{innerSquares}</div>);

        }
        return (
            squares
        );
    }
    renderSquare(i) {
      let winnerSquare = false;
      if(this.props.winnerLine !== null) {
       
        this.props.winnerLine.forEach((value) => {
            if(value === i) winnerSquare = true;
        });
      }
      
      return( 
        <Square key={i}
         value={this.props.squares[i]}
         winnerSquare={winnerSquare} 
         onClick={() => this.props.onClick(i)}
         />
      );
    }
  
    render() {
        return (<div>{this.renderSquares()}</div>);
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares : Array(9).fill(null),
                row : null,
                col : null
            }],
            xisNext : true,
            stepNumber : 0,
            sort : true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
          return;
        }
        squares[i] = this.state.xisNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares,
            col : i % 3 + 1,
            row : Math.floor(i / 3) + 1, 
          }]),
        
          xisNext: !this.state.xisNext,
          stepNumber :history.length,
        });
      }

    jumpTo(step) {
        this.setState({
            stepNumber : step,
            xisNext : (step % 2) === 0,
        })
    }
    sortMoves() {
        this.setState({
            sort : !this.state.sort,
        });
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
       
      
      const moves = history.map((step, move) => {
        const desc = move ? 'Go to move #' + move + ' ('+step.row+', '+step.col+')' : 'Go to game start';
        return (   
            <li key={move}>
                <button onClick={() => this.jumpTo(move)}>{move === this.state.stepNumber ? <b>{desc}</b> : desc}</button>
            </li>
          
        )
      });
      if(!this.state.sort){
        moves.reverse();

      }
      
      let status;
      
     
        if(winner) {
            status = 'Winner: ' + (!this.state.xisNext ? 'X' : 'O');
        }
        else{
            if(this.state.stepNumber > 8) {
                status = 'It is a draw';
            }
            else{
                status = 'Next player: ' + (this.state.xisNext ? 'X' : 'O');
            }
        }
      

      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares = {current.squares}
                winnerLine = {winner}
                onClick={(i) => this.handleClick(i)}
                />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div><button onClick={() => this.sortMoves()}>Sort</button></div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return lines[i];
      }
    }
    return null;
  }
  