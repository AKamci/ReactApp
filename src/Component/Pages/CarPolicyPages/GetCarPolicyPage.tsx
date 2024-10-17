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
import GetCustomer from '../../Main/CustomerMain/GetCustomer';
import GetCarPolicy from '../../Main/CarPolicyMain/GetCarPolicy';

const GetCarPolicyPage = () => {
	console.log('GetCarPolicyPage is rendered.');
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
				<GetCarPolicy />
			</Page.Main>
			<Page.Footer>
				<Footer />
			</Page.Footer>
		</Page>
	);
};

export default React.memo(GetCarPolicyPage);
