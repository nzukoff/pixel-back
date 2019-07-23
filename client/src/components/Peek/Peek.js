import React, { Component } from 'react'
import { connect } from 'react-redux'

import './Peek.css'

import { sneakAPeak } from '../../actions/index'

class Peek extends Component {
    constructor(props) {
        super(props)

        this.state = { shown: false }
    }

    showImage = () => {
        if (this.props.sneakPeaks > 0) {
            if (!this.state.shown) {
                document.querySelector("#peek").src = "data:image/png;base64," + this.props.ogPngData;
                this.setState({shown: true})
                this.startTimer()
            } 
        }
    }

    startTimer = () => {
        let sec = 4
        const intervalId = setInterval(() => {
            document.querySelector("#time").innerHTML = sec
            if (sec > 0 ) {
                sec--
            } else {
                document.querySelector("#peek").src = "";
                this.setState({shown: false})
                clearInterval(intervalId);
            }
          }, 1000);
    }

    render() {
        return (
            <div className="Peek"> 
                <div className="row">                            
                    <div className="col">
                        <button type="button" className="btn btn-outline-secondary sneak-peek" onClick={() => {this.props.sneakAPeak(this.props.sneakPeaks); this.showImage()}}>Sneak Peek</button>
                        <div className="sneak-peaks">{`${this.props.sneakPeaks}x left`}</div>
                    </div>
                </div>
                <div className="row">                            
                    <div className="col">
                        { this.state.shown ? <div className="timer">Sneak peek for <span id="time">5</span> seconds!</div> : '' }
                        <img id="peek" src=""></img>
                    </div>             
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ogPngData: state.og_png_data, 
    sneakPeaks: state.sneak_peaks
})

const mapDispatchToProps = dispatch => ({
    sneakAPeak: (sneakPeaks) => dispatch(sneakAPeak(sneakPeaks))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Peek)