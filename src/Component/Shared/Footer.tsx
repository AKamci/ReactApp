import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
	console.log('Footer is rendered.');
	return (
		<footer className='mt-3 bg-dark px-3 py-2 text-center'>
			<p className='text-bg-dark'>&copy; {new Date().getFullYear()} SİGORTA X</p>
			<nav>
			<NavLink to='/' className={'nav-link'}>
			Privacy Policy
			</NavLink>
			<NavLink to='/' className={'nav-link'}>
			Terms Of Service
			</NavLink>
			<NavLink to='/' className={'nav-link'}>
			Contact
			</NavLink>
			</nav>
		</footer>
	);
};

export default React.memo(Footer);
