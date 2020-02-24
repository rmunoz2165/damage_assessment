
import React, { Component } from "react";


function asyncComponent(importComponent) {
    return class extends Component {
        state = {
            component: null
        }

        componentDidMount() {
            importComponent().then(cmp => {
                this.setState({component: cmp.default});
            }).catch(error => {
                console.log(error);
            });
        }

        render() {
            const C = this.state.component
            return C? <C {...this.props} /> : null;
        }
        
    }
}

export default asyncComponent;