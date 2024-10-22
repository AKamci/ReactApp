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

export const getAllCarPolicy = createAsyncThunk<Array<CarPolicyDto>, { page: number, size: number, policyName: string,
    policyDescription: string,  policyType: string,  policyStatus:boolean,  policyAmount: number,  
    policyPlateNumber: string, tckn: string,  policyStartDate: Date,  policyEndDate: Date}, 
    { state: CarPolicyState }>(
    'carPolicy/list',
    async ({ page, size, policyName, policyDescription, 
        policyType, policyStatus, policyAmount, policyPlateNumber, 
        tckn, policyStartDate, policyEndDate
    }, { rejectWithValue }) => {
       
        try {
            let query = `${Endpoints.CarPolicy.GetAll}?page=${page}&size=${size}`;

            if (policyName) query += `&policyName=${encodeURIComponent(policyName)}`;
            if (policyDescription) query += `&policyDescription=${encodeURIComponent(policyDescription)}`;
            if (policyType) query += `&policyType=${encodeURIComponent(policyType)}`;
            if (policyStatus !== undefined) query += `&policyStatus=${policyStatus}`;
            if (policyAmount) query += `&policyAmount=${encodeURIComponent(policyAmount)}`;
            if (policyPlateNumber) query += `&policyPlateNumber=${encodeURIComponent(policyPlateNumber)}`;
            if (tckn) query += `&tckn=${encodeURIComponent(tckn)}`;
            if (policyStartDate) query += `&policyStartDate=${policyStartDate.toISOString()}`;
            if (policyEndDate) query += `&policyEndDate=${policyEndDate.toISOString()}`;

            console.log("Query: ");
            console.log(query);
            console.log(query.length);

            const response = await axios.get<Array<CarPolicyDto>>(query);

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

const getAllCarPolicySlice = createSlice({
    name: 'getAllCarPolicy',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getAllCarPolicy.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(getAllCarPolicy.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(getAllCarPolicy.rejected, (state, action) => {
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

export const { setActiveRequest } = getAllCarPolicySlice.actions;

export default getAllCarPolicySlice.reducer;
