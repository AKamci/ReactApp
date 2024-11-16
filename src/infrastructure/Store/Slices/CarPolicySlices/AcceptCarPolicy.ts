import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { CarPolicyDto } from "../../../dto/CarPolicyDto";

export interface CarPolicyState {
    data: CarPolicyDto;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null; 
    errorMessage: string | null;   
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    data: {} as CarPolicyDto, 
    responseStatus: null, 
    errorMessage: null    
} as CarPolicyState;

export const acceptCarPolicy = createAsyncThunk<CarPolicyDto, { policyId: number }, { state: CarPolicyState }>(
    'carPolicy/accepted',
    async ({ policyId }, { rejectWithValue }) => {
        console.log("ID : ", policyId);
        
        try {
            const response = await axios.put<CarPolicyDto>(
                Endpoints.CarPolicy.Accept,
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

const acceptCarPolicySlice = createSlice({
    name: 'acceptCarPolicy',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(acceptCarPolicy.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(acceptCarPolicy.fulfilled, (state, action) => {
            console.log("Poliçe kabul edildi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(acceptCarPolicy.rejected, (state, action) => {
            state.state = ApiState.Rejected;
            if (action.payload) {
                state.responseStatus = (action.payload as any).status;  
                state.errorMessage = (action.payload as any).message;   
            } else {
                state.responseStatus = null; 
                state.errorMessage = "Bilinmeyen bir hata oluştu"; 
            }
        });
    },
    reducers: {
        setActiveRequest: (state, action) => {
            state.activeRequest = action.payload;
        },
        resetCarPolicyState: (state) => {
            state.data = {} as CarPolicyDto; 
            state.state = ApiState.Idle;
            state.responseStatus = null;
            state.errorMessage = null;
        },
    },
});

export const { setActiveRequest, resetCarPolicyState } = acceptCarPolicySlice.actions;

export default acceptCarPolicySlice.reducer;
