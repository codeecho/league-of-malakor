import Easystar from 'easystarjs';

const easystar = new Easystar.js();

export default class PathFinder{
    
    constructor(grid){
        this.grid = grid;
    }
    
    findPath(from, to, obstacles){
        return new Promise((resolve, reject) => {
        
            const grid = [];
            
            for(let i=0; i<this.grid.rows; i++){
                const row = [];
                for(let j=0; j<this.grid.cols; j++){
                    row.push(0);
                }
                grid.push(row);
            }
            
            obstacles.forEach(cell => { 
                grid[cell.col][cell.row] = 1;
            });
            
            easystar.setGrid(grid);
            easystar.setAcceptableTiles([0]);
            easystar.findPath(from.row, from.col, to.row, to.col, (path) => {
                resolve(path && path.slice(1).map(step => this.grid.getCell(step.x, step.y)));
            });
            easystar.calculate();  
        });
    }
    
}