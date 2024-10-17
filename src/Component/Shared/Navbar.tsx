import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  console.log('Navbar is rendered.');

  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary'>
      <div className='container-fluid'>
        <NavLink to='/' className={'nav-link'} />
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarScroll'
          aria-controls='navbarScroll'
          aria-expanded='false'
          aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarScroll'>
          <ul className='navbar-nav my-lg-0 navbar-nav-scroll'>
            <li className='nav-item'>
              <NavLink
                to='/'
                className={({ isActive }) => 
                  isActive ? 'nav-link active-link' : 'nav-link'
                }>
                <FontAwesomeIcon icon={faHouse} /> Anasayfa
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink
                to='/customer'
                className={({ isActive }) => 
                  isActive ? 'nav-link active-link' : 'nav-link'
                }>
                <FontAwesomeIcon icon={faPerson} /> Müşteri İşlemleri
              </NavLink>
            </li>
          </ul>
          <ul className='navbar-nav my-lg-0 navbar-nav-scroll'>
            <li className='nav-item'>
              <NavLink
                to='/carPolicy'
                className={({ isActive }) => 
                  isActive ? 'nav-link active-link' : 'nav-link'
                }>
                <FontAwesomeIcon icon={faCar} /> Araba Poliçe İşlemleri
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
