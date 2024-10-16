const baseUrl = 'http://localhost:8080/api/v1';

export default {
	Customers: {
		List: `${baseUrl}/customer/list`,
		Delete: `${baseUrl}/customer`,
		Create: `${baseUrl}/customer`,
		Update: `${baseUrl}/customer`,
		Get: `${baseUrl}/customer`,
		Total: `${baseUrl}/customer/totalRecord`,
	},
	CarPolicy:{
		Get: `${baseUrl}/carPolicy`,
		Delete: `${baseUrl}/carPolicy`,
		Create: `${baseUrl}/carPolicy`,
		Update: `${baseUrl}/carPolicy`,
		GetAll: `${baseUrl}/carPolicy/list`,
		GetCustomerPolicies: `${baseUrl}/carPolicy/customerPolicies`,
		GetCustomerPolicies_WDate: `${baseUrl}/carPolicy/customerPoliciesBetweenDate`,
		GetCustomerPolicies_WPlate: `${baseUrl}/carPolicy/byPlate`,
		TotalCarPolicy: `${baseUrl}/carPolicy/totalRecord`,

	},
};
