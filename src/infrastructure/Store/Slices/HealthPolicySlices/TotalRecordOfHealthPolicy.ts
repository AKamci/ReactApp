import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';

export interface HelathPolicyState {
    
	state: ApiState;
	data: number;
}

const initialState = { state: ApiState.Idle, data:0 } as HelathPolicyState;

export const totalRecordHealthPolicy: AsyncThunk<number, void, HelathPolicyState> = createAsyncThunk(	
	'healthPolicy/totalRecord',
	async () => {
		const response = await axios.get<number>(Endpoints.HealthPolicy.TotalHealthPolicy);
		console.log(response.status)
		console.log(response.data)
		return response.data;
	}
);


const totalRecordHealthPolicySlice = createSlice({
	    name: 'totalRecordHealthPolicy',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(totalRecordHealthPolicy.pending, (state, action) => {
			state.state = ApiState.Pending;
		});
		builder.addCase(totalRecordHealthPolicy.fulfilled, (state, action) => {
			state.data = action.payload;
			state.state = ApiState.Fulfilled;
		});
		builder.addCase(totalRecordHealthPolicy.rejected, (state, action) => {
			state.state = ApiState.Rejected;
		});
	},
	reducers: {

	},
});

export default totalRecordHealthPolicySlice.reducer;