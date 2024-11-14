import Page from '../../Shared/Page';
import Navbar from '../../Shared/Navbar';
import BreadCrumb from '../../Shared/BreadCrumb';
import CarPolicyLeftNav from '../../left-nav/CarPolicyLeftNav';
import EntityList from '../../Main/EntityList';
import Footer from '../../Shared/Footer';
import React from 'react';
import CreateCustomer from '../../Main/CustomerMain/CreateCustomer';
import CustomerLeftNav from '../../left-nav/CustomerLeftNav';
import CreateCarPolicy from '../../Main/CarPolicyMain/CreateCarPolicy';
import EarthquakeLeftNav from '../../left-nav/EarthquakeLeftNav';
import CreateEarthquakePolicy from '../../Main/EarthquakeMain/CreateEarthquakePolicy';

const CreateEarthquakePolicyPage = () => {
	console.log('CreateCarPolicyPage is rendered.');
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
				<CreateEarthquakePolicy />
			</Page.Main>
			<Page.Footer>
				<Footer />
			</Page.Footer>
		</Page>
	);
};

export default React.memo(CreateEarthquakePolicyPage);
