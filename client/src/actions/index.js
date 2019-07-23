import axios from 'axios'

export const doInitialFetch = (load_type, num_colors, titles) => {
    return async (dispatch) => {
        const url = `/api/load/${load_type}`
        const response = await axios.post(url, {titles})
        const image_size = response.data.image_size
        const png_data = response.data.png_data
        const title = response.data.title
        titles = response.data.titles
        dispatch(doInitialFetchSuccess(image_size, png_data, titles, num_colors))
        dispatch(getColorOptions(num_colors, image_size, title))
    }
}
    
export const doInitialFetchSuccess = (image_size, png_data, titles, num_colors) => ({
    type: 'DO_INITIAL_FETCH_SUCCESS',
    image_size, 
    png_data,
    titles,
    meta: {
        mixpanel: {
            event: 'Load Game',
            props: {
                titles: titles,
                difficulty: num_colors
            }
        }
    }
})

export const getColorOptions = (num_colors, image_size, title) => {
    return async (dispatch) => {
        const url = `/api/options/${num_colors}?title=${title}`
        const response = await axios.get(url)
        const color_options = response.data.color_options
        const labels = response.data.labels
        dispatch(getColorOptionsSuccess(color_options, labels, title))
        dispatch(setButtonStyles(null, image_size, color_options))
    }
}

export const getColorOptionsSuccess = (color_options, labels, title) => ({
    type: 'GET_COLOR_OPTIONS_SUCCESS',
    color_options, 
    labels,
    title
})

export const setButtonStyles = (choice, image_size, color_options, chosen_place) => {
    let button_dim = (image_size[0]/5)-2
    let choice_color
    let button_styles = color_options.map((color, index) => {
        if (index === choice) {
            if (chosen_place === 1){
                choice_color = {
                    backgroundColor: `rgb(${color})`, 
                    width: `${button_dim}px`,
                    height: `${button_dim}px`,
                    border: '1px solid rgb(0,200,83)',
                    borderRadius: '10px',
                    margin: '1px'
                } 
            } else {
                choice_color = {
                    backgroundColor: `rgb(${color})`, 
                    width: `${button_dim}px`,
                    height: `${button_dim}px`,
                    border: '1px solid rgb(205,208,210)',
                    borderRadius: '10px',
                    margin: '1px'
                }
            }            
            color = [236, 249, 249]
        }
        return {
            backgroundColor: `rgb(${color})`, 
            width: `${button_dim}px`,
            height: `${button_dim}px`,
            border: '1px solid rgb(205,208,210)',
            borderRadius: '10px',
            margin: '1px'
        }
    })
    color_options[choice] = [236, 249, 249]
    return ({
        type: 'SET_BUTTON_STYLES',
        button_styles,
        choice_color,
        color_options
    })
}

export const chooseColor = (choice, choices, image_size, labels, title, color_options, percentage) => {
    return async (dispatch) => {
        const url = `/api/choose/${choice}?title=${title}`
        const response = await axios.post(url, { labels, choices })
        const png_data = response.data.png_data
        const chosen_place = response.data.chosen_place
        const chosen_ranking = response.data.chosen_ranking
        choices = response.data.choices
        dispatch(chooseColorSuccess(png_data, chosen_place, choices, color_options, percentage, chosen_ranking))
        dispatch(setButtonStyles(choice, image_size, color_options, chosen_place))
    }
}

export const chooseColorSuccess = (png_data, chosen_place, choices, color_options, current_percentage, chosen_ranking) => {
    let percentage = 0
    let score = 0
    let win = false
    let end = false
    if (chosen_place === 1) {
        percentage  = (100/color_options.length)
        score = 10
    }
    if (choices.length === color_options.length) {
        end = true
    }
    if (chosen_place === 1 && current_percentage === 100-percentage) {
        win = true
    }
    return ({
        type: 'CHOOSE_COLOR_SUCCESS', 
        png_data, 
        color_options, 
        chosen_place, 
        choices,
        percentage, 
        score,
        chosen_ranking,
        meta: {
            mixpanel: {
                event: 'Choose Color',
                props: {
                    percentage: current_percentage,
                    win: win,
                    end: end
                }
            }
        }
    })
}

export const sneakAPeak = (sneakPeaks) => {
    if (sneakPeaks > 0) {
        --sneakPeaks
    }
    return {
        type: 'SNEAK_A_PEAK',
        sneakPeaks
    }
}

export const unsetClick = (button_colored, choice) => {
    return {
        type: 'UNSET_CLICK',
        button_colored: button_colored.map((colored, i ) => {return i === choice || colored === false ? false : true})
    }
}
