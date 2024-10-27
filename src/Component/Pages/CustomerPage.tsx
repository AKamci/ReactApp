import Page from '../Shared/Page';
import Navbar from '../Shared/Navbar';
import BreadCrumb from '../Shared/BreadCrumb';
import CustomerLeftNav from '../left-nav/CustomerLeftNav';
import EntityList from '../Main/EntityList';
import Footer from '../Shared/Footer';
import React from 'react';
import CustomerDefault from '../Main/CustomerMain/CustomerDefault';

const CustomerPage = () => {
	console.log('CustomerPage is rendered.');
	return (
		<Page>
			<Page.Header>
				<Navbar />
			</Page.Header>
			<Page.BreadCrumb>
				<BreadCrumb />
			</Page.BreadCrumb>
			<Page.Aside>
                <CustomerLeftNav/>
			</Page.Aside>
			<Page.Main>
			<CustomerDefault/>
			</Page.Main>
			<Page.Footer>
				<Footer />
			</Page.Footer>
		</Page>
	);
};

export default React.memo(CustomerPage);
