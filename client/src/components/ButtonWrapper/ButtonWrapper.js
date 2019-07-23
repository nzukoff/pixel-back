import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '../Button/Button'

import './ButtonWrapper.css'

class ButtonWrapper extends Component {
    render() {        
        return (
            <div className="ButtonWrapper">
                {
                  this.props.button_styles.map((button_style, i) => {
                    return <div className='button'><Button key={i} place={i} buttonStyle={button_style}/></div>
                  })
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    button_styles : state.button_styles,
})

export default connect(
    mapStateToProps, 
    null
  )(ButtonWrapper)