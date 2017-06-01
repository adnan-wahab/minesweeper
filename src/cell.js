import React, {Component} from 'react';

export class Cell extends Component {
  render() {
    let content = (this.props.dist || 0) > 0 ? this.props.dist : null;
    if (this.props.hasBomb) content = 'X';

    return (
        <div className='cell-wrap'>
        <div className="cell">{content}</div>
        {this.props.isCovered &&
         <div className="cell-cover"
         onClick={(e) => this.props.onClick(e)}
         />}
      </div>
    );
  }
}
Cell.propTypes = {
  isCovered: React.PropTypes.bool,
  hasBomb:  React.PropTypes.bool,
  dist: React.PropTypes.number,
  onClick: React.PropTypes.func,
  isFlagged: React.PropTypes.bool
};

export default Cell;
