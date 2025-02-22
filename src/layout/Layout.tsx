
import Header from './Header/Header';
import { Footer } from './Footer/Footer';
import { Outlet } from 'react-router-dom';
import "@/App.css"

import  Container  from '@/components/Container';
import ParticlesComponent from '@/components/Particles';

const Layout = () => {
 

  return (
    <div className='relative min-h-screen'>
      <Container/>
      <ParticlesComponent id="particles" />
        <Header />
        <div className='relative'>
        <Outlet  />
        </div>
        <Footer  />
    </div>
  );
};

export default Layout;
