import BreadCrumb from "../Shared/BreadCrumb";
import React from 'react';
import CarPolicyDefault from "../Main/CarPolicyMain/CarPolicyDefault";
import Footer from "../Shared/Footer";
import Page from "../Shared/Page";
import Navbar from '../Shared/Navbar';
import HealthPolicyLeftNav from "../left-nav/HealthPolicyLeftNav";

const HealthPolicyPage = () => {
	console.log('HealthPolicyPage is rendered.');
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
			<CarPolicyDefault/>
			</Page.Main>
			<Page.Footer>
				<Footer />
			</Page.Footer>
		</Page>
	);
};

export default React.memo(HealthPolicyPage);
