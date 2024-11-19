import React from 'react'
import Page from '../Shared/Page';
import Navbar from '../Shared/Navbar';
import BreadCrumb from '../Shared/BreadCrumb';
import EarthquakeLeftNav from '../left-nav/EarthquakeLeftNav';
import CarPolicyDefault from '../Main/CarPolicyMain/CarPolicyDefault';
import Footer from '../Shared/Footer';

export const EarthquakePage = () => {
	console.log('EarthquakePage is rendered.');
	return (
		<Page>
			<Page.Header>
				<Navbar />
			</Page.Header>
			<Page.BreadCrumb>
				<BreadCrumb />
			</Page.BreadCrumb>
			<Page.Aside>
                <EarthquakeLeftNav/>
			</Page.Aside>
			<Page.Main>
				<CarPolicyDefault/>
			</Page.Main>
			<Page.Footer>
				<Footer />
			</Page.Footer>
		</Page>
	);
};


export default React.memo(EarthquakePage);
