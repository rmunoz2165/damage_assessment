import React, { Component } from 'react'
import Button from '../../components/Layout/UI/Button/Button'

export default class ConfirmProcess extends Component {
    render() {
        let cancel = null
        if (this.props.applicationCanceled) {
            cancel = <Button btnType="Danger" clicked={this.props.applicationCanceled}>CANCEL</Button>
        }

        let success = null
        if (this.props.applicationContinue) {
            success = <Button btnType="Success" clicked={this.props.applicationContinue}>PROCESS</Button>
        }

        let done = null
        if (this.props.applicationDone) {
            done = <Button btnType="Success" clicked={this.props.applicationDone}>DONE</Button>
        }

        return (
            <div>
                <h4>{this.props.message}</h4>
                {cancel}
                {success}
                {done}
            </div>
        )
    }
}
