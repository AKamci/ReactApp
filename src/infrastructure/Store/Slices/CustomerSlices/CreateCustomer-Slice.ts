import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';

export interface CustomerState {
    
	data: CustomerDto;
	state: ApiState;
	activeRequest:number | null;
	responseStatus:number | null;
}

const initialState = { state: ApiState.Idle, activeRequest: null } as CustomerState;

export const createCustomer = createAsyncThunk<CustomerDto, { dto: CustomerDto }, { state: CustomerState }>(
	'customer',
	async ({ dto }) => {
		console.log("Creating customer with dto:", dto);
		
		// Sending the dto as the request body
		const response = await axios.post<CustomerDto>(Endpoints.Customers.Create, dto);
		
		console.log("Status: ")
		console.log(response.status);
		//console.log(response.data);

		return response.data;
	}
);

const createCustomerSlice = createSlice({
	name: 'createCustomer',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(createCustomer.pending, (state, action) => {
			state.state = ApiState.Pending;
		});
		builder.addCase(createCustomer.fulfilled, (state, action) => {
			state.data = action.payload;
			state.state = ApiState.Fulfilled;
			
		});
		builder.addCase(createCustomer.rejected, (state, action) => {
			state.state = ApiState.Rejected;
		});
	},
	reducers: {
		setActiveRequest: (state, action) => {
			state.activeRequest = action.payload;
		},
	},
});

export const { setActiveRequest } = createCustomerSlice.actions;

export default createCustomerSlice.reducer;