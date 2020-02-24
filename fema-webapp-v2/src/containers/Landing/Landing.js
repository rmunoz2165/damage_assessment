import React, { Component } from 'react'
import classes from './Landing.css'
import Background from '../../assests/images/landing_page.jpg'
import NavigationItem from '../../components/Navigation/NavigationItems/NavigationItem/NavigationItem'
import { connect } from 'react-redux';


class Landing extends Component {
    render() {
        let nextPage = null;
        if (!this.props.isAuthenticated) {
            nextPage = <NavigationItem link="/login" exact>Login</NavigationItem>
        } else {
            nextPage = <NavigationItem link="/app" exact>Start</NavigationItem>
        }

        return (
            <div>
                <img className={classes.HeroImage} src={Background} alt="Logo" />
                <div className={classes.HeroText}>
                    <h1>This is not a official Site!!!</h1>
                    <p>Please agree to the terms and condiftions before starting!</p>
                    {nextPage}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};


export default connect(mapStateToProps, mapDispatchToProps)(Landing);
