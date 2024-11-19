import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ApiState from "../../../Enums/ApiState";
import Endpoints from '../../../Helpers/Api-Endpoints';
import { HealthPolicyDto } from '../../../dto/HealthPolicyDto';

export interface HealthPolicyState {
    data: Array<HealthPolicyDto>;
    state: ApiState;
    activeRequest: number | null;
    responseStatus: number | null; 
    errorMessage: string | null;   
}

const initialState = { 
    state: ApiState.Idle, 
    activeRequest: null, 
    data: [] as Array<HealthPolicyDto>, 
    responseStatus: null, 
    errorMessage: null    
} as HealthPolicyState;

export const getAllHealthPolicy = createAsyncThunk<Array<HealthPolicyDto>, { 
    policyId: number | null,
    personalHealthId: number | null,
    tckn: string | undefined,
    height: number | null,
    weight: number | null,
    coverageCode: number | null,
    bmi: number | null,
    bloodType: string | undefined,
    alcoholConsumption: boolean | null,
    smokeConsumption: boolean | null,
    isPregnant: boolean | null,
    hasDisability: boolean | null,
    hasPreviousSurgeries: boolean | null,
    policyOfferDate: string | undefined,
    policyDescription: string | undefined,
    policyAmount: number | null,
    policyStartDate: string | undefined,
    policyEndDate: string | undefined,
    state: string | undefined,
    page: number,
    size: number
}, { state: HealthPolicyState }>(
    'healthPolicy/list',
    async ({ 
        policyId, personalHealthId, tckn, height, weight, coverageCode, bmi, bloodType,
        alcoholConsumption, smokeConsumption, isPregnant, hasDisability, hasPreviousSurgeries,
        policyOfferDate, policyDescription, policyAmount, policyStartDate, policyEndDate,
        state, page, size
    }, { rejectWithValue }) => {
       
        console.log(policyEndDate)
        console.log(policyStartDate)
        try {
            let query = `${Endpoints.HealthPolicy.GetAllHealth}?page=${page}&size=${size}`;

            if (policyId !== null) query += `&policyId=${policyId}`;
            if (personalHealthId !== null) query += `&personalHealthId=${personalHealthId}`;
            if (tckn) query += `&tckn=${encodeURIComponent(tckn)}`;
            if (height !== null) query += `&height=${height}`;
            if (weight !== null) query += `&weight=${weight}`;
            if (coverageCode !== null) query += `&coverageCode=${coverageCode}`;
            if (bmi !== null) query += `&bmi=${bmi}`;
            if (bloodType) query += `&bloodType=${encodeURIComponent(bloodType)}`;
            if (alcoholConsumption !== null) query += `&alcoholConsumption=${alcoholConsumption}`;
            if (smokeConsumption !== null) query += `&smokeConsumption=${smokeConsumption}`;
            if (isPregnant !== null) query += `&isPregnant=${isPregnant}`;
            if (hasDisability !== null) query += `&hasDisability=${hasDisability}`;
            if (hasPreviousSurgeries !== null) query += `&hasPreviousSurgeries=${hasPreviousSurgeries}`;
            if (policyOfferDate) query += `&policyOfferDate=${policyOfferDate}`;
            if (policyDescription) query += `&policyDescription=${encodeURIComponent(policyDescription)}`;
            if (policyAmount !== null) query += `&policyAmount=${policyAmount}`;
            if (policyStartDate) query += `&policyStartDate=${policyStartDate}`;
            if (policyEndDate) query += `&policyEndDate=${policyEndDate}`;
            if (state) query += `&state=${encodeURIComponent(state)}`;

            console.log("Query: ");
            console.log(query);
            console.log(query.length);

            const response = await axios.get<Array<HealthPolicyDto>>(query);

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

const getAllHealthPolicySlice = createSlice({
    name: 'allHealthPolicy',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getAllHealthPolicy.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(getAllHealthPolicy.fulfilled, (state, action) => {
            console.log("Sağlık poliçesi verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(getAllHealthPolicy.rejected, (state, action) => {
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
    },
});

export const { setActiveRequest } = getAllHealthPolicySlice.actions;

export default getAllHealthPolicySlice.reducer;
