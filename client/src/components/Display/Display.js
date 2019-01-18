import React, { Component } from 'react'
import { connect } from 'react-redux'

import ScoreBar from '../ScoreBar/ScoreBar'
import './Display.css'

import { doInitialFetch } from '../../actions/index'

class Display extends Component {
    constructor(props) {
        super(props)

        this.state = { highScore: 0 }
    }

    componentDidUpdate() {
        if (this.props.score > this.state.highScore) {
            this.updateHighScore(this.props.score)
        }
    }

    updateHighScore = (newScore) => {
        this.setState({highScore: newScore})
    }

    findEnding = () => {
        let end = ''
        if (this.props.chosenRanking === 1) {
            end = 'st'
        } else if (this.props.chosenRanking === 2) {
            end = 'nd'
        } else if (this.props.chosenRanking === 3) {
            end = 'rd'
        } else {
            end = 'th'
        }
        return end
    }

    render() {
        let end = this.findEnding()
        let instructions 
        if(this.props.choices.length === 0) {
            if (this.props.titles.length === 1) {
                instructions = 
                    <div className="display-4 instructions"><h4>Score by picking the most prevalent color each turn</h4></div>
            }
        }
        else {
            instructions = <div></div>
        }
        return (
            <div className="Display">
                <div className="score_board">
                    <div className="container">
                        <div className="row">                            
                            <div className="col">
                                <button type="button" className="btn btn-secondary btn-block" onClick={() => {this.props.doInitialFetch('next', 5, this.props.titles)}}>Easy</button>
                            </div>
                            <div className="col">
                                <button type="button" className="btn btn-secondary btn-block" onClick={() => {this.props.doInitialFetch('next', 10, this.props.titles)}}>Medium</button>
                            </div>
                            <div className="col">
                                <button type="button" className="btn btn-secondary btn-block" onClick={() => {this.props.doInitialFetch('next', 15, this.props.titles)}}>Hard</button>
                            </div>                       
                        </div>
                        <div className="row">
                            <div className="col">
                                <h2 className="score display-4">{`Score: ${this.props.score}`}</h2>
                                { this.props.titles.length > 1 ? <h4 className="score">{`Your high score is: ${this.state.highScore}`}</h4> : <div></div> }
                                <ScoreBar />
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col">
                                <div style={this.props.choiceColor} ></div>
                                {
                                    this.props.chosenRanking ? <div><h3 className="score">{`was the ${this.props.chosenRanking}${end} most`}</h3><h3 className="score">{`common`}</h3></div> : <div></div>
                                }                                
                            </div>
                        </div>  
                        <br />
                        <div className="row">
                            <div className="col">
                                { this.props.chosenPlace === 1 ? <h1 className="score display-4">Score!</h1> : <div></div> }
                                { instructions }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                {
                                    this.props.percentage === 100 ? <img className="win" src="https://media.giphy.com/media/3oz8xAFtqoOUUrsh7W/giphy.gif"></img>: <div></div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    chosenPlace: state.chosen_place, 
    score: state.score,
    titles: state.titles,
    buttonStyles: state.button_styles,
    choiceColor: state.choice_color,
    percentage: state.percentage,
    choices: state.choices,
    chosenRanking: state.chosen_ranking
})

const mapDispatchToProps = dispatch => ({
    doInitialFetch: (load_type, num_colors, titles) => dispatch(doInitialFetch(load_type, num_colors, titles))
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Display)