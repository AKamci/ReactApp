const baseUrl = 'http://localhost:8080/api/v1';

export default {
	Customers: {
		List: `${baseUrl}/customer/list`,
		Delete: `${baseUrl}/customer`,
		Create: `${baseUrl}/customer`,
		Update: `${baseUrl}/customer`,
		Get: `${baseUrl}/customer`,

	},
};
