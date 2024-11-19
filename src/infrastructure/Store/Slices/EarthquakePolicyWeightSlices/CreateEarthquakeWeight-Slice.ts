import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { CarPolicyDto } from "../../../dto/CarPolicyDto";
import { WeightDto } from "../../../dto/WeightDto";

export interface EarthquakeWeightState {
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
} as EarthquakeWeightState;

export const createEarthquakeWeight = createAsyncThunk<WeightDto, { dto: WeightDto }, { state: EarthquakeWeightState }>(
    'createEarthquakeWeight',
    async ({ dto }, { rejectWithValue }) => {
        console.log("Create a Weight:", dto);
        
        try {
            const response = await axios.post<WeightDto>(Endpoints.EarthquakePolicyWeight.CreateEarthquakeWeight, dto);
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

const createEarthquakeWeightSlice = createSlice({
    name: 'createEarthquakeWeight',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(createEarthquakeWeight.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(createEarthquakeWeight.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(createEarthquakeWeight.rejected, (state, action) => {
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

export const { setActiveRequest, resetResponseStatus } = createEarthquakeWeightSlice.actions;

export default createEarthquakeWeightSlice.reducer;
