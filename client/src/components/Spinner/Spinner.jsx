import React from 'react'
import { ScaleLoader } from 'react-spinners';
import './spinner.css';

const Spinner = () => {
  return (
    <div className="spinnerContainer">
        <ScaleLoader color='#1FA2F1'/>
    </div>
  )
}

export default Spinner