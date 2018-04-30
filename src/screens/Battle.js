import {SCREENS, ACTIONS, ATTACK_TYPE} from '../constants/constants';

import {observable} from 'mobx';

import ReactScene from '../utils/ReactScene';

import StateManager from '../state/BattleStateManager';

import Grid from '../components/Grid';
import Unit from '../components/Unit';

import HUD from '../components/HUD';

import {GRID_CELL_DOWN} from '../constants/events';

import { toast } from 'react-toastify';

import PathFinder from '../utils/PathFinder';

import {LEFT, RIGHT} from '../constants/directions';

import {IDLE_LEFT, IDLE_RIGHT, IDLE_UP, IDLE_DOWN} from '../constants/animations';

const GRID_ROWS = 10;
const GRID_COLS = 7;

const {LINE_OF_SIGHT, HEAL, MULTI_DIRECTION, AOE, FREEZE} = ATTACK_TYPE;

export default class Battle extends ReactScene{
    
    constructor(){
        super({
            key: SCREENS.BATTLE
        });
    }
    
    preload(){
        this.load.image('identifier-red', 'assets/identifier-red.png');
        this.load.image('identifier-green', 'assets/identifier-green.png');        
        this.load.spritesheet('soldier', 
            'assets/soldier.png',
            { frameWidth: 70, frameHeight: 70 }
        );
        this.load.spritesheet('archer', 
            'assets/archer.png',
            { frameWidth: 70, frameHeight: 70 }
        );
        this.load.spritesheet('healer', 
            'assets/healer.png',
            { frameWidth: 70, frameHeight: 70 }
        );
        this.load.spritesheet('paladin', 
            'assets/paladin.png',
            { frameWidth: 70, frameHeight: 70 }
        );
        this.load.spritesheet('siren', 
            'assets/siren.png',
            { frameWidth: 70, frameHeight: 70 }
        );
        this.load.spritesheet('warlock', 
            'assets/warlock.png',
            { frameWidth: 70, frameHeight: 70 }
        );
        this.load.spritesheet('demon', 
            'assets/demon.png',
            { frameWidth: 70, frameHeight: 70 }
        );        
        this.load.spritesheet('slash',
            'assets/slash.png',
            { frameWidth: 70, frameHeight: 70 }
        );
        this.load.spritesheet('fire',
            'assets/fire.png',
            { frameWidth: 70, frameHeight: 70 }
        );
        this.load.spritesheet('heal',
            'assets/heal.png',
            { frameWidth: 70, frameHeight: 70 }
        );
        this.load.spritesheet('thunder',
            'assets/thunder.png',
            { frameWidth: 70, frameHeight: 70 }
        );
        this.load.spritesheet('magic',
            'assets/magic.png',
            { frameWidth: 70, frameHeight: 70 }
        );
        this.load.spritesheet('freeze',
            'assets/freeze.png',
            { frameWidth: 70, frameHeight: 70 }
        );
    }
    
    create(){
        // Build state
        this.stateManager = new StateManager();
        this.state = this.stateManager.state;
        
        // Create layers
        this.gridLayer = this.add.group();
        this.unitsLayer = this.add.group();
        this.animationsLayer = this.add.group();
        
        // Create animations
        ['soldier', 'archer', 'demon', 'paladin', 'warlock', 'siren', 'healer'].forEach(type => {
            this.anims.create({
                key: `${type}-${IDLE_LEFT}`,
                frames: [ { key: type, frame: 8 } ],
                frameRate: 20
            });
            
            this.anims.create({
                key: `${type}-${IDLE_RIGHT}`,
                frames: [ { key: type, frame: 16 } ],
                frameRate: 20
            });
            
            this.anims.create({
                key: `${type}-${IDLE_UP}`,
                frames: [ { key: type, frame: 24 } ],
                frameRate: 20
            });
            
            this.anims.create({
                key: `${type}-${IDLE_DOWN}`,
                frames: [ { key: type, frame: 0 } ],
                frameRate: 20
            });
        });
        
        ['slash', 'thunder'].forEach(type => {
            this.anims.create({
                key: type,
                frames: this.anims.generateFrameNumbers(type, { start: 0, end: 24 }),
                frameRate: 20
            });
        });
        
        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 29 }),
            frameRate: 20
        });
        
        this.anims.create({
            key: 'magic',
            frames: this.anims.generateFrameNumbers('magic', { start: 0, end: 29 }),
            frameRate: 20
        });
        
        this.anims.create({
            key: 'heal',
            frames: this.anims.generateFrameNumbers('heal', { start: 0, end: 34 }),
            frameRate: 20
        });
        
        this.anims.create({
            key: 'freeze',
            frames: this.anims.generateFrameNumbers('freeze', { start: 0, end: 39 }),
            frameRate: 20
        }); 
        
        // Build grid
        this.grid = new Grid(this, 0, 0, 80, GRID_ROWS, GRID_COLS);
        
        // Create path finder
        this.pathFinder = new PathFinder(this.grid);
        
        // Place units on grid
        this.state.teams[0].units.forEach((unit, i) => {
            if(i <= 4){
                unit.cell = this.grid.getCell(0, i+1);                
            }else{
                unit.cell = this.grid.getCell(1, i-4);
            }
            unit.facing = RIGHT;
        });
        this.state.teams[1].units.forEach((unit, i) => {
            if(i <= 4){
                unit.cell = this.grid.getCell(9, i+1);                
            }else{
                unit.cell = this.grid.getCell(8, i-4);
            }
            unit.facing = LEFT;
        });
        
        const state = this.state;
        
        // Create grid markers
        this.state.units.forEach(unit => new Unit(this, observable({
            unit,
            get color() {
                const team = state.teams.find(team => team.units.includes(unit)); 
                if(team) return team.color;
            }
        })));
        
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
        
        const path = this.pathFinder.findPath(selectedUnit.cell, cell, obstacles)
        
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
    }
    
    attack(cell){
        this.stateManager.faceSelectedUnit(cell);
        
        const {units, selectedUnit, activeTeam} = this.state;
        
        const {attack} = selectedUnit;
        
        let cells = [];
        
        if(attack.type === LINE_OF_SIGHT || attack.type === MULTI_DIRECTION){
            const {range, aoe} = attack;
            
            const path = this.pathFinder.findPath(selectedUnit.cell, cell, [])
                    
            if(!path || path.length > range){
                toast.error('You cannot attack here');
                return;
            }
            
            const isLineOfSight = path.filter(step => step.row === selectedUnit.cell.row).length === path.length ||
                path.filter(step => step.col === selectedUnit.cell.col).length === path.length;
                
            if(!isLineOfSight){
                toast.error('You cannot attack here');
                return;
            }
            
            cells = aoe ? path : [cell];
            
            if(attack.type === MULTI_DIRECTION){
                cells = [];
                [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
                   const cell = this.grid.getCell(selectedUnit.cell.row + dr, selectedUnit.cell.col + dc);
                   if(cell) cells.push(cell);
                });
            }
            
        }else if(attack.type === AOE || attack.type === FREEZE){
            const {range} = attack;
            
            const path = this.pathFinder.findPath(selectedUnit.cell, cell, []);
                    
            if(!path || path.length > range){
                toast.error('You cannot attack here');
                return;
            }
            
            if(attack.type === FREEZE){
                cells.push(cell);
            }else{
                [[0,0], [-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
                   const attackCell = this.grid.getCell(cell.row + dr, cell.col + dc);
                   if(attackCell) cells.push(attackCell);
                });
            }
        }else if(attack.type === HEAL){
            cells = activeTeam.units.reduce((cells, unit) => cells.concat(unit.cell), []);
        }

        cells.forEach(cell => cell.playAnimation(attack.animation));
        
        if(attack.type === HEAL){
            this.stateManager.heal();    
        }else{
            const unitsHit = units.filter(unit => cells.includes(unit.cell));

            if(attack.type === FREEZE){
                this.stateManager.freeze(unitsHit);                 
                
                unitsHit.forEach(unit => toast.info(`${selectedUnit.type} has frozen ${unit.type}`));       
            }else{
                this.stateManager.attack(unitsHit); 
   
                unitsHit.forEach(unit => toast.info(`${selectedUnit.type} inflicted damage to ${unit.type}`));       
            }
        }
        
        this.stateManager.endTurn();
    }
    
}

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function getGridReference(cell){
    return letters[cell.row] + cell.col;
}