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

export const loadCustomers: AsyncThunk<Array<CustomerDto>, { page: number, size: number }, CustomerState> = createAsyncThunk(
    'customer/list',
    async ({ page, size }) => {
        const response = await axios.get<Array<CustomerDto>>(`${Endpoints.Customers.List}?page=${page}&size=${size}`);
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