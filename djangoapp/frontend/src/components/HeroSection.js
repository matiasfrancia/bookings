import React from 'react';
import { Button } from './Button';
import '../../static/css/HeroSection.css';
import '../../static/css/App.css';

function HeroSection() {
  return (
    <div className='hero-container'>
        <video src='/static/videos/video-2.mp4' autoPlay loop muted />
        <h1>YA ABRIMOS!</h1>
        <p>¿Qué estás esperando para visitarnos?</p>
        <div className='hero-btns'>
            <Button className='btns' buttonStyle='btn--outline' buttonSize='btn--large'>
                RESERVA
            </Button>
            <Button className='btns' buttonStyle='btn--primary' buttonSize='btn--large'>
                CONTÁCTANOS
            </Button>
        </div>
    </div>
  )
}

export default HeroSection;