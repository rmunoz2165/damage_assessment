import React from 'react';
import Logo from '../../Logo/Logo'
import classes from './SideDrawer.css'
import Aux from '../../../hoc/Aux'
import Backdrop from '../../Layout/UI/Backdrop/Backdrop'

import SidepanelNav from './SidepanelNav/SidepanelNav'

function SideDrawer(props) {
    const attchedClasses = [classes.SideDrawer, props.show? classes.Open : classes.Close].join(" ")
    return (
        <Aux>
            <Backdrop show={props.show} clicked={props.closed}></Backdrop>
            <div className={attchedClasses} onClick={props.closed}>
                <div className={classes.Logo}>
                    <Logo />
                </div>
                <nav>
                    <SidepanelNav isauth={props.isauth}/> 
                </nav>
            
            </div>
        </Aux>

    );
}

export default SideDrawer;