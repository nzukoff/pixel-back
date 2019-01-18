import React, { Component } from 'react';
import Filler from '../Filler/Filler'
import './ScoreBar.css'

class ScoreBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="ScoreBar VerticalStripes">
                <Filler />
            </div>
        );
    }
}

export default ScoreBar;