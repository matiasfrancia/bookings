import React from 'react';
import '../../../static/css/App.css';
import Cards from './../Cards';
import HeroSection from './../HeroSection';

function Home() {
    return (
        <>
            <HeroSection />
            <Cards />
        </>
    );
}

export default Home;