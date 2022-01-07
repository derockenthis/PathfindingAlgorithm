import React, {Component} from 'react';

import './Node.css'

export default class Node extends Component{
    render() {
        const {
            col,
            isFinish,
            isStart,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            row,
          } = this.props;
        // console.log(this.props,"93089")
        const extraClassName = isFinish
            ? 'node-finish'
            : isStart
            ? 'node-start'
            : isWall
            ? 'node-wall'
            : '';
        return (
                <div 
                    id={`node-${row}-${col}`} 
                    className={`node ${extraClassName}`}
                    onMouseDown={() => onMouseDown(row, col)}
                    onMouseEnter={() => onMouseEnter(row, col)}
                    onMouseUp={() => onMouseUp(row, col)}></div>
        );
    }
}
export const DEFEAULT_NODE = {
    row: 0,
    col: 0,
}