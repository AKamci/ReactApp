import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { LicensePlateDto } from "../../../dto/LicensePlateDto";
import { PersonalHealthDto } from "../../../dto/PersonalHealthDto";

export interface PersonalHealthState {
    data: PersonalHealthDto;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null; 
    errorMessage: string | null;   
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    data: {} as PersonalHealthDto, 
    responseStatus: null, 
    errorMessage: null    
} as PersonalHealthState;

    export const getPersonalHealthWithCustomer = createAsyncThunk<PersonalHealthDto, { tckn: string, coverageCode: number }, { state: PersonalHealthState }>(
    'personalHealth/WCustomer',
    async ({ tckn, coverageCode }, { rejectWithValue }) => {
        console.log("getCustomers with tckn:", tckn);
        
        try {
            const response = await axios.get<PersonalHealthDto>(Endpoints.PersonalHealth.GetWithCustomer, {
                params: { tckn, coverageCode }
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

const getPersonalHealthWithCustomerSlice = createSlice({
    name: 'getPersonalHealthWithCustomer',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getPersonalHealthWithCustomer.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(getPersonalHealthWithCustomer.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(getPersonalHealthWithCustomer.rejected, (state, action) => {
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

export const { setActiveRequest } = getPersonalHealthWithCustomerSlice.actions;

export default getPersonalHealthWithCustomerSlice.reducer;
