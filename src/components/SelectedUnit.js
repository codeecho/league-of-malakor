import React, {Component} from 'react';

import {observer} from 'mobx-react';

import {Table, Button, Glyphicon} from 'react-bootstrap';

import {ACTIONS, ATTACK_TYPE} from '../constants/constants';

const {HEAL} = ATTACK_TYPE;

const SelectedUnit = observer(class SelectedUnit extends Component{
    constructor(props){
        super(props);
    }
    
    render(){
        const {unit, action, canAct} = this.props.state;
        const {selectAction} = this.props;
        
        if(!unit) return null;
        
        const {type, health, maxHealth, attack, defense, hasMoved, movement, recovery} = unit;
        
        return (
            <div className="well" style={{height: '100%'}}>
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
            </div>
        );
    }
});

export default SelectedUnit;