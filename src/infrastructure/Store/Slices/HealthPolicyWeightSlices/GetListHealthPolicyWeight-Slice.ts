import { WeightDto } from "../../../dto/WeightDto";
import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';

export interface HealthPolicyWeightState {
    data: Array<WeightDto>;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null; 
    errorMessage: string | null;   
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    data: [] as Array<WeightDto>, 
    responseStatus: null, 
    errorMessage: null    
} as HealthPolicyWeightState;

export const getAllHealthPolicyWeight = createAsyncThunk<Array<WeightDto>, void, { state: HealthPolicyWeightState }>(
    'healthPolicyWeight/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const query = `${Endpoints.HealthPolicyWeight.GetListHealthPolicyWeight}`;
            const response = await axios.get<Array<WeightDto>>(query);

            console.log("Status:", response.status);
            
            return response.data;
        } catch (error: any) {
            const status = error.response ? error.response.status : 500;
            const message = error.response?.data?.message || "An error occurred";
            console.error("Error status:", status, "Message:", message);
            return rejectWithValue({ status, message });
        }
    }
);

const getAllHealthPolicyWeightSlice = createSlice({
    name: 'getAllHealthPolicyWeight',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getAllHealthPolicyWeight.pending, (state) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(getAllHealthPolicyWeight.fulfilled, (state, action) => {
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;
            console.log(action.payload, "action.payload")   
        });
        builder.addCase(getAllHealthPolicyWeight.rejected, (state, action) => {
            state.state = ApiState.Rejected;
            if (action.payload) {
                state.responseStatus = (action.payload as any).status;  
                state.errorMessage = (action.payload as any).message;   
            } else {
                state.responseStatus = null; 
                state.errorMessage = "Unknown error occurred"; 
            }
        });
    },
    reducers: {
        setActiveRequest: (state, action) => {
            state.activeRequest = action.payload;
        },
    },
});

export const { setActiveRequest } = getAllHealthPolicyWeightSlice.actions;

export default getAllHealthPolicyWeightSlice.reducer;
