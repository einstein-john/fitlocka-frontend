import { Outlet } from 'react-router';
import Ticker from './Ticker';
import Nav from './Nav';
import Footer from './Footer';

export default function Root() {
  return (
    <>
      <Ticker />
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
}
