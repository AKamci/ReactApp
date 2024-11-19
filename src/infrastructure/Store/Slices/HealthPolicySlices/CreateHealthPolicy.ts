import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Endpoints from '../../../Helpers/Api-Endpoints';
import { EarthquakePolicyDto } from '../../../dto/EarthquakePolicyDto';
import ApiState from '../../../Enums/ApiState';
import { HealthPolicyDto } from '../../../dto/HealthPolicyDto';

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

export const createHealthPolicy = createAsyncThunk<HealthPolicyDto, { dto: HealthPolicyDto }, { state: HealthPolicyState }>(
    'createHealthPolicy',
    async ({ dto }, { rejectWithValue }) => {
        console.log("Create a Policy:", dto);
        
        try {
            const response = await axios.post<HealthPolicyDto>(Endpoints.HealthPolicy.CreateHealth, dto);
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

const createHealthPolicySlice = createSlice({
    name: 'createHealthPolicy',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(createHealthPolicy.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(createHealthPolicy.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(createHealthPolicy.rejected, (state, action) => {
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
        resetResponseStatus: (state) => {
            state.responseStatus = null;  
        },
    },
});

export const { setActiveRequest, resetResponseStatus } = createHealthPolicySlice.actions;

export default createHealthPolicySlice.reducer;
