import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { CarPolicyDto } from "../../../dto/CarPolicyDto";

export interface CarPolicyState {
    data: Array<CarPolicyDto>;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null; 
    errorMessage: string | null;   
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    data: [] as Array<CarPolicyDto>, 
    responseStatus: null, 
    errorMessage: null    
} as CarPolicyState;

export const getAllCustomerCarPolicy = createAsyncThunk<Array<CarPolicyDto>, { tckn: number}, { state: CarPolicyState }>(
    'carPolicy/customerPolicies',
    async ({ tckn}, { rejectWithValue }) => {
       
        try {
            const response = await axios.get<Array<CarPolicyDto>>(`${Endpoints.CarPolicy.GetCustomerPolicies}?tckn=${tckn}`);
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

const getAllCustomerCarPolicySlice = createSlice({
    name: 'allCustomerCarPolicy',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getAllCustomerCarPolicy.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(getAllCustomerCarPolicy.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(getAllCustomerCarPolicy.rejected, (state, action) => {
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

export const { setActiveRequest } = getAllCustomerCarPolicySlice.actions;

export default getAllCustomerCarPolicySlice.reducer;
