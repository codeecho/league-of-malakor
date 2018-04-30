import Easystar from 'easystarjs';

const easystar = new Easystar.js();

export default class PathFinder{
    
    constructor(grid){
        this.grid = grid;
    }
    
    findPath(from, to, obstacles){
        const grid = [];
        
        for(let i=0; i<this.grid.cols; i++){
            const row = [];
            for(let j=0; j<this.grid.rows; j++){
                row.push(0);
            }
            grid.push(row);
        }
        
        obstacles.forEach(cell => { 
            grid[cell.col][cell.row] = 1;
        });
        
        easystar.setGrid(grid);
        easystar.setAcceptableTiles([0]);
        easystar.enableSync();
        
        let pathToReturn = undefined;
        
        easystar.findPath(from.row, from.col, to.row, to.col, (path) => {
            pathToReturn = path && path.slice(1).map(step => this.grid.getCell(step.x, step.y));
        });
        easystar.calculate();  
        
        return pathToReturn;
    }
    
}