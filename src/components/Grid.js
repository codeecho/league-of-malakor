import {POINTER_DOWN, GRID_CELL_DOWN} from '../constants/events';

class GridCell extends Phaser.GameObjects.GameObject{
    
    constructor(scene, row, col, size){
        super(scene, 'GridCell');

        scene.add.existing(this);
        
        this.row = row;
        this.col = col;
        this.size = size;
        
        this.shape = new Phaser.Geom.Rectangle(row * size, col * size, size, size);

        const graphics = scene.add.graphics();
        
        graphics.fillStyle(Phaser.Display.Color.GetColor(0, 0, 100));
        graphics.fillRectShape(this.shape);
        graphics.lineStyle(1, Phaser.Display.Color.GetColor(255, 255, 255));
        graphics.strokeRectShape(this.shape);
        
        graphics.setInteractive(this.shape, Phaser.Geom.Rectangle.Contains);

        graphics.on(POINTER_DOWN, () => {
            this.emit(GRID_CELL_DOWN, this);
        }, this);
        
        this.graphics = graphics;
    }
    
    getCenter(){
        const {centerX, centerY} = this.shape;
        return new Phaser.Math.Vector2(centerX, centerY);
    }
    
    setColor(color){
        this.graphics.fillStyle(color);
        this.graphics.fillRectShape(this.shape);        
    }
    
}

export default class Grid extends Phaser.GameObjects.GameObject{

    constructor(scene, x, y, squareWidth, rows, cols){
        super(scene, 'Grid');
        
        this.x = x;
        this.y = y;
        this.squareWidth = squareWidth;
        this.rows = rows;
        this.cols = cols;
        
        scene.add.existing(this);
        
        this.cells = [];
        
        for(let row = 0; row < rows; row++){
            const cells = [];
            for(let col = 0; col < cols; col++){
                const cell = new GridCell(scene, row, col, squareWidth);
                cells.push(cell);
                cell.on(GRID_CELL_DOWN, function(cell){
                    this.emit(GRID_CELL_DOWN, cell)
                }, this);
            }
            this.cells.push(cells);
        }
    }
    
    getCell(row, col){
        return this.cells[row][col];
    }
    
}