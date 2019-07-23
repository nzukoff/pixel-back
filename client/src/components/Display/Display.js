import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FaRegSmile, FaRegTired, FaRegSurprise, FaRegFlushed, FaRegGrinStars } from 'react-icons/fa';

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
                        <div className="row difficulties">                            
                            <div className="col-3">
                                <div className="btn btn-outline-secondary difficulty" onClick={() => {this.props.doInitialFetch('next', 5, this.props.titles)}}><FaRegGrinStars className='options'/></div>
                            </div>
                            <div className="col-3">
                                <div className="btn btn-outline-secondary difficulty" onClick={() => {this.props.doInitialFetch('next', 10, this.props.titles)}}><FaRegSurprise className='options'/></div>
                            </div>
                            <div className="col-3">

                                <div className="btn btn-outline-secondary difficulty" onClick={() => {this.props.doInitialFetch('next', 15, this.props.titles)}}><FaRegFlushed className='options'/></div>
                            </div>                       
                        </div>
                        <div className="row">
                            <div class="col-5 col-lg-8">
                                <div className="score">{`Score: ${this.props.score}`}</div>
                            </div>
                            <div class="col-7 col-lg-4 ">
                                <div className="choice float-right">{this.props.chosenRanking ? this.props.chosenPlace === 1 ? <FaRegSmile className="correct"/> : <FaRegTired className="wrong"/>  : ''}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                              <div className="scorebar">
                                { this.props.titles.length > 1 ? <div className="highscore">{`Your high score is: ${this.state.highScore}`}</div> : <div></div> }
                                <ScoreBar />
                              </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="guess" style={this.props.choiceColor} ></div>
                                {
                                    this.props.chosenRanking ? <div><div className="common">{`was the ${this.props.chosenRanking}${end} most`}</div><div className="common">{`common`}</div></div> : <div></div>
                                }                                
                            </div>
                        </div>  
                        <div className="row">
                            <div className="col">
                                {
                                    this.props.percentage === 100 ? <img alt='you win!' className="win" src="https://media.giphy.com/media/3oz8xAFtqoOUUrsh7W/giphy.gif"></img>: <div></div>
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