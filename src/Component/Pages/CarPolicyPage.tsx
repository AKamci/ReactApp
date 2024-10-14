import Page from '../Shared/Page';
import Navbar from '../Shared/Navbar';
import BreadCrumb from '../Shared/BreadCrumb';
import CarPolicyLeftNav from '../left-nav/CarPolicyLeftNav';
import EntityList from '../Main/EntityList';
import Footer from '../Shared/Footer';
import React from 'react';

const CarPolicyPage = () => {
	console.log('CarPolicyPage is rendered.');
	return (
		<Page>
			<Page.Header>
				<Navbar />
			</Page.Header>
			<Page.BreadCrumb>
				<BreadCrumb />
			</Page.BreadCrumb>
			<Page.Aside>
                <CarPolicyLeftNav/>
			</Page.Aside>
			<Page.Main>
				<EntityList />
			</Page.Main>
			<Page.Footer>
				<Footer />
			</Page.Footer>
		</Page>
	);
};

export default React.memo(CarPolicyPage);
