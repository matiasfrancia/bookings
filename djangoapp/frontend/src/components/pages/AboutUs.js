import React from 'react'
import LandingTitle from '../LandingTitle'

function AboutUs() {
  return (
    <div>
        <LandingTitle title='NOSOTROS' background_image='img-1.jpg' />

        <div className='info__container'>

          <p className='block__title'>Nuestros orígenes</p>
          <div className='block__container'>
            <p className='block__text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis quam efficitur, 
            suscipit tellus in, lobortis enim. Morbi rhoncus interdum turpis, a pharetra nisi lobortis in. Proin faucibus 
            turpis odio, sit amet venenatis erat aliquet eget. Suspendisse potenti. Etiam accumsan efficitur.</p>
          </div>
          <div className='block__container'>
            <p className='block__text'>Pellentesque aliquet arcu sollicitudin tristique blandit. Cras quis ipsum id metus feugiat 
            malesuada. Donec feugiat venenatis condimentum. Vivamus a dignissim libero, ut pulvinar est. Donec eget tincidunt risus. 
            Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam auctor convallis turpis quis lobortis.</p>
          </div>

          <div className='block__image'>
          </div>

          <p className='block__title'>¿A qué aspiramos?</p>
          <div className='block__container'>
            <p className='block__text'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis quam efficitur, 
            suscipit tellus in, lobortis enim. Morbi rhoncus interdum turpis, a pharetra nisi lobortis in. Proin faucibus 
            turpis odio, sit amet venenatis erat aliquet eget. Suspendisse potenti. Etiam accumsan efficitur.</p>
          </div>
          <div className='block__container'>
            <p className='block__text'>Pellentesque aliquet arcu sollicitudin tristique blandit. Cras quis ipsum id metus feugiat 
            malesuada. Donec feugiat venenatis condimentum. Vivamus a dignissim libero, ut pulvinar est. Donec eget tincidunt risus. 
            Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam auctor convallis turpis quis lobortis.</p>
          </div>
        </div>
    </div>
  )
}

export default AboutUs