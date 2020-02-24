import React from 'react';

import classes from './Input.css'

function Input(props) {
    let inputElement = null;
    let inputClasses = [classes.InputElement]
    if (!props.valid && props.touched) {
        inputClasses.push(classes.Invalid)
    }
    let finalElement = null;

    switch (props.elementType) {
        case ('input'):
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value} onChange={props.changed} />;
            finalElement = <div
                className={classes.Input}>
                <div className={classes.col25}>
                    <label className={classes.DesktopOnly}>{props.lblTxt}</label>
                </div>
                <div className={classes.col75}>
                    {inputElement}
                </div>
            </div>
            break;
        case ('textarea'):
            inputElement = <textarea
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value} onChange={props.changed} />;
            finalElement = <div
                className={classes.Input}>
                <div className={classes.col25}>
                    <label className={classes.DesktopOnly} for={props.fieldname}>{props.elementConfig.labelTxt}</label>
                </div>
                <div className={classes.col75}>
                    {inputElement}
                </div>
            </div>
            break;
        case ('select'):
            let options = props.elementConfig.options.map((opt) => {
                return <option key={opt.value} value={opt.value}>{opt.displayValue}</option>
            })
            inputElement = (
                <select
                    className={inputClasses.join(' ')}
                    onChange={props.changed}>
                    {options}
                </select>);
            finalElement = <div
                className={classes.Input}>
                <div className={classes.col25}>
                    <label className={classes.DesktopOnly} >{props.lblTxt}</label>
                </div>
                <div className={classes.col75}>
                    {inputElement}
                </div>
            </div>
            break;
        case ('imageFileSelector'):
            inputElement = (
                <input
                    type="file" 
                    onChange={props.changed}
                    className={inputClasses.join(' ')} 
                    multiple />
            );
            finalElement = <div
                className={classes.Input}>
                <div className={classes.col25}>

                    <label className={classes.DesktopOnly} >{props.lblTxt}</label>
                </div>
                <div className={classes.col75}>
                    {inputElement}
                </div>
            </div>
            break;

        default:
            inputElement = <input
                className={inputClasses.join(' ')}
                {...props.elementConfig}
                value={props.value} onChange={props.changed} />
    }

    return (
        <div className={classes.Input}>
            {finalElement}
        </div>
    );
}

export default Input;