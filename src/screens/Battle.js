import {SCREENS, ACTIONS, ATTACK_TYPE} from '../constants/constants';

import ReactScene from '../utils/ReactScene';

import StateManager from '../state/BattleStateManager';

import Grid from '../components/Grid';
import Unit from '../components/Unit';

import HUD from '../components/HUD';

import {GRID_CELL_DOWN} from '../constants/events';

import { toast } from 'react-toastify';

import PathFinder from '../utils/PathFinder';

const GRID_ROWS = 5;
const GRID_COLS = 5;

const {LINE_OF_SIGHT} = ATTACK_TYPE;

export default class Battle extends ReactScene{
    
    constructor(){
        super({
            key: SCREENS.BATTLE
        });
    }
    
    preload(){
        this.load.image('unit', 'assets/star.png');
    }
    
    create(){
        // Build state
        this.stateManager = new StateManager();
        this.state = this.stateManager.state;
        
        // Build grid
        this.grid = new Grid(this, 0, 0, 100, GRID_ROWS, GRID_COLS);
        
        // Create path finder
        this.pathFinder = new PathFinder(this.grid);
        
        // Place units on grid
        this.state.teams[0].units.forEach((unit, i) => {
            unit.cell = this.grid.getCell(0, i);
        });
        this.state.teams[1].units.forEach((unit, i) => {
            unit.cell = this.grid.getCell(4, i);
        });
        
        // Create grid markers
        this.state.units.forEach(unit => new Unit(this, unit));
        
        // Create HUD
        new HUD(this);
        
        // Add event handlers
        this.grid.on(GRID_CELL_DOWN, function(cell){
            this.selectCell(cell);
        }, this);
    }
    
    selectCell(cell){        
        
        const {units, selectedUnit, action, activeTeam} = this.state;
        
        const unitAtCell = units.find(unit => unit.cell === cell);
        
        if(unitAtCell && (action !== ACTIONS.ATTACK || activeTeam.units.find(unit => unit === unitAtCell))) {
            this.stateManager.selectUnit(unitAtCell);
            return;
        }
        
        if(!selectedUnit) return;
        
        if(!activeTeam.units.find(unit => unit === selectedUnit)) return;
        
        if(activeTeam.hasActed && !selectedUnit.hasActed) return;
        
        if(selectedUnit.wait !== 0) return;
        
        if(action === ACTIONS.MOVE){
            this.moveSelectedUnit(cell);
            return;
        }
        
        if(action === ACTIONS.ATTACK){
            this.attack(cell);
            return;
        }
    }
    
    moveSelectedUnit(cell){
        const {selectedUnit, units, activeTeam} = this.state;
        const obstacles = units.reduce((cells, unit) => cells.concat(unit.cell), []);
        this.pathFinder.findPath(selectedUnit.cell, cell, obstacles)
            .then(path => {
                if(!path) {
                    toast.error('You cannot move here');
                    return;
                }
                
                if(path.length > selectedUnit.movement) {
                    toast.error('You cannot move that far');
                    return;
                }

                this.stateManager.moveSelectedUnit(cell);

                toast.info(`${selectedUnit.type} moved to ` + getGridReference(cell));
            });
    }
    
    attack(cell){
        const {units, selectedUnit, activeTeam} = this.state;
        
        const {attack} = selectedUnit;
        
        new Promise((resolve, reject) => {
            if(attack.type === LINE_OF_SIGHT){
                const {range} = attack;
                this.pathFinder.findPath(selectedUnit.cell, cell, [])
                    .then(path => {
                        
                        if(!path || path.length > range){
                            reject();
                            return;
                        }
                        
                        const isLineOfSight = path.filter(step => step.row === selectedUnit.cell.row).length === path.length ||
                            path.filter(step => step.col === selectedUnit.cell.col).length === path.length;
                            
                        if(!isLineOfSight){
                            reject();
                            return;
                        }
                        
                        return resolve([cell]);
                    })
            }else{
                return resolve([]);   
            }
        })
        .then(cells => {
            console.log('cells', cells);
            return units.filter(unit => cells.includes(unit.cell));
        })
        .then(unitsHit => {
            this.stateManager.attack(unitsHit);
       
            unitsHit.forEach(unit => toast.info(`${selectedUnit.type} inflicted damage to ${unit.type}`)); 
        })
        .catch(() => {
            toast.error('You cannot attack here');
        });
    }
    
}

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function getGridReference(cell){
    return letters[cell.row] + cell.col;
}