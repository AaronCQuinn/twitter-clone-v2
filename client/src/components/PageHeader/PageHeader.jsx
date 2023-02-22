import React from 'react'

const PageHeader = ({ title, children }) => {
  return (
    <div className="titleContainer">
        {children}
        <h1 className='titleContainerTitle'>{title}</h1>
    </div>
  )
}

export default PageHeader