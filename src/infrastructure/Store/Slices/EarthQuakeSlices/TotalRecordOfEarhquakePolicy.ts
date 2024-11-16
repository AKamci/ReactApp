import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';

export interface EarthquakePolicyState {
    
	state: ApiState;
	data: number;
}

const initialState = { state: ApiState.Idle, data:0 } as EarthquakePolicyState;

export const totalRecordEarthquakePolicy: AsyncThunk<number, void, EarthquakePolicyState> = createAsyncThunk(	
	'earthquakePolicy/totalRecord',
	async () => {
		const response = await axios.get<number>(Endpoints.EarthquakePolicy.TotalEarthquakePolicy);
		console.log(response.status)
		console.log(response.data)
		return response.data;
	}
);


const totalRecordCarPolicySlice = createSlice({
	    name: 'totalRecordCarPolicy',
	initialState,
	extraReducers: (builder) => {
		builder.addCase(totalRecordEarthquakePolicy.pending, (state, action) => {
			state.state = ApiState.Pending;
		});
		builder.addCase(totalRecordEarthquakePolicy.fulfilled, (state, action) => {
			state.data = action.payload;
			state.state = ApiState.Fulfilled;
		});
		builder.addCase(totalRecordEarthquakePolicy.rejected, (state, action) => {
			state.state = ApiState.Rejected;
		});
	},
	reducers: {

	},
});

export default totalRecordCarPolicySlice.reducer;