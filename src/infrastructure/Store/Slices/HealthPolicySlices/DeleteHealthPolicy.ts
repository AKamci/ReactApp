import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { EarthquakePolicyDto } from "../../../dto/EarthquakePolicyDto";
import { HealthPolicyDto } from "../../../dto/HealthPolicyDto";

export interface HealthPolicyState {
    data: HealthPolicyDto;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null; 
    errorMessage: string | null;   
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    data: {} as HealthPolicyDto, 
    responseStatus: null, 
    errorMessage: null    
} as HealthPolicyState;

export const deleteHealthPolicy = createAsyncThunk<HealthPolicyDto, { policyId: number }, { state: HealthPolicyState }>(
    'deleteHealthPolicy',
    async ({ policyId }, { rejectWithValue }) => {
        console.log("getCustomers with tckn:", policyId);
        

        try {
            const response = await axios.delete<HealthPolicyDto>(Endpoints.HealthPolicy.DeleteHealth, {
                params: {				
                    policyId: policyId
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

const deleteHealthPolicySlice = createSlice({
    name: 'deleteHealthPolicy',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(deleteHealthPolicy.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(deleteHealthPolicy.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(deleteHealthPolicy.rejected, (state, action) => {
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

export const { setActiveRequest } = deleteHealthPolicySlice.actions;

export default deleteHealthPolicySlice.reducer;
