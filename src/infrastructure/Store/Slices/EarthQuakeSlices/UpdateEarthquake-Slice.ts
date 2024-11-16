import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { CarPolicyDto } from "../../../dto/CarPolicyDto";
import { EarthquakePolicyDto } from "../../../dto/EarthquakePolicyDto";

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

export const updateEarthquakePolicy = createAsyncThunk<EarthquakePolicyDto, { dto: EarthquakePolicyDto }, { state: EarthquakePolicyState }>(
    'updateEarthquakePolicy',
    async ({ dto }, { rejectWithValue }) => {
        console.log(dto, "DTO")
        try {
            const response = await axios.put<EarthquakePolicyDto>(Endpoints.EarthquakePolicy.UpdateEarthquake,dto);
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

const updateEarthquakePolicySlice = createSlice({
    name: 'updateEarthquakePolicy',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(updateEarthquakePolicy.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(updateEarthquakePolicy.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(updateEarthquakePolicy.rejected, (state, action) => {
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

export const { setActiveRequest } = updateEarthquakePolicySlice.actions;

export default updateEarthquakePolicySlice.reducer;
