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



export const updateCustomer = createAsyncThunk<CustomerDto, { dto: CustomerDto }, { state: CustomerState }>(
	'customer',
	async ({ dto }) => {
		console.log("Creating customer with dto:", dto);
		
		// Sending the dto as the request body
		const response = await axios.put<CustomerDto>(Endpoints.Customers.Create, dto);
		
		console.log("Status: ")
		console.log(response.status);
		//console.log(response.data);

		return response.data;
	}
);


const updateCustomerSlice = createSlice({
	name: 'updateCustomer',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(updateCustomer.pending, (state, action) => {
			state.state = ApiState.Pending;
		});
		builder.addCase(updateCustomer.fulfilled, (state, action) => {
			console.log("Müşteri verisi Redux'a geldi:", action.payload);
			state.data = action.payload;
			state.state = ApiState.Fulfilled;
		});
		builder.addCase(updateCustomer.rejected, (state, action) => {
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