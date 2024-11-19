import EarthquakePolicyListPage from "../../Component/Pages/EarthquakePages/EarthquakePolicyListPage";

const baseUrl_v1 = 'http://localhost:8080/api/v1';
const baseUrl_v2 = 'http://localhost:8080/api/v1';

export default {
	Customers: {
		List: `${baseUrl_v1}/customer/list`,
		Delete: `${baseUrl_v1}/customer`,
		Create: `${baseUrl_v1}/customer`,
		Update: `${baseUrl_v1}/customer`,
		Get: `${baseUrl_v1}/customer`,
		Total: `${baseUrl_v1}/customer/totalRecord`,
	},
	CarPolicy:{
		Get: `${baseUrl_v2}/carPolicy`,
		Delete: `${baseUrl_v2}/carPolicy`,
		Create: `${baseUrl_v2}/carPolicy`,
		Update: `${baseUrl_v2}/carPolicy`,
		GetAll: `${baseUrl_v2}/carPolicy/list`,
		GetCustomerPolicies: `${baseUrl_v2}/carPolicy/customerPolicies`,
		GetCustomerPolicies_WDate: `${baseUrl_v2}/carPolicy/customerPoliciesBetweenDate`,
		GetCustomerPolicies_WPlate: `${baseUrl_v2}/carPolicy/byPlate`,
		TotalCarPolicy: `${baseUrl_v2}/carPolicy/totalRecord`,
		Accept: `${baseUrl_v2}/carPolicy/accepted`,
		Reject: `${baseUrl_v2}/carPolicy/rejected`,
	},
	LicensePlate:{
		GetWithCustomer: `${baseUrl_v1}/licensePlate/WCustomer`,
	},

	Weights:{

		GetWeight: `${baseUrl_v1}/weight`,
		DeleteWeight: `${baseUrl_v1}/weight`,
		CreateWeight: `${baseUrl_v1}/weight`,
		UpdateWeight: `${baseUrl_v1}/weight`,
		GetListWeight:`${baseUrl_v1}/weight/list`,
		UpdateListWeight:`${baseUrl_v1}/weight/saveAll`
	},
	HealthPolicyWeight:{
		CreateHealthPolicyWeight: `${baseUrl_v1}/healthPolicyWeight`,
		GetHealthPolicyWeight: `${baseUrl_v1}/healthPolicyWeight`,
		DeleteHealthPolicyWeight: `${baseUrl_v1}/healthPolicyWeight`,
		UpdateHealthPolicyWeight: `${baseUrl_v1}/healthPolicyWeight`,
		GetListHealthPolicyWeight:`${baseUrl_v1}/healthPolicyWeight/list`,
		UpdateListHealthPolicyWeight:`${baseUrl_v1}/healthPolicyWeight/saveAll`
	},

	EarthquakePolicyWeight:{

		GetEarthquakeWeight: `${baseUrl_v1}/earthquakePolicyWeight`,
		DeleteEarthquakeWeight: `${baseUrl_v1}/earthquakePolicyWeight`,
		CreateEarthquakeWeight: `${baseUrl_v1}/earthquakePolicyWeight`,
		UpdateEarthquakeWeight: `${baseUrl_v1}/earthquakePolicyWeight`,
		GetListEarthquakeWeight:`${baseUrl_v1}/earthquakePolicyWeight/list`,
		UpdateListEarthquakeWeight:`${baseUrl_v1}/earthquakePolicyWeight/saveAll`
	},

	EarthquakePolicy:{
		CreateEarthquake: `${baseUrl_v1}/earthQuake`,
		GetEarthquake: `${baseUrl_v1}/earthQuake`,
		DeleteEarthquake: `${baseUrl_v1}/earthQuake`,
		UpdateEarthquake: `${baseUrl_v1}/earthQuake`,
		AcceptEarthquake: `${baseUrl_v1}/earthQuake/accepted`,
		RejectEarthquake: `${baseUrl_v1}/earthQuake/rejected`,
		GetAllEarthquake: `${baseUrl_v1}/earthQuake/list`,
		TotalEarthquakePolicy: `${baseUrl_v1}/earthQuake/totalRecord`,

		
	},

	HealthPolicy:{
		CreateHealth: `${baseUrl_v1}/healthPolicy`,
		GetHealth: `${baseUrl_v1}/healthPolicy`,
		DeleteHealth: `${baseUrl_v1}/healthPolicy`,
		UpdateHealth: `${baseUrl_v1}/healthPolicy`,
		AcceptHealth: `${baseUrl_v1}/healthPolicy/accepted`,
		RejectHealth: `${baseUrl_v1}/healthPolicy/rejected`,
		GetAllHealth: `${baseUrl_v1}/healthPolicy/list`,
		TotalHealthPolicy: `${baseUrl_v1}/healthPolicy/totalRecord`,
	},
	House:{
		GetWithCustomer: `${baseUrl_v1}/house/WCustomer`,

	},
	PersonalHealth:{
		GetWithCustomer: `${baseUrl_v1}/personalHealth/WCustomer`,
		CreatePersonalHealth: `${baseUrl_v1}/personalHealth`,
		
	},

};
