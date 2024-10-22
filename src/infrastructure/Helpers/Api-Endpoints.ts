const baseUrl_v1 = 'http://localhost:8080/api/v1';
const baseUrl_v2 = 'http://localhost:8080/api/v2';

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
	},
	LicensePlate:{
		GetWithCustomer: `${baseUrl_v1}/licensePlate/WCustomer`,
	}

};
