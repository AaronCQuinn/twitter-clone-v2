import React from 'react'
import { createContext, useReducer } from 'react';

const ACTIONS = {
    UPDATE: 'update'
}

function reducer(state, action) {
    switch(action.type) {
        case ACTIONS.UPDATE: 
            // Add API call to grab timeline.
        default:
            return state;
    }
}

export const contextContext = createContext();
export const ContentContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, { posts });

  return (
    <AuthContext.Provider value={{state, dispatch}}>
    { children }
    </AuthContext.Provider>
  )
}

export default ContentContext