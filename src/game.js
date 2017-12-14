import React, {Component} from 'react';
import _ from 'underscore';
import ReactDOM from 'react-dom';

import Header from './header';
import Board from './board';

export class Game extends Component {
  constructor(props) {
    super(props);

    this.numBombs = 4;
    this.gridSize = 8;

    this.state = this.defaultState;
  }
  get defaultState() {
    let cells =
      _.range(this.gridSize * this.gridSize).map((idx) => (
        {
          x: idx % this.gridSize,
          y: Math.floor(idx / this.gridSize),
          dist: 0,
          hasBomb: false,
          isCovered: true
        }
      ));

    let bombIndicies =
      this.props.bombIdx ?
      this.props.bombIdx :
      _.shuffle(_.range(cells.length)).slice(0, this.numBombs);
    for (let idx of bombIndicies)
      cells[idx].hasBomb = true;

    const distHelper = (x, y) => {
      const cell = cells[x + y * this.gridSize];
      if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize)
        return 0;
      return cell.hasBomb ? 1 : 0;
    };
    for (let cell of cells) {
      cell.dist = 0;
      if (cell.hasBomb) continue;
      cell.dist += distHelper(cell.x + -1, cell.y + -1);
      cell.dist += distHelper(cell.x + 0, cell.y + -1);
      cell.dist += distHelper(cell.x + 1, cell.y + -1);

      cell.dist += distHelper(cell.x + -1, cell.y + 0);
      cell.dist += distHelper(cell.x + 1, cell.y + 0);

      cell.dist += distHelper(cell.x + -1, cell.y + 1);
      cell.dist += distHelper(cell.x + 0, cell.y + 1);
      cell.dist += distHelper(cell.x + 1, cell.y + 1);
    }

    return {
      cells: cells,
      isActive: true,
      isWinner: false
    };
  }
  cellClick(e) {
    let idx = e.idx;

    console.log(e)

    delete e.idx;

    let isShift = e.shiftKey

    if (!this.state.isActive) return;

    let cells = this.state.cells.slice();
    let cell = cells[idx];
    cell.isCovered = false;
    this.setState({cells});

    if (cell.hasBomb && isShift) cell.isFlagged = true

    if (!cell.hasBomb && cell.dist === 0)
      this.cellChainReveal(cell.x, cell.y);

    for (let cell of this.state.cells) {
      if (cell.hasBomb && !cell.isCovered && ! cell.isFlagged) {
        this.setState({isActive: false, isWinner: false});
      }
    }
    this.validate()
  }
  cellChainReveal(x, y) {
    this.cellSiblingShow(x + 1, y - 1);
    this.cellSiblingShow(x, y - 1);
    this.cellSiblingShow(x - 1, y - 1);
    this.cellSiblingShow(x + 1, y);
    this.cellSiblingShow(x - 1, y);
    this.cellSiblingShow(x + 1, y + 1);
    this.cellSiblingShow(x, y + 1);
    this.cellSiblingShow(x - 1, y + 1);
  }
  cellSiblingShow(x, y) {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize)
      return;

    const cellIdx = x + this.gridSize * y;
    const cell = this.state.cells[cellIdx];

    if (cell.hasBomb || !cell.isCovered)
      return;

    let cells = this.state.cells.slice();
    cells[cellIdx].isCovered = false;
    this.setState({cells});

    if (cell.dist === 0)
      this.cellChainReveal(x, y);
  }
  validate() {
    let uncoveredWithoutBomb = 0
    let boom
    let disarmed = 0
    let notBombs = Math.pow(this.gridSize, 2) - this.numBombs

    this.state.cells.forEach(cell => {
      if (cell.hasBomb && ! (cell.isCovered || cell.isFlagged))
        boom = true

      if (cell.hasBomb && (cell.isFlagged)) disarmed += 1
      if (! cell.hasBomb && ! cell.isCovered) notBombs -= 1
    });

    if (! boom && disarmed == this.numBombs || notBombs == 0)
      this.setState({isActive: false, isWinner: true })
  }
  render() {
    let classMods = '';
    if (this.state.isActive) classMods += ' is-active';
    if (this.state.isWinner) classMods += ' is-winner';
    return (
      <div>
      <div className={"game container text-center " + classMods}>
      <Header
      onClickValidate={() => this.validate()}
      isGameActive={this.state.isActive}
      isWinner={this.state.isWinner}
      />
      <Board
      cells={this.state.cells}
      onClickCell={(idx) => this.cellClick(idx)}
      />
      </div>
      </div>
    );
  }
}
Game.propTypes = {
  bombIdx: React.PropTypes.arrayOf(React.PropTypes.number)
};

ReactDOM.render(
  <Game />,
  document.querySelector('.game') || document.body
);



