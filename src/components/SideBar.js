import React, {Component} from 'react';

import {observer} from 'mobx-react';

import {Table, Button, Glyphicon} from 'react-bootstrap';

import {ACTIONS, ATTACK_TYPE} from '../constants/constants';

import { ToastContainer, toast } from 'react-toastify';

const {HEAL} = ATTACK_TYPE;

const SideBar = observer(class SelectedUnit extends Component{
    constructor(props){
        super(props);
    }
    
    render(){
        const {unit, action, canAct, gameOver, activeTeam} = this.props.state;
        const {selectAction, endTurn} = this.props;
        
        if(gameOver){
            return (
                <div>
                    <span>Game Over </span>
                    <Button onClick={() => window.location.reload()}>Start Again</Button>
                </div>
            )
        }
        
        const {type, health, maxHealth, attack, defense, hasMoved, movement, recovery} = unit || {};
        
        return (
            <div className="well" style={{height: '100%'}}>
                <div>
                    <h4 style={{textAlign: 'center'}}>{activeTeam.name}'s Turn </h4>
                    <Button onClick={endTurn} block>End Turn</Button>
                    <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} hideProgressBar={true} />
                </div>
                <hr/>
                {unit && <div>
                    <h4 style={{textAlign: 'center'}}>{type}</h4>
                    <Table striped>
                        <tbody>
                            <tr>
                                <td><Glyphicon glyph="heart" title="Health" /></td>
                                <td>{health}/{maxHealth}</td>
                            </tr>
                            <tr>
                                <td><Glyphicon glyph="move" title="Movement Range" /></td>
                                <td>{movement}</td>
                            </tr>
                            <tr>
                                <td><Glyphicon glyph="tower" title="Armour" /></td>
                                <td>{defense}</td>
                            </tr>
                            <tr>
                                <td><Glyphicon glyph="flash" title="Attack Power" /></td>
                                <td>{attack.power}</td>
                            </tr>
                            <tr>
                                <td><Glyphicon glyph="repeat" title="Recovery Time" /></td>
                                <td>{recovery}</td>
                            </tr>                                     
                        </tbody>
                    </Table>
                    {canAct && <div>
                        <Button block disabled={hasMoved} bsStyle={action == ACTIONS.MOVE ? 'primary': 'default'} onClick={() => selectAction(ACTIONS.MOVE)}>Move</Button>
                        <Button block bsStyle={action == ACTIONS.ATTACK ? 'primary': 'default'} onClick={() => selectAction(ACTIONS.ATTACK)}>{attack.type === HEAL ? 'Heal' : 'Attack'}</Button>
                    </div>} 
                </div>}
            </div>
        );
    }
});

export default SideBar;