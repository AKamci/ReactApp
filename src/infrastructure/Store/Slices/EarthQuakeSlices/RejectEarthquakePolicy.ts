import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { CarPolicyDto } from "../../../dto/CarPolicyDto";
import { EarthquakePolicyDto } from '../../../dto/EarthquakePolicyDto';

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
export const rejectEarthquakePolicy = createAsyncThunk<EarthquakePolicyDto, { policyId: number }, { state: EarthquakePolicyState }>(
    'earthquakePolicy/rejected',
    async ({ policyId }, { rejectWithValue }) => {
        console.log("ID : ", policyId);
        
        try {
            const response = await axios.put<EarthquakePolicyDto>(
                Endpoints.EarthquakePolicy.RejectEarthquake,
                { policyId: policyId },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log("Status:", response.status);
            return response.data;
        } catch (error: any) {
            const status = error.response ? error.response.status : 500; 
            const message = error.response?.data?.message || "Bir hata oluştu";
            console.error("Hata durumu:", status, "Mesaj:", message);
            return rejectWithValue({ status, message });
        }
    }
);

const rejectEarthquakePolicySlice = createSlice({
    name: 'rejectEarthquakePolicy',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(rejectEarthquakePolicy.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(rejectEarthquakePolicy.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(rejectEarthquakePolicy.rejected, (state, action) => {
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
        resetEarthquakePolicyState: (state) => {
            state.data = {} as EarthquakePolicyDto; 
            state.state = ApiState.Idle;
            state.responseStatus = null;
            state.errorMessage = null;
        },
    },
});

export const { setActiveRequest, resetEarthquakePolicyState } = rejectEarthquakePolicySlice.actions;

export default rejectEarthquakePolicySlice.reducer;
