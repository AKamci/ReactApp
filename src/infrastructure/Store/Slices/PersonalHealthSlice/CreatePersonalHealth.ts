import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Endpoints from '../../../Helpers/Api-Endpoints';
import { HealthPolicyDto } from '../../../dto/HealthPolicyDto';
import ApiState from '../../../Enums/ApiState';
import { PersonalHealthDto } from '../../../dto/PersonalHealthDto';

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

export const createPersonalHealth = createAsyncThunk<PersonalHealthDto, { dto: PersonalHealthDto }, { state: PersonalHealthState }>(
    'createPersonalHealth',
    async ({ dto }, { rejectWithValue }) => {
        console.log("Sağlık Poliçesi Oluştur:", dto);
        
        try {
            const response = await axios.post<PersonalHealthDto>(Endpoints.PersonalHealth.CreatePersonalHealth, dto);
            console.log("Durum:", response.status);
            return response.data;
        } catch (error: any) {
            const status = error.response ? error.response.status : 500; 
            const message = error.response?.data?.message || "Bir hata oluştu";
            console.error("Hata durumu:", status, "Mesaj:", message);
            return rejectWithValue({ status, message });
        }
    }
);

const createPersonalHealthSlice = createSlice({
    name: 'createPersonalHealth',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(createPersonalHealth.pending, (state, action) => {
            state.state = ApiState.Pending;
            state.responseStatus = null; 
            state.errorMessage = null;   
        });
        builder.addCase(createPersonalHealth.fulfilled, (state, action) => {
            console.log("Sağlık poliçesi verisi Redux'a geldi:", action.payload);
            state.data = action.payload;
            state.state = ApiState.Fulfilled;
            state.responseStatus = 200;  
            state.errorMessage = null;   
        });
        builder.addCase(createPersonalHealth.rejected, (state, action) => {
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
        resetResponseStatus: (state) => {
            state.responseStatus = null;  
        },
    },
});

export const { setActiveRequest, resetResponseStatus } = createPersonalHealthSlice.actions;

export default createPersonalHealthSlice.reducer;
