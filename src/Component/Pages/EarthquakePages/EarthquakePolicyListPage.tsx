import Page from '../../Shared/Page';
import Navbar from '../../Shared/Navbar';
import BreadCrumb from '../../Shared/BreadCrumb';
import CarPolicyLeftNav from '../../left-nav/CarPolicyLeftNav';
import EntityList from '../../Main/EntityList';
import Footer from '../../Shared/Footer';
import React from 'react';
import CreateCustomer from '../../Main/CustomerMain/CreateCustomer';
import CustomerLeftNav from '../../left-nav/CustomerLeftNav';
import CustomerList from '../../Main/CustomerMain/CustomerList';
import CarPolicyList from '../../Main/CarPolicyMain/CarPolicyList';
import EarthquakeLeftNav from '../../left-nav/EarthquakeLeftNav';
import EarthquakePolicyList from '../../Main/EarthquakeMain/EarthquakePolicyList';


const EarthquakePolicyListPage = () => {
	console.log('CarPolicyListPage is rendered.');
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
				<EarthquakePolicyList />
			</Page.Main>
			<Page.Footer>
				<Footer />
			</Page.Footer>
		</Page>
	);
};

export default React.memo(EarthquakePolicyListPage);
