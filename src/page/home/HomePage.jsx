import React from 'react';
import HomeHeader from './header/HomeHeader';
import HomeBody from './body/HomeBody';
import HomeFooter from './footer/HomeFooter';

const HomePage = () => (
    <div className="bg-white">
    <HomeHeader />
    <HomeBody />
    <HomeFooter />
    </div>
  );

export default HomePage;