import React from 'react'
import LandingTitle from '../LandingTitle'

function AboutUs() {
  return (
    <div>
        <LandingTitle title='NOSOTROS' background_image='img-1.jpg' />

        <div className='info__container'>

          <p className='block__title'>Nuestros orígenes</p>
          <div className='block__container'>
            <p className='block__text'>En una casa tradicional de fines del siglo XIX situada en el casco histórico del cerro alegre. 
            A través de una pintura mural de 200 metros cuadrados, podrás vivenciar una inmersión en un paisaje fantástico. 
            Donde transitarás desde la playa y el borde costero hasya la cordillera de los andes pasando por lagunas, humedales, 
            ríos y cascadas</p>
          </div>
          <div className='block__container'>
            <p className='block__text'>Recorriendo la flora autóctona con especies endémicas de la zona mediterránea. 
            Podrás además, observar en su habitat natural 180 especies de aves residentes y emigrantes frecuentes de la 
            Región de Valparaíso, junto a mamíferos en tamaño natural como el puma, el zorro y la wiña</p>
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