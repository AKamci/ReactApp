import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';

export interface CustomerState {
    
	data: Array<CustomerDto>;
	state: ApiState;
	activeRequest:number | null;
	totalRecords: number;
}

const initialState = { state: ApiState.Idle, activeRequest: null, data:[], totalRecords:0 } as CustomerState;


export const loadCustomers: AsyncThunk<
    Array<CustomerDto>, 
    { page: number; size: number; name?: string; address?: string; phone?: string; email?: string; birthDay?: Date; gender?: string }, 
    CustomerState
> = createAsyncThunk(
    'customer/list',
    async ({ page, size, name, address, phone, email, birthDay, gender }) => {
        let query = `${Endpoints.Customers.List}?page=${page}&size=${size}`;

        if (name) query += `&name=${encodeURIComponent(name)}`;
        if (address) query += `&address=${encodeURIComponent(address)}`;
        if (phone) query += `&phone=${encodeURIComponent(phone)}`;
        if (email) query += `&email=${encodeURIComponent(email)}`;
        if (birthDay) query += `&birthDay=${birthDay.toISOString()}`;
        if (gender) query += `&gender=${encodeURIComponent(gender)}`;

		console.log("Query: ")
		console.log(query)

        const response = await axios.get<Array<CustomerDto>>(query);

        console.log(response.status);
        console.log(response.statusText);
		

        return response.data;
    }
);

const customersSlice = createSlice({
	name: 'customers',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(loadCustomers.pending, (state, action) => {
			state.state = ApiState.Pending;
		});
		builder.addCase(loadCustomers.fulfilled, (state, action) => {
			state.data = action.payload;
			state.state = ApiState.Fulfilled;
		});
		builder.addCase(loadCustomers.rejected, (state, action) => {
			state.state = ApiState.Rejected;
		});
	},
	reducers: {
		setActiveRequest: (state, action) => {
			state.activeRequest = action.payload;
		},
	},
});

export const { setActiveRequest } = customersSlice.actions;

export default customersSlice.reducer;