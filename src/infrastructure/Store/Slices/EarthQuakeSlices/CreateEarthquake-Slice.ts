import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Endpoints from '../../../Helpers/Api-Endpoints';
import { EarthquakePolicyDto } from '../../../dto/EarthquakePolicyDto';
import ApiState from '../../../Enums/ApiState';

export interface EarthquakePolicyState {
    data: EarthquakePolicyDto;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null; 
    errorMessage: string | null;   
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    data: {} as EarthquakePolicyDto, 
    responseStatus: null, 
    errorMessage: null    
} as EarthquakePolicyState;

export const createEarthquakePolicy = createAsyncThunk<EarthquakePolicyDto, { dto: EarthquakePolicyDto }, { state: EarthquakePolicyState }>(
    'createEarthquakePolicy',
    async ({ dto }, { rejectWithValue }) => {
        console.log("Create a Policy:", dto);
        
        try {
            const response = await axios.post<EarthquakePolicyDto>(Endpoints.EarthquakePolicy.CreateEarthquake, dto);
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

const createEarthquakePolicySlice = createSlice({
    name: 'createEarthquakePolicy',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(createEarthquakePolicy.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(createEarthquakePolicy.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(createEarthquakePolicy.rejected, (state, action) => {
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

export const { setActiveRequest, resetResponseStatus } = createEarthquakePolicySlice.actions;

export default createEarthquakePolicySlice.reducer;
