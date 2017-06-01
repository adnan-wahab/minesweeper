import React, {Component} from 'react';

import Cell from './cell'

class Board extends Component {
  render() {
    let onClick = (e, idx) => {
      e.idx = idx;
      this.props.onClickCell(e)
    }

    const cells =
          this.props.cells.map((cell, idx) =>
                               <Cell
                               key={idx}
                               onClick={(e) => { onClick(e, idx) }}
                               isCovered={cell.isCovered}
                               hasBomb={cell.hasBomb}
                               isFlagged={false}
                               dist={cell.dist}
                               />
                              );
    return (
        <div className='board'>{cells}</div>
    );
  }
}
Board.propTypes = {
  cells: React.PropTypes.arrayOf(React.PropTypes.shape({
    isCovered: React.PropTypes.bool.isRequired,
    dist: React.PropTypes.number.isRequired
  })).isRequired,
  onClickCell: React.PropTypes.func.isRequired
};


export default Board;
