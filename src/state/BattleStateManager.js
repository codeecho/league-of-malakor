import {ACTIONS} from '../constants/constants';

import {observable} from 'mobx';

import Team from '../models/Team';

import {toast} from 'react-toastify';

export default class BattleStateManager{
    
    constructor(){
        this.state = observable({
            gameOver: false,
            teams: [
                new Team('Team 1', true),
                new Team('Team 2', false)
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
    
    attack(units){
        const {selectedUnit, activeTeam} = this.state;
        selectedUnit.hasActed = true;
        selectedUnit.hasMoved = true;
        selectedUnit.hasAttacked = true;
        selectedUnit.wait = selectedUnit.recovery;
        activeTeam.hasActed = true;
        this.state.action = ACTIONS.MOVE;
        
        units.forEach(unit => {
            const damageInflicted = 100;
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