import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { CarPolicyDto } from "../../../dto/CarPolicyDto";
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

export const updateHealthPolicy = createAsyncThunk<HealthPolicyDto, { dto: HealthPolicyDto }, { state: HealthPolicyState }>(
    'updateHealthPolicy',
    async ({ dto }, { rejectWithValue }) => {
        console.log(dto, "DTO")
        try {
            const response = await axios.put<HealthPolicyDto>(Endpoints.HealthPolicy.UpdateHealth,dto);
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

const updateHealthPolicySlice = createSlice({
    name: 'updateHealthPolicy',
    initialState,
    extraReducers: (builder) => {
            builder.addCase(updateHealthPolicy.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(updateHealthPolicy.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(updateHealthPolicy.rejected, (state, action) => {
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

export const { setActiveRequest } = updateHealthPolicySlice.actions;

export default updateHealthPolicySlice.reducer;
