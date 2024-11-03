import React from 'react'
import Page from '../Shared/Page';
import Navbar from '../Shared/Navbar';
import BreadCrumb from '../Shared/BreadCrumb';
import WeightList from '../Main/WeightMain/WeightList';
import Footer from '../Shared/Footer';

const WeightsPage = () => {
	console.log('CustomerPage is rendered.');
	return (
		<Page>
			<Page.Header>
				<Navbar />
			</Page.Header>
			<Page.BreadCrumb>
				<BreadCrumb />
			</Page.BreadCrumb>
			<Page.Main fullPage>
			<WeightList/>
			</Page.Main>
			<Page.Footer>
				<Footer />
			</Page.Footer>
		</Page>
	);
}

export default WeightsPage