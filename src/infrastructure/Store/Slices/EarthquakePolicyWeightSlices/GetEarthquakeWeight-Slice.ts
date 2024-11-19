import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
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

export const getEarthquakeWeight = createAsyncThunk<WeightDto, { weightKey: string }, { state: EarthquakeWeightState }>(
    'weight',
    async ({ weightKey }, { rejectWithValue }) => {
        console.log("Weight with weightKey:", weightKey);     
        try {
            const response = await axios.delete<WeightDto>(Endpoints.EarthquakePolicyWeight.GetEarthquakeWeight, {
                params: {				
                    weightKey: weightKey
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

const getEarthquakeWeightSlice = createSlice({
    name: 'deleteEarthquakeWeight',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getEarthquakeWeight.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(getEarthquakeWeight.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(getEarthquakeWeight.rejected, (state, action) => {
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
        resetCustomerState: (state) => {
            state.data = {} as WeightDto; 
            state.state = ApiState.Idle;
            state.responseStatus = null;
            state.errorMessage = null;
        },
    },
});

export const { setActiveRequest, resetCustomerState } = getEarthquakeWeightSlice.actions;

export default getEarthquakeWeightSlice.reducer;
