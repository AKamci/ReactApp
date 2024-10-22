import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { LicensePlateDto } from "../../../dto/LicensePlateDto";

export interface LicensePlateState {
    data: LicensePlateDto;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null; 
    errorMessage: string | null;   
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    data: {} as LicensePlateDto, 
    responseStatus: null, 
    errorMessage: null    
} as LicensePlateState;

export const getPlateWithCustomer = createAsyncThunk<LicensePlateDto, { plate: string }, { state: LicensePlateState }>(
    'licensePlate/WCustomer',
    async ({ plate }, { rejectWithValue }) => {
        console.log("getCustomers with tckn:", plate);
        
        try {
            const response = await axios.get<LicensePlateDto>(Endpoints.LicensePlate.GetWithCustomer, {
                params: { plate }
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

const getPlateWithCustomerSlice = createSlice({
    name: 'getPlateWithCustomer',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getPlateWithCustomer.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(getPlateWithCustomer.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(getPlateWithCustomer.rejected, (state, action) => {
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

export const { setActiveRequest } = getPlateWithCustomerSlice.actions;

export default getPlateWithCustomerSlice.reducer;
