import React from 'react';
import classes from './Logo.css'
import Logo from '../../assests/images/logo.png'

const logo = (props) => (
            <div className={classes.Logo}>
                <img src={Logo} alt="FemaApp" />
            </div>
    );

export default logo;