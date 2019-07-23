import React, { Component } from 'react'
import { connect } from 'react-redux'

import { chooseColor, unsetClick } from '../../actions/index'

class Button extends Component {
    render() {
        let buttonStyle
        let currentBackground = this.props.buttonStyle.backgroundColor
        if (currentBackground === 'rgb(236,249,249)' || currentBackground === 'rgb()') {
            buttonStyle = {
                ...this.props.buttonStyle,
                border: 'rgb(236,249,249)'
            }
        }
        else {
            buttonStyle = this.props.buttonStyle
        }
        return (
            <div style={buttonStyle} onClick={this.props.button_colored[this.props.place] ? async () => { await this.props.unsetClick(this.props.button_colored, this.props.place); await this.props.chooseColor(this.props.place, this.props.choices, this.props.image_size, this.props.labels, this.props.title, this.props.color_options, this.props.percentage)} : null}></div>
        );
    }
}

const mapStateToProps = state => ({
    image_size: state.image_size, 
    labels: state.labels,
    title: state.title, 
    color_options: state.color_options, 
    choices: state.choices,
    percentage: state.percentage,
    button_colored: state.button_colored
})

const mapDispatchToProps = dispatch => ({
    chooseColor: (choice, choices, image_size, labels, title, color_options, percentage) => dispatch(chooseColor(choice, choices, image_size, labels, title, color_options, percentage)),
    unsetClick: (button_colored, choice) => dispatch(unsetClick(button_colored, choice))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Button)