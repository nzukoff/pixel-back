import React, { Component } from 'react';
import { connect } from 'react-redux'

import './Image.css' 

class Image extends Component {
    constructor(props) {
        super(props)
    }
    
    componentDidUpdate() {
        this.createImage()
    }

    createImage = () => {
        document.querySelector("#image").src = "data:image/png;base64," + this.props.pngData;
    }

    render() {
        return (
            <div className="Image">
                <img id="image" src=""></img>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    imageSize: state.image_size, 
    pngData: state.png_data
})


export default connect(
    mapStateToProps,
    null
)(Image)