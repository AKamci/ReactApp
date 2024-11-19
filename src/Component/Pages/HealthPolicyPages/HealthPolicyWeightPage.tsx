import Page from '../../Shared/Page';
import Navbar from '../../Shared/Navbar';
import BreadCrumb from '../../Shared/BreadCrumb';
import CarPolicyLeftNav from '../../left-nav/CarPolicyLeftNav';
import EntityList from '../../Main/EntityList';
import Footer from '../../Shared/Footer';
import React from 'react';
import CreateCustomer from '../../Main/CustomerMain/CreateCustomer';
import HealthPolicyLeftNav from '../../left-nav/HealthPolicyLeftNav';
import HealthPolicyWeight from '../../Main/HealthPolicyMain/HealthPolicyWeight';

const HealthPolicyWeightPage = () => {
	console.log('HealthPolicyWeightPage is rendered.');
	return (
		<Page>
			<Page.Header>
				<Navbar />
			</Page.Header>
			<Page.BreadCrumb>
				<BreadCrumb />
			</Page.BreadCrumb>
			<Page.Aside>
                <HealthPolicyLeftNav/>
			</Page.Aside>
			<Page.Main>
				<HealthPolicyWeight />
			</Page.Main>
			<Page.Footer>
				<Footer />
			</Page.Footer>
		</Page>
	);
};

export default React.memo(HealthPolicyWeightPage);
