import React, {Component} from 'react';
import {Button} from 'react-bootstrap';


export class Header extends Component {
    makeButton (style, content) {
        return (<Button id='result' bsStyle={style} bsSize="large" disabled>
            {content}
            </Button>)
    }

    render() {
        let btn = (this.props.isWinner) ?
                  this.makeButton('success', 'Great Success')
                : this.makeButton('danger', 'BOOM')

        if (! this.props.isGameActive)
            return (
                <div className='header'>
                {btn}
                </div>
            );
        else return null
    }
}

Header.propTypes = {
    isGameActive: React.PropTypes.bool.isRequired,
    isWinner: React.PropTypes.bool,
    onClickValidate: React.PropTypes.func.isRequired,
    onClickNewGame: React.PropTypes.func.isRequired
};

export default Header;
