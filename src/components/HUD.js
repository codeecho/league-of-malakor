import React from 'react';

import {observable} from 'mobx';

import SelectedUnit from './SelectedUnit';
import GameActions from './GameActions';

export default class HUD{
    
    constructor(scene){
        this.stateManager = scene.stateManager;
        
        this.selectAction = this.selectAction.bind(this);
        this.endTurn = this.endTurn.bind(this);
        
        const state = this.stateManager.state;

        scene.react.add(800, 0, 160, 560, 
            <SelectedUnit state={observable({
                get unit() { return state.selectedUnit; },
                get action() { return state.action; },
                get canAct() {
                    const {activeTeam, selectedUnit} = state;
                    return selectedUnit 
                        && selectedUnit.wait === 0
                        && !selectedUnit.hasAttacked
                        && activeTeam.units.find(unit => unit === selectedUnit) 
                        && (!activeTeam.hasActed || selectedUnit.hasActed);
                }
            })} selectAction={this.selectAction} />
        );
        
        scene.react.add(0, 560, 960, 80, 
            <GameActions
                state={observable({
                    get activeTeam() { return state.activeTeam; },
                    get gameOver() { return state.gameOver; }
                })}
                endTurn={this.endTurn} 
            />
        );
    }
    
    selectAction(action){
        this.stateManager.selectAction(action);
    }
    
    endTurn(){
        this.stateManager.endTurn();
    }
    
}