import React, { Component } from 'react'
import { connect } from 'react-redux'
import Image from './components/Image/Image'
import ButtonWrapper from './components/ButtonWrapper/ButtonWrapper'
import Display from './components/Display/Display'
import Peek from './components/Peek/Peek'

import { doInitialFetch } from './actions/index'

import './Game.css'

class Game extends Component {
    componentDidMount() {
        this.props.doInitialFetch('new', 10, this.props.titles)
    }

    render() {        
        return (
            <div className="Game">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-3">
                            <Peek />
                        </div>
                        <div className="col container text-center center-col" >
                            <Image />
                            <ButtonWrapper/>
                        </div>
                        <div className="col">
                            <Display />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    button_styles : state.button_styles,
    titles : state.titles
})

const mapDispatchToProps = dispatch => ({
    doInitialFetch: (load_type, num_colors, titles) => dispatch(doInitialFetch(load_type, num_colors, titles))
})

export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(Game)