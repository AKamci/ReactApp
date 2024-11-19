import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { CarPolicyDto } from "../../../dto/CarPolicyDto";
import { WeightDto } from "../../../dto/WeightDto";

export interface EarthquakeWeightState {
    data: Array<WeightDto>;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null; 
    errorMessage: string | null;   
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    data: {} as Array<WeightDto>, 
    responseStatus: null, 
    errorMessage: null    
} as EarthquakeWeightState;

export const updateListEarthquakeWeight = createAsyncThunk<Array<WeightDto>, { dto: Array<WeightDto> }, { state: EarthquakeWeightState }>(
    'createWeight',
    async ({ dto }, { rejectWithValue }) => {
        console.log("Update a Weight:", dto);
        
        try {
            const response = await axios.put<Array<WeightDto>>(Endpoints.EarthquakePolicyWeight.UpdateListEarthquakeWeight, dto);
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

const updateListEarthquakeWeightSlice = createSlice({
    name: 'updateEarthquakeWeight',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(updateListEarthquakeWeight.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(updateListEarthquakeWeight.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(updateListEarthquakeWeight.rejected, (state, action) => {
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

export const { setActiveRequest, resetResponseStatus } = updateListEarthquakeWeightSlice.actions;

export default updateListEarthquakeWeightSlice.reducer;
