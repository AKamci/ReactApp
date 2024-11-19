import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { WeightDto } from "../../../dto/WeightDto";

export interface HealthPolicyWeightState {
    data: WeightDto;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null; 
    errorMessage: string | null;   
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    data: {} as WeightDto, 
    responseStatus: null, 
    errorMessage: null    
} as HealthPolicyWeightState;

export const deleteHealthPolicyWeight = createAsyncThunk<WeightDto, { key: string }, { state: HealthPolicyWeightState }>(
    'healthPolicyWeight',
    async ({ key }, { rejectWithValue }) => {
        console.log("Weight with weightKey:", key);     
        try {
            const response = await axios.delete<WeightDto>(Endpoints.HealthPolicyWeight.DeleteHealthPolicyWeight, {
                params: {				
                    key: key
                }
            });
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

const deleteHealthPolicyWeightSlice = createSlice({
    name: 'deleteHealthPolicyWeight',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(deleteHealthPolicyWeight.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(deleteHealthPolicyWeight.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(deleteHealthPolicyWeight.rejected, (state, action) => {
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

export const { setActiveRequest } = deleteHealthPolicyWeightSlice.actions;

export default deleteHealthPolicyWeightSlice.reducer;
