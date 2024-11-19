import BreadCrumb from "../../Shared/BreadCrumb";
import React from 'react';
import Footer from "../../Shared/Footer";
import Page from "../../Shared/Page";
import HealthPolicyLeftNav from "../../left-nav/HealthPolicyLeftNav";
import Navbar from '../../Shared/Navbar';
import GetHealthPolicy from '../../Main/HealthPolicyMain/GetHealthPolicy';

const GetHealthPolicyPage = () => {
	console.log('CreateHealthPolicyPage is rendered.');
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
			<GetHealthPolicy/>
			</Page.Main>
			<Page.Footer>
				<Footer />
			</Page.Footer>
		</Page>
	);
};

export default React.memo(GetHealthPolicyPage);
