import React, { Component } from 'react'
import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem'


export default class NavigationItems extends Component {
    render() {
        let auth = !this.props.isauth ? <NavigationItem link="/login" >Login</NavigationItem> : <NavigationItem link="/login" >Logout</NavigationItem>
        let others = null

        if (this.props.isauth) {
            others = [<NavigationItem link="/app" key="1" exact>Apply</NavigationItem>,
            <NavigationItem link="/process" key="2" exact>Process</NavigationItem>,
            <NavigationItem link="/reports" key="3" >Reports</NavigationItem>]
        }
        return (
            <ul className={classes.NavigationItems}>
                {others}
                {auth}
            </ul>
        )
    }
}
