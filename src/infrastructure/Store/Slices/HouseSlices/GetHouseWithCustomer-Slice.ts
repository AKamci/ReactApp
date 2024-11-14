import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { HouseDto } from "../../../dto/HouseDto";
import { BuildingDto } from "../../../dto/BuildingDto";

export interface HouseState {
    data: HouseDto;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null; 
    errorMessage: string | null;   
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    data: {} as HouseDto, 
    responseStatus: null, 
    errorMessage: null    
} as HouseState;

export const getHouseWithCustomer = createAsyncThunk<HouseDto, { building: BuildingDto }, { state: { house: HouseState } }>(
    'house/getHouseWithCustomer',
    async ({ building }, { rejectWithValue }) => {
        try {
            console.log("Gönderilen DTO:", building);
            const response = await axios.get<HouseDto>(Endpoints.House.GetWithCustomer, {
                params: { building }
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

const getHouseWithCustomerSlice = createSlice({
    name: 'getHouseWithCustomer',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getHouseWithCustomer.pending, (state) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(getHouseWithCustomer.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(getHouseWithCustomer.rejected, (state, action) => {
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

export const { setActiveRequest } = getHouseWithCustomerSlice.actions;

export default getHouseWithCustomerSlice.reducer;
