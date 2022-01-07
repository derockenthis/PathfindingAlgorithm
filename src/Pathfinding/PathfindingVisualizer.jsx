import React, {Component} from 'react';
import Node from './Node/Node'
import { dijkstra,getNodesInShortestPathOrder} from '../Algo/straightPath';
import { Astar } from '../Algo/A*';
import './PathfindingVisualizer.css'
var Startr = 15;
var Startc = 5;
var Finishr = 1;
var Finishc = 36;
export default class PathfindingVisualizer extends Component{

    constructor(props){
        super(props);
        this.state = {
            grid:[],
            mouseIsPressed: false,
            holdingStart: false,
            calculatedPath: false,
            calculating: false,
        };

    }
    handleMouseDown(row, col) {
        if(this.state.holdingStart || this.state.calculating) return;
        if(row == Startr && col == Startc && !this.state.holdingStart){
            const newGrid = getNewStart(this.state.grid, row, col);
            // console.log("IMHERE");
            this.setState({grid: newGrid, mouseIsPressed: true, holdingStart: true});
            if(this.state.calculatedPath){
                this.clearPath();
                this.setState({calculatedPath:false});
            }
        }
        else{
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({grid: newGrid, mouseIsPressed: true});
        }
      }
    
    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        if(this.state.holdingStart){
            const newGrid = getNewStart(this.state.grid, row, col);
            this.setState({grid: newGrid});
        }
        else{
            const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
            this.setState({grid: newGrid});
        }
    }

    handleMouseUp(row, col) {
        if(this.state.holdingStart && this.state.mouseIsPressed){

            const newGrid = removeStart(this.state.grid, row, col);
            this.setState({grid: newGrid,holdingStart:false, mouseIsPressed: false});
            // if(this.state.calculatedPath){
            //     this.clearPath();
            //     setTimeout(()=>{
            //         this.visualizeAstar();
            //     },800)

            // }
        }
        this.setState({mouseIsPressed: false, holdingStart:false});
    }
    componentDidMount() {
        const grid = getInitialGrid();
        this.setState({grid});
    }
    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 1; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-shortest-path';
            }, 25 * i);
        }
    }
    animateDijkstra(visitedNodesInOrder,nodesInShortestPathOrder) {
        for (let i = 1; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder);
            }, 9*i/2);
            setTimeout(() =>{
                this.setState({calculating:false});
            },10*i/2);
            return;
          }
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            // console.log(document.getElementById(`node-${node.row}-${node.col}`),"HIFDIH")
            document.getElementById(`node-${node.row}-${node.col}`).className =
              'node node-visited';
          }, 9*i/2);
        }
        // this.setState({calculating:false});
      }
    animateAstar(visitedNodesInOrder,nodesInShortestPathOrder) {
        for (let i = 1; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    this.animateShortestPath(nodesInShortestPathOrder);
                }, 15* i);
                setTimeout(() =>{
                    this.setState({calculating:false});
                },25*i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                // console.log(document.getElementById(`node-${node.row}-${node.col}`),"HIFDIH")
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 9 * i);
        }
        // this.setState({calculating:false});
    }
    visualizeDijkstra() {
        if(this.state.calculating) return;
        this.clearPath();
        this.setState({calculatedPath:true, calculating:true});
        const {grid} = this.state;
        const startNode = grid[Startr][Startc];
        const finishNode = grid[Finishr][Finishc];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder,nodesInShortestPathOrder);
      }
    visualizeAstar(){
        if(this.state.calculating) return;
        this.clearPath();
        this.setState({calculatedPath:true,calculating:true});
        const {grid} = this.state;
        const startNode = grid[Startr][Startc];
        const finishNode = grid[Finishr][Finishc];
        const visitedNodesInOrder = Astar(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateAstar(visitedNodesInOrder,nodesInShortestPathOrder);
    }
    clearPath(){
        if(this.state.calculating) return;
        this.setState({calculatedPath:false});
        const grid = this.state.grid;
        for(let row = 0; row<25; row++){
            console.log(row);
            for (let col = 0; col<50; col++){
                const node  = this.state.grid[row][col];
                const newnode = {
                    ...node,
                    isStart: row === Startr && col === Startc,
                    g: 10000,
                    h: 0,
                    isFinish: row === Finishr && col === Finishc,
                    distance: Infinity,
                    isVisited: false,
                    previousNode: null,
                }
                grid[row][col] = newnode;
                if(node.isWall) continue;
                if((row == Startr && col == Startc) || (row == Finishr && col == Finishc)) continue;
                document.getElementById(`node-${row}-${col}`).className ='node';
                // this.state.grid[row][col].isVisited = false;
            }
        }
        // const grid = getInitialGrid();
        this.setState({grid});
    }
    clearBoard(){
        if(this.state.calculating) return;
        this.setState({calculatedPath:false});
        const grid = this.state.grid;
        for(let row = 0; row<25; row++){
            console.log(row);
            for (let col = 0; col<50; col++){
                const node  = this.state.grid[row][col];
                const newnode = {
                    ...node,
                    isStart: row === Startr && col === Startc,
                    g: 10000,
                    h: 0,
                    isFinish: row === Finishr && col === Finishc,
                    distance: Infinity,
                    isVisited: false,
                    previousNode: null,
                    isWall: false,
                }
                grid[row][col] = newnode;
                // if(node.isWall) continue;
                if((row == Startr && col == Startc) || (row == Finishr && col == Finishc)) continue;
                document.getElementById(`node-${row}-${col}`).className ='node';
                // this.state.grid[row][col].isVisited = false;
            }
        }
        // const grid = getInitialGrid();
        this.setState({grid});
    }
    render(){
        const {grid, mouseIsPressed} = this.state;
        // console.log(grid);

        return(
            <>
            <div className = "Buttons">
                <button onClick={() => this.visualizeDijkstra()}>
                Visualize Dijkstra's Algorithm
                </button>
                <button onClick={() => this.visualizeAstar()}>
                Visualize A* Algorithm
                </button>
                <button onClick={() => this.clearPath()}>
                Clear Path
                </button>
                <button onClick={() => this.clearBoard()}>
                Clear Board
                </button>
            </div>
            <div className = "grid" viewBox="0 0 1404 612" width= "1920" height = "1080">
                {grid.map((row,rowIdx) =>{
                    return(
                    <div key={rowIdx} className = "row">
                        {row.map((node,nodeIdx) =>{
                            const {row, col, isFinish, isStart, isWall} = node;
                            // console.log({isStart})
                            // console.log(node)
                            return(
                                <Node
                                key={nodeIdx}
                                col={col}
                                isFinish={isFinish}
                                isStart={isStart}
                                isWall={isWall}
                                mouseIsPressed={mouseIsPressed}
                                onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                                onMouseUp={(row, col) => this.handleMouseUp(row, col)}
                                row={row}></Node>
                            );
                        })}
                    </div>
                    ); 
                })}
                
            </div>
            </>
        );
    }
    
}

const getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 25; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };
const createNode = (col, row) => {
    return {
      col,
      row,
      isStart: row === Startr && col === Startc,
      g: 10000,
      h: 0,
      isFinish: row === Finishr && col === Finishc,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };
const getNewGridWithWallToggled = (grid, row, col) => {
    if(row == Startr && col == Startc){
        return grid;
    }
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
};
const removeStart = (grid,row,col) =>{
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if(node.isWall || node.isFinish){
        for(const rows in grid){
            for(const cols in rows){
                const nodetemp = grid[rows][cols];
                if(!nodetemp.isWall){
                    const newNode = {
                        ...node,
                        col: cols,
                        row: rows,
                        isWall:false,
                        isStart:true,
                        isFinish:false
                    }
                    Startc = cols;
                    Startr = rows;
                    newGrid[rows][cols] = newNode;
                    return newGrid;
                }
            }
        }
        return grid;
    }
    const newNode = {
      ...node,
      isStart: true,
    };
    // const oldNode = {
    //     ...node,
    //     isStart: false,
    // }
    // newGrid[row][col] = oldNode;
    newGrid[row][col] = newNode;

    Startc = col;
    Startr = row;
    return newGrid;
}
const getNewStart = (grid,row,col)=>{

    const newGrid = grid.slice();
    const node = newGrid[row][col];

    const newNode = {
      ...node,
      isStart: true,
    };
    const oldNode = {
        ...node,
        isStart: false,
    }
    // newGrid[row][col] = oldNode;
    newGrid[row][col] = newNode;
    setTimeout(() => {
        newGrid[row][col] = oldNode;
      }, 10);

    return newGrid;
}