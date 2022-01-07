export function Astar(grid, startNode, finishNode){
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.g = 0;
    const unvisitedNodes = getAllNodes(grid);
    const openSet = [];
    const closedSet = [];
    openSet.unshift(startNode);
    while(!!openSet.length){
        // sortedNodes(unvisitedNodes);
        sortedNodes(openSet)
        const closestNode = openSet.shift();
        if(closestNode.isWall) continue;
        if(closestNode.distance === Infinity) return closedSet;
        if(closestNode.isVisited) continue;
        closestNode.isVisited = true;
        closedSet.push(closestNode);

        if(closestNode === finishNode){
            return closedSet;
        }
        updateUnvisited(closestNode,grid,finishNode,startNode,openSet)

    }


}
function updateUnvisited(Node,grid,finishNode,startNode,openSet){
    const unvisitedNeighbors = getUnvisitedNeighbors(Node, grid);
    for (const neighbor of unvisitedNeighbors) {
        // g score is the shortest distance from start to current node, we need to check if
        //   the path we have arrived at this neighbor is the shortest one we have seen yet
        const g = Node.g +1;
        let gScoreIsBest = false;
        if(!openSet.includes(neighbor)){
            // This the the first time we have arrived at this node, it must be the best
            // Also, we need to take the h (heuristic) score since we haven't done so yet
            gScoreIsBest = true
            // const h= Math.sqrt(Math.pow(finishNode.col-neighbor.col,2) + Math.pow(finishNode.row-neighbor.row,2));
            const h = Math.abs(neighbor.row-finishNode.row) + Math.abs(neighbor.col-finishNode.col);
            neighbor.h = h;
            openSet.unshift(neighbor);
        }
        else if(g < neighbor.g || neighbor.g >1000 ) {
            // We have already seen the node, but last time it had a worse g (distance from start)
            gScoreIsBest = true;
        }
        if(gScoreIsBest){
            // Found an optimal (so far) path to this node.   Store info on how we got here and
            //  just how good it really is...
            neighbor.previousNode = Node;
            neighbor.g = g;
            neighbor.distance = g+neighbor.h;
        }

    }
}

function getUnvisitedNeighbors(node, grid){
    const neighbors = [];
    const {col, row} = node;

    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
    // return neighbors;
}

function sortedNodes(unvisitedNodes){
    unvisitedNodes.sort((nodeA,nodeB)=>nodeA.distance - nodeB.distance);
}


function getAllNodes(grid){
    const Nodes = []

    for (const row of grid){
        for(const col of row){
            Nodes.push(col)
        }
    }

    return Nodes

}
export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }