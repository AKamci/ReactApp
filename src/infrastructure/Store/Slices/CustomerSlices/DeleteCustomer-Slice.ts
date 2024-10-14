import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';

export interface CustomerState {
    
	data: CustomerDto;
	state: ApiState;
	activeRequest:number | null;
}

const initialState = { state: ApiState.Idle, activeRequest: null } as CustomerState;

export const deleteCustomers = createAsyncThunk<CustomerDto, { tckn: string }, { state: CustomerState }>(
	'customer',
	async ({ tckn }) => {
		console.log("getCustomers with tckn:", tckn);
		const response = await axios.delete<CustomerDto>(Endpoints.Customers.Delete, {
			params: {				
				tckn: tckn
			}
		});
		console.log(response.status);
		console.log(response.data);

		return response.data;
	}
);

const deleteCustomerSlice = createSlice({
	name: 'deleteCustomer',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(deleteCustomers.pending, (state, action) => {
			state.state = ApiState.Pending;
		});
		builder.addCase(deleteCustomers.fulfilled, (state, action) => {
			state.data = action.payload;
			state.state = ApiState.Fulfilled;
		});
		builder.addCase(deleteCustomers.rejected, (state, action) => {
			state.state = ApiState.Rejected;
		});
	},
	reducers: {
		setActiveRequest: (state, action) => {
			state.activeRequest = action.payload;
		},
	},
});

export const { setActiveRequest } = deleteCustomerSlice.actions;

export default deleteCustomerSlice.reducer;