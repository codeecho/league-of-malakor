import React from 'react';

import {observer} from 'mobx-react';

import {Button} from 'react-bootstrap';

import { ToastContainer, toast } from 'react-toastify';

const GameActions = observer(function (props){
    
    if(props.state.gameOver){
        return (
            <div>
                <span>Game Over </span>
                <Button onClick={() => window.location.reload()}>Start Again</Button>
            </div>
        )
    }
    
    return (
        <div>
            <span>{props.state.activeTeam.name}'s Turn </span>
            <Button onClick={props.endTurn}>End Turn</Button>
            <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} hideProgressBar={true} />
        </div>
    );
    
});

export default GameActions;