import React from 'react';
import classes from './Toolbar.css'
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle'
import NavigationItems from '../NavigationItems/NavigationItems'
import NavigationHeader from '../NavigationItems/NavigationItem/NavigationHeader'


const toolbar = (props) => (
       <header className={classes.Toolbar}>
          <DrawerToggle clicked={props.toggleClicked}/>

          <NavigationHeader link="/" exact>Property Disaster Estimator</NavigationHeader>

           <nav className={classes.DesktopOnly}>
                <NavigationItems isauth={props.isauth}/>
           </nav>
           
       </header>     
    );

export default toolbar;