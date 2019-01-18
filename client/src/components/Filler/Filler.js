import React, { Component } from 'react'
import { connect } from 'react-redux'

import './Filler.css'

class Filler extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="Filler" style={{ width: `${this.props.percentage}%` }} >
            </div>
        );
    }
}

const mapStateToProps = state => ({
    percentage: state.percentage
})

export default connect(
    mapStateToProps,
    null
)(Filler)