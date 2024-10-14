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


const initialState = { state: ApiState.Idle, activeRequest: null, data:{} as CustomerDto  } as CustomerState;

export const updateCustomers = createAsyncThunk<CustomerDto, { tckn: string }, { state: CustomerState }>(
	'customer',
	async ({ tckn }) => {
		console.log("getCustomers with tckn:", tckn);
		const response = await axios.get<CustomerDto>(Endpoints.Customers.Get, {
			params: {				
				tckn: tckn
			}
		});
		console.log(response.status);
		console.log(response.data);

		return response.data;
	}
);


const updateCustomerSlice = createSlice({
	name: 'updateCustomer',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(updateCustomers.pending, (state, action) => {
			state.state = ApiState.Pending;
		});
		builder.addCase(updateCustomers.fulfilled, (state, action) => {
			console.log("Müşteri verisi Redux'a geldi:", action.payload);
			state.data = action.payload;
			state.state = ApiState.Fulfilled;
		});
		builder.addCase(updateCustomers.rejected, (state, action) => {
			state.state = ApiState.Rejected;
		});
	},
	reducers: {
		setActiveRequest: (state, action) => {
			state.activeRequest = action.payload;
		},
	},
});

export const { setActiveRequest } = updateCustomerSlice.actions;

export default updateCustomerSlice.reducer;