import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import  customerSlice  from './Slices/CustomerSlices/GetAllCustomer-Slice';
import  getCustomerSlice  from './Slices/CustomerSlices/GetCustomer-Slice';
import  updateCustomerSlice  from './Slices/CustomerSlices/UpdateCustomer-Slice';
import  deleteCustomersSlice  from './Slices/CustomerSlices/DeleteCustomer-Slice';





const store = configureStore({
	reducer: {
		customers : customerSlice,
		getCustomer: getCustomerSlice,
		updateCustomer: updateCustomerSlice,
		deleteCustomer: deleteCustomersSlice,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
