import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';

export interface CustomerState {
    
	state: ApiState;
	data: number;
}

const initialState = { state: ApiState.Idle, data:0 } as CustomerState;

export const totalRecords: AsyncThunk<number, void, CustomerState> = createAsyncThunk(	
	'customer/totalRecord',
	async () => {
		console.log("loadCustomers")
		const response = await axios.get<number>(Endpoints.Customers.Total);
		console.log(response.status)
		console.log(response.data)
		return response.data;
	}
);


const totalRecordSlice = createSlice({
	name: 'totalRecord',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(totalRecords.pending, (state, action) => {
			state.state = ApiState.Pending;
		});
		builder.addCase(totalRecords.fulfilled, (state, action) => {
			state.data = action.payload;
			state.state = ApiState.Fulfilled;
		});
		builder.addCase(totalRecords.rejected, (state, action) => {
			state.state = ApiState.Rejected;
		});
	},
	reducers: {

	},
});

export default totalRecordSlice.reducer;