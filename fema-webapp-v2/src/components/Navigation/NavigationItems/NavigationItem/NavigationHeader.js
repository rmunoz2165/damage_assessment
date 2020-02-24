import React, { Component } from 'react'
import classes from './NavigationHeader.css'
import { NavLink } from 'react-router-dom';


export default class NavigationHeader extends Component {
    render() {
        return (
            <li className={classes.NavigationHeader}>
            <NavLink exact={this.props.exact}
                to={this.props.link}
                activeClassName={classes.active}>
                {this.props.children}
            </NavLink>
        </li>
        )
    }
}