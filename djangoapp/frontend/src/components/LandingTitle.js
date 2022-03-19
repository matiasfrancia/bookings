import React from 'react'
import '../../static/css/LandingTitle.css'

function LandingTitle(props) {
  return (
    <div 
    className='content__wrapper' 
    style={{backgroundImage: `url(/static/images/${props.background_image})`}}
    >
        <div className='title__container'>
            <div className='title__wrapper'>
                <h1>{props.title}</h1>
            </div>
        </div>
    </div>
  )
}

export default LandingTitle