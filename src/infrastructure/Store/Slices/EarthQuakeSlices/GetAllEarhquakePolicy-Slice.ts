import { CustomerDto } from "../../../dto/CustomerDto";
import axios from 'axios';
import { AsyncThunk, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { EarthquakePolicyDto } from "../../../dto/EarthquakePolicyDto";

export interface EarthquakePolicyState {
    data: Array<EarthquakePolicyDto>;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null; 
    errorMessage: string | null;   
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    data: [] as Array<EarthquakePolicyDto>, 
    responseStatus: null, 
    errorMessage: null    
} as EarthquakePolicyState;

export const getAllEarthquakePolicy = createAsyncThunk<Array<EarthquakePolicyDto>, { page: number, size: number, policyName: string,
    policyDescription: string,  coverageCode: string,  state: EarthquakePolicyState,  policyAmount: number,  
    tckn: string,  policyStartDate: Date,  policyEndDate: Date, number: number, apartmentNumber: number, city: string, district: string, neighborhood: string}, 
    { state: EarthquakePolicyState }>(
    'earthquakePolicy/list',
    async ({ page, size, policyName, policyDescription, 
        coverageCode    , state, policyAmount,
        tckn, policyStartDate, policyEndDate, number, apartmentNumber, city, district, neighborhood
    }, { rejectWithValue }) => {
       
        console.log(policyEndDate)
        console.log(policyStartDate)
        try {
            let query = `${Endpoints.EarthquakePolicy.GetAllEarthquake}?page=${page}&size=${size}`;

            if (policyName) query += `&policyName=${encodeURIComponent(policyName)}`;
            if (policyDescription) query += `&policyDescription=${encodeURIComponent(policyDescription)}`;
            if (coverageCode) query += `&coverageCode=${encodeURIComponent(coverageCode)}`;
            if (state !== null && state !== undefined) query += `&state=${state}`;
            if (policyAmount) query += `&policyAmount=${encodeURIComponent(policyAmount)}`;
            if (tckn) query += `&tckn=${encodeURIComponent(tckn)}`;
            if (policyStartDate) query += `&policyStartDate=${policyStartDate}`;
            if (policyEndDate) query += `&policyEndDate=${policyEndDate}`;
            if (number) query += `&number=${encodeURIComponent(number)}`;
            if (apartmentNumber) query += `&apartmentNumber=${encodeURIComponent(apartmentNumber)}`;
            if (city) query += `&city=${encodeURIComponent(city)}`;
            if (district) query += `&district=${encodeURIComponent(district)}`;
            if (neighborhood) query += `&neighborhood=${encodeURIComponent(neighborhood)}`;


            console.log("Query: ");
            console.log(query);
            console.log(query.length);

            const response = await axios.get<Array<EarthquakePolicyDto>>(query);

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

const getAllEarthquakePolicySlice = createSlice({
    name: 'allEarthquakePolicy',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getAllEarthquakePolicy.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(getAllEarthquakePolicy.fulfilled, (state, action) => {
            console.log("Müşteri verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(getAllEarthquakePolicy.rejected, (state, action) => {
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

export const { setActiveRequest } = getAllEarthquakePolicySlice.actions;

export default getAllEarthquakePolicySlice.reducer;
