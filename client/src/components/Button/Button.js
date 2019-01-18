import React, { Component } from 'react'
import { connect } from 'react-redux'

import { chooseColor } from '../../actions/index'

class Button extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let buttonStyle
        let currentBackground = this.props.buttonStyle.backgroundColor
        if (currentBackground === 'rgb(236,249,249)' || currentBackground === 'rgb()') {
            buttonStyle = {
                ...this.props.buttonStyle,
                border: 'none',
                margin: '2px',
            }
        }
        else {
            buttonStyle = this.props.buttonStyle
        }
        return (
            <div className="Button">
                <div style={buttonStyle} onClick={() => {this.props.chooseColor(this.props.place, this.props.choices, this.props.image_size, this.props.labels, this.props.title, this.props.color_options, this.props.percentage)}}></div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    image_size: state.image_size, 
    labels: state.labels,
    title: state.title, 
    color_options: state.color_options, 
    choices: state.choices,
    percentage: state.percentage
})

const mapDispatchToProps = dispatch => ({
    chooseColor: (choice, choices, image_size, labels, title, color_options, percentage) => dispatch(chooseColor(choice, choices, image_size, labels, title, color_options, percentage))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Button)