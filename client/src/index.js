import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import './index.css'
import App from './App'
import rootReducer from './reducers/index'
import thunk from 'redux-thunk'
import mixpanel from 'mixpanel-browser'
import MixpanelMiddleware from 'redux-mixpanel-middleware'

const t = 'ea649757ae9f14683b0c30fbe49a39dc'

mixpanel.init(t)
const mixpanelMiddleware = new MixpanelMiddleware(mixpanel)
 
const store = createStore(rootReducer, applyMiddleware(thunk, mixpanelMiddleware))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
