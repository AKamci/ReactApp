import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';

export interface CarPolicyState {
    
	state: ApiState;
	data: number;
}

const initialState = { state: ApiState.Idle, data:0 } as CarPolicyState;

export const totalRecordCarPolicy: AsyncThunk<number, void, CarPolicyState> = createAsyncThunk(	
	'carPolicy/totalRecord',
	async () => {
		const response = await axios.get<number>(Endpoints.CarPolicy.TotalCarPolicy);
		console.log(response.status)
		console.log(response.data)
		return response.data;
	}
);


const totalRecordCarPolicySlice = createSlice({
	name: 'totalRecordCarPolicy',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(totalRecordCarPolicy.pending, (state, action) => {
			state.state = ApiState.Pending;
		});
		builder.addCase(totalRecordCarPolicy.fulfilled, (state, action) => {
			state.data = action.payload;
			state.state = ApiState.Fulfilled;
		});
		builder.addCase(totalRecordCarPolicy.rejected, (state, action) => {
			state.state = ApiState.Rejected;
		});
	},
	reducers: {

	},
});

export default totalRecordCarPolicySlice.reducer;