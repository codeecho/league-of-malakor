import React, {Component} from 'react';

import {observer} from 'mobx-react';

import {Table, Button} from 'react-bootstrap';

import {ACTIONS} from '../constants/constants';

const SelectedUnit = observer(class SelectedUnit extends Component{
    constructor(props){
        super(props);
    }
    
    render(){
        const {unit, action, canAct} = this.props.state;
        const {selectAction} = this.props;
        
        if(!unit) return null;
        
        const {type, health, maxHealth, attack, defense, hasMoved} = unit;
        
        return (
            <div className="well" style={{height: '100%'}}>
                <Table striped>
                    <tbody>
                        <tr>
                            <td>Name: </td>
                            <td>{type}</td>
                        </tr>
                        <tr>
                            <td>Health: </td>
                            <td>{health}/{maxHealth}</td>
                        </tr>
                        <tr>
                            <td>Attack: </td>
                            <td>{attack.power}</td>
                        </tr>
                        <tr>
                            <td>Defense: </td>
                            <td>{defense}</td>
                        </tr>
                    </tbody>
                </Table>
                {canAct && <div>
                    <Button block disabled={hasMoved} bsStyle={action == ACTIONS.MOVE ? 'primary': 'default'} onClick={() => selectAction(ACTIONS.MOVE)}>Move</Button>
                    <Button block bsStyle={action == ACTIONS.ATTACK ? 'primary': 'default'} onClick={() => selectAction(ACTIONS.ATTACK)}>Attack</Button>
                </div>} 
            </div>
        );
    }
});

export default SelectedUnit;