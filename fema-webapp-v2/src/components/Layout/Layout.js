import React, { Component } from 'react';
import Aux from '../../hoc/Aux'
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar'
import SideDrawer from '../Navigation/SideDrawer/SideDrawer'
import { connect } from 'react-redux';


class Layout extends Component {

    state = {
        showSideDrawer: false,
    }

    sideDrawerClosed = () => {
        this.setState({ showSideDrawer: false });
    }

    sideDrawerToggle = () => {
        this.setState((prevState) => {
            return { showSideDrawer: !this.state.showSideDrawer }
        });
    }

    render() {
        return (
            <Aux>
                <Toolbar toggleClicked={this.sideDrawerToggle} isauth={this.props.isAuthenticated} />
                <SideDrawer show={this.state.showSideDrawer} closed={this.sideDrawerClosed} isauth={this.props.isAuthenticated} />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );
    }
}


const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        username: state.auth.username
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Layout);
