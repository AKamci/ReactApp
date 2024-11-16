import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';

export interface CustomerState {
    data: CustomerDto;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null;
    errorMessage: string | null; 
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    responseStatus: null, 
    errorMessage: null, 
} as CustomerState;

export const createCustomer = createAsyncThunk<CustomerDto, { dto: CustomerDto }, { state: CustomerState }>(
    'customer',
    async ({ dto }, { rejectWithValue }) => {
        console.log("Creating customer with dto:", dto);
        
        try {
            const response = await axios.post<CustomerDto>(Endpoints.Customers.Create, dto);
            console.log("Status: ", response.status);
            return response.data;
        } catch (error: any) {
            
            const status = error.response ? error.response.status : 500; 
            const message = error.response?.data?.message || "An error occurred";
            console.error("Error status:", status, "Message:", message);
            return rejectWithValue({ status, message }); 
        }
    }
);

const createCustomerSlice = createSlice({
    name: 'createCustomer',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(createCustomer.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null; 
        });
        builder.addCase(createCustomer.fulfilled, (state, action) => {
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200; 
            state.errorMessage = null; 
        });
        builder.addCase(createCustomer.rejected, (state, action) => {
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
        resetCreateCustomerState: (state) => {
            state.data = {} as CustomerDto;
            state.state = ApiState.Idle;
            state.activeRequest = null;
            state.responseStatus = null;
            state.errorMessage = null;
        },
        resetResponseStatus: (state) => {
            state.responseStatus = null;  
        },
    },
});

export const { setActiveRequest, resetCreateCustomerState, resetResponseStatus } = createCustomerSlice.actions;

export default createCustomerSlice.reducer;
