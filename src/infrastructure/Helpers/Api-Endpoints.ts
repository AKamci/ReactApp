const baseUrl = 'http://localhost:8080/api/v1';

export default {
	Customers: {
		List: `${baseUrl}/customer/list`,
		Delete: `${baseUrl}/customer`,
		Post: `${baseUrl}/customer`,
		Put: `${baseUrl}/customer`,
		Get: `${baseUrl}/customer`,

	},
};
