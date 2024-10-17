import React from 'react'
import { useAppDispatch, useAppSelector } from '../../infrastructure/Store/store';
import { NavLink } from 'react-router-dom';
import { setActiveRequest } from '../../infrastructure/Store/Slices/CarPolicySlices/GetAllCarPolicy-Slice';




const CarPolicyLeftNav = () => {

  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.allCarPolicy.state);
  const carPolicies = useAppSelector((state) => state.allCarPolicy.data);
  const activeCarPolicy = useAppSelector((state) => state.allCarPolicy.activeRequest);



  return (
    <div className="list-group">

<NavLink
    to="/carPolicy"
    onClick={() => {
        dispatch(setActiveRequest(null));
    }}
    className={({ isActive }) =>
        `list-group-item list-group-item-action ${isActive && activeCarPolicy === null ? 'active' : ''}`
    }
>
    TÜM İŞLEMLER
</NavLink>

  <NavLink
    to="/carPolicy/createCarPolicy"
    onClick={() => {
        dispatch(setActiveRequest(1));
    }}
    className={({ isActive }) =>
        `list-group-item list-group-item-action ${isActive && activeCarPolicy === 1 ? 'active' : ''}`
    }
>
    ARABA POLİÇESİ OLUŞTUR.
</NavLink>

<NavLink
    to="/carPolicy/getCarPolicy"
    onClick={() => {
        dispatch(setActiveRequest(2));
    }}
    className={({ isActive }) =>
        `list-group-item list-group-item-action ${isActive && activeCarPolicy === 2 ? 'active' : ''}`
    }
>
  ARABA POLİÇESİ BUL
</NavLink>

<NavLink
    to="/carPolicy/list"
    onClick={() => {
        dispatch(setActiveRequest(3));
    }}
    className={({ isActive }) =>
        `list-group-item list-group-item-action ${isActive && activeCarPolicy === 3 ? 'active' : ''}`
    }
>
    TÜM ARABA POLİÇELERİNİ LİSTELE
</NavLink>




  </div>

  )
}

export default CarPolicyLeftNav