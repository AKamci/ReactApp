import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import  customerSlice  from './Slices/CustomerSlices/GetAllCustomer-Slice';
import  getCustomerSlice  from './Slices/CustomerSlices/GetCustomer-Slice';
import  updateCustomerSlice  from './Slices/CustomerSlices/UpdateCustomer-Slice';
import  createCustomerSlice  from './Slices/CustomerSlices/CreateCustomer-Slice';
import  deleteCustomerSlice  from './Slices/CustomerSlices/DeleteCustomer-Slice';
import  totalRecordSlice  from './Slices/CustomerSlices/TotalRecordOfCustomer';




import CreateCarPolicySlice from './Slices/CarPolicySlices/CreateCarPolicy-Slice';
import UpdateCarPolicySlice from './Slices/CarPolicySlices/UpdateCarPolicy-Slice';
import DeleteCarPolicySlice from './Slices/CarPolicySlices/DeleteCarPolicy-Slice';
import GetAllCarPolicySlice from './Slices/CarPolicySlices/GetAllCarPolicy-Slice';
import GetAllCarPolicyCustomer from './Slices/CarPolicySlices/GetAllCarPolicyCustomer-Slice';
import GetCarPolicy from './Slices/CarPolicySlices/GetCarPolicy-Slice';
import AcceptCarPolicy from './Slices/CarPolicySlices/AcceptCarPolicy';
import RejectCarPolicy from './Slices/CarPolicySlices/RejectCarPolicy';
import GetAllCarPolicyByDate from './Slices/CarPolicySlices/GetCarPolicyByDate';
import GetAllCarPolicyByPlate from './Slices/CarPolicySlices/GetCarPolicyByPlate-Slice';
import TotalRecordOfCarPolicy from './Slices/CarPolicySlices/TotalRecordOfCarPolicy-Slice';
import GetPlateWithCustomer  from './Slices/LicensePlateSlices/GetPlateWithCustomer-Slice';


import GetWeight from './Slices/WeightSlices/GetWeight-Slice';
import UpdateWeight from './Slices/WeightSlices/UpdateWeight-Slice';
import DeleteWeight from './Slices/WeightSlices/DeleteWeight-Slice';
import CreateWeight from './Slices/WeightSlices/CreateWeight-Slice';
import GetListWeight from './Slices/WeightSlices/GetListWeight-Slice';
import UpdateListWeight from './Slices/WeightSlices/UpdateListWeight-Slice';

import  createEarthquakePolicy  from './Slices/EarthQuakeSlices/CreateEarthquake-Slice';
import GetHouseWithCustomerSlice from './Slices/HouseSlices/GetHouseWithCustomer-Slice';
import GetEarthquakePolicySlice from './Slices/EarthQuakeSlices/GetEarthquake-Slice';
import UpdateEarthquakePolicySlice from './Slices/EarthQuakeSlices/UpdateEarthquake-Slice';
import DeleteEarthquakePolicySlice from './Slices/EarthQuakeSlices/DeleteEarthquake-Slice';
import TotalRecordOfEarthquakePolicy from './Slices/EarthQuakeSlices/TotalRecordOfEarhquakePolicy';
import AcceptEarthquakePolicy from './Slices/EarthQuakeSlices/AcceptEarthquakePolicy';
import RejectEarthquakePolicy from './Slices/EarthQuakeSlices/RejectEarthquakePolicy';
import GetAllEarthquakePolicySlice from './Slices/EarthQuakeSlices/GetAllEarhquakePolicy-Slice';
import GetPersonalHealthWithCustomer from './Slices/PersonalHealthSlice/PersonalHealthGetWCustomer';
import CreatePersonalHealth from './Slices/PersonalHealthSlice/CreatePersonalHealth';
import DeleteHealthPolicy from './Slices/HealthPolicySlices/DeleteHealthPolicy';

import GetHealthPolicy from './Slices/HealthPolicySlices/GetHealthPolicy';
import CreateHealthPolicy from './Slices/HealthPolicySlices/CreateHealthPolicy';
import UpdateHealthPolicy from './Slices/HealthPolicySlices/UpdateHealthPolicy';
import AcceptHealthPolicy from './Slices/HealthPolicySlices/AcceptHealthPolicy';
import TotalRecordOfHealthPolicy from './Slices/HealthPolicySlices/TotalRecordOfHealthPolicy';
import RejectHealthPolicy from './Slices/HealthPolicySlices/RejectHealthPolicy';
import GetAllHealthPolicy from './Slices/HealthPolicySlices/GetAllHealthPolicy';

import GetHealthPolicyWeight from './Slices/HealthPolicyWeightSlices/GetHealthPolicyWeight-Slice';
import GetListHealthPolicyWeight from './Slices/HealthPolicyWeightSlices/GetListHealthPolicyWeight-Slice';
import UpdateHealthPolicyWeight from './Slices/HealthPolicyWeightSlices/UpdateHealthPolicyWeight-Slice';
import CreateHealthPolicyWeight from './Slices/HealthPolicyWeightSlices/CreateHealthPolicyWeight-Slice';
import DeleteHealthPolicyWeight from './Slices/HealthPolicyWeightSlices/DeleteHealthPolicyWeight-Slice';

import GetEarthquakeWeight from './Slices/EarthquakePolicyWeightSlices/GetEarthquakeWeight-Slice';
import UpdateEarthquakeWeight from './Slices/EarthquakePolicyWeightSlices/UpdateEarthquakeWeight-Slice';
import DeleteEarthquakeWeight from './Slices/EarthquakePolicyWeightSlices/DeleteEarthquakeWeight-Slice';
import CreateEarthquakeWeight from './Slices/EarthquakePolicyWeightSlices/CreateEarthquakeWeight-Slice';
import GetListEarthquakeWeight from './Slices/EarthquakePolicyWeightSlices/GetListEarthquakeWeight-Slice';
import UpdateListEarthquakeWeight from './Slices/EarthquakePolicyWeightSlices/UpdateListEarthquakeWeight-Slice';
import UpdateListHealthPolicyWeight from './Slices/HealthPolicyWeightSlices/UpdateListHealthPolicyWeight-Slice';

const store = configureStore({
	reducer: {
		//CUSTOMER STORE

		customers : customerSlice,
		getCustomer: getCustomerSlice,
		updateCustomer: updateCustomerSlice,
		createCustomer: createCustomerSlice,
		deleteCustomer: deleteCustomerSlice,
		totalRecord: totalRecordSlice,

		//CAR POLİCY STORE

		createCarPolicy: CreateCarPolicySlice,
		updateCarPolicy: UpdateCarPolicySlice,
		deleteCarPolicy: DeleteCarPolicySlice,
		allCarPolicy: GetAllCarPolicySlice,
		allCustomerCarPolicy: GetAllCarPolicyCustomer,
		getCarPolicy: GetCarPolicy,
		getCarPolicyByDate: GetAllCarPolicyByDate,
		getCarPolicyByPlate: GetAllCarPolicyByPlate,
		totalRecordCarPolicy: TotalRecordOfCarPolicy,
		acceptCarPolicy: AcceptCarPolicy,
		rejectCarPolicy: RejectCarPolicy,


		//	LICENSE PLATE STORE

		getPlateWithCustomer: GetPlateWithCustomer,


		// WEIGHT STORE

		getWeight : GetWeight,
		updateWeight: UpdateWeight,
		deleteWeight: DeleteWeight,
		createWeight: CreateWeight,
		getListWeight: GetListWeight,
		updateListWeight: UpdateListWeight,


		// EARTHQUAKE 

		createEarthquake: createEarthquakePolicy,
		getEarthquakePolicy: GetEarthquakePolicySlice,
		getHouseWithCustomer: GetHouseWithCustomerSlice,
		updateEarthquakePolicy: UpdateEarthquakePolicySlice,
		deleteEarthquakePolicy: DeleteEarthquakePolicySlice,
		totalRecordEarthquakePolicy: TotalRecordOfEarthquakePolicy,
		acceptEarthquakePolicy: AcceptEarthquakePolicy,
		rejectEarthquakePolicy: RejectEarthquakePolicy,
		allEarthquakePolicy: GetAllEarthquakePolicySlice,


		// HEALTH POLICY

		createHealthPolicy: CreateHealthPolicy,
		getHealthPolicy: GetHealthPolicy,
		deleteHealthPolicy: DeleteHealthPolicy,
		updateHealthPolicy: UpdateHealthPolicy,
		rejectHealthPolicy: RejectHealthPolicy,
		acceptHealthPolicy: AcceptHealthPolicy,
		totalRecordHealthPolicy: TotalRecordOfHealthPolicy,
		allHealthPolicy: GetAllHealthPolicy,


		
		getPersonalHealthWithCustomer: GetPersonalHealthWithCustomer,	
		createPersonalHealth: CreatePersonalHealth,


		getHealthPolicyWeight: GetHealthPolicyWeight,
		getListHealthPolicyWeight: GetListHealthPolicyWeight,
		updateHealthPolicyWeight: UpdateHealthPolicyWeight,
		createHealthPolicyWeight: CreateHealthPolicyWeight,
		deleteHealthPolicyWeight: DeleteHealthPolicyWeight,
		updateListHealthPolicyWeight: UpdateListHealthPolicyWeight,

		getEarthquakeWeight: GetEarthquakeWeight,
		updateEarthquakeWeight: UpdateEarthquakeWeight,
		deleteEarthquakeWeight: DeleteEarthquakeWeight,
		createEarthquakeWeight: CreateEarthquakeWeight,
		getListEarthquakeWeight: GetListEarthquakeWeight,
		updateListEarthquakeWeight: UpdateListEarthquakeWeight,



	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
