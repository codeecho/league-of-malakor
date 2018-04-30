import {ACTIONS} from '../constants/constants';

import {observable} from 'mobx';

import Team from '../models/Team';

import {toast} from 'react-toastify';

import {LEFT, RIGHT, UP, DOWN} from '../constants/directions';

import BattleCalculator from '../utils/BattleCalculator';

export default class BattleStateManager{
    
    constructor(){
        this.state = observable({
            gameOver: false,
            teams: [
                new Team('Green', true, 'green'),
                new Team('Red', false, 'red')
            ],
            get activeTeam() {
                return this.teams.find(team => team.active);
            },
            get units() {
                return this.teams.reduce((units, team) => units.concat(team.units.slice(0)), [])
            },
            get selectedUnit() {
                return this.units.find(unit => unit.selected); 
            },
            action: undefined
        });
        
        this.battleCalculator = new BattleCalculator();
    }
    
    selectUnit(unit){
        this.state.units.forEach(x => x.selected = unit === x);
        this.state.action = this.state.selectedUnit.hasMoved ? ACTIONS.ATTACK : ACTIONS.MOVE;
    }
    
    selectAction(action){
        this.state.action = action;
    }
    
    moveSelectedUnit(cell){
        const {selectedUnit, activeTeam} = this.state;        
        selectedUnit.cell = cell;
        selectedUnit.hasActed = true;
        selectedUnit.hasMoved = true;
        activeTeam.hasActed = true;
        this.state.action = ACTIONS.ATTACK;
    }
    
    faceSelectedUnit(target){
        const {selectedUnit} = this.state;
        const {cell} = selectedUnit;
        let direction = RIGHT;
        if(target.col < cell.col) direction = UP;
        if(target.col > cell.col) direction = DOWN;
        if(target.row < cell.row) direction = LEFT;
        selectedUnit.facing = direction;
    }
    
    attack(units){
        const {selectedUnit, activeTeam} = this.state;
        selectedUnit.hasActed = true;
        selectedUnit.hasMoved = true;
        selectedUnit.hasAttacked = true;
        selectedUnit.wait = selectedUnit.recovery;
        activeTeam.hasActed = true;
        this.state.action = ACTIONS.MOVE;
        
        units.forEach(unit => {
            const damageInflicted = this.battleCalculator.calculateDamage(selectedUnit, unit);
            unit.health = unit.health - damageInflicted;
            if(unit.health <= 0){
                unit.alive = false;
            }
        });
        
        this.state.teams.forEach(team => {
            team.units = team.units.filter(unit => unit.alive); 
        });
        
        if(!this.state.teams[0].units.find(unit => unit.alive)){
            this.state.gameOver = true;
            const winner = this.state.teams[1];
            toast.info(`${winner.name} win`);   
        }else if(!this.state.teams[1].units.find(unit => unit.alive)){
            this.state.gameOver = true;
            const winner = this.state.teams[0];
            toast.info(`${winner.name} win`);
        }
    }
    
    heal(){
        this.state.activeTeam.units.forEach(unit => {
            unit.health = Math.min(unit.health + this.state.selectedUnit.attack.power, unit.maxHealth); 
        });
    }
    
    freeze(units){
        units.forEach(unit => unit.wait = unit.wait + this.state.selectedUnit.attack.power);
    }
    
    endTurn(){
        this.state.activeTeam.units.forEach(unit => {
            unit.hasActed = false;
            unit.hasMoved = false;
            unit.hasAttacked = false;
            unit.wait = Math.max(unit.wait - 1, 0);
            unit.selected = false;
        });
        this.state.teams.forEach(team => {
            team.active = !team.active;
            team.hasActed = false;
        });
        this.state.action = ACTIONS.MOVE;
    }
    
}