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
import GetAllCarPolicyByDate from './Slices/CarPolicySlices/GetCarPolicyByDate';
import GetAllCarPolicyByPlate from './Slices/CarPolicySlices/GetCarPolicyByPlate-Slice';
import TotalRecordOfCarPolicy from './Slices/CarPolicySlices/TotalRecordOfCarPolicy-Slice';
import GetPlateWithCustomer  from './Slices/LicensePlateSlices/GetPlateWithCustomer-Slice';


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


		//	LICENSE PLATE STORE

		getPlateWithCustomer: GetPlateWithCustomer

	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
