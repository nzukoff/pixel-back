import React, { Component } from 'react'
import { connect } from 'react-redux'
import Image from './components/Image/Image'
import Button from './components/Button/Button'
import Display from './components/Display/Display'
import Peek from './components/Peek/Peek'

import { doInitialFetch } from './actions/index'

import './Game.css'

class Game extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.doInitialFetch('new', 10, this.props.titles)
    }

    render() {        
        return (
            <div className="Game">
                <div className="row">
                    <div className="col">
                        <Peek />
                    </div>
                        <div className="col-auto">
                        <Image />
                        {
                            this.props.button_styles.map((button_style, i) => {
                                return <Button key={i} place={i} buttonStyle={button_style}/>
                            })
                        }
                    </div>
                    <div className="col">
                        <Display />
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