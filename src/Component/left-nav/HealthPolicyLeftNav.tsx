import React from 'react'
import { NavLink } from 'react-router-dom';

const HealthPolicyLeftNav = () => {
  
    return (
		<>
			<div className='list-group'>
				<NavLink
					to='/healthPolicy'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive ? 'active' : ''}`
					}>
					TÜM İŞLEMLER
				</NavLink>

				<NavLink
					to='/healthPolicy/createHealthPolicy'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive ? 'active' : ''}`
					}>
					SAĞLIK POLİÇESİ OLUŞTUR
				</NavLink>

				<NavLink
					to='/healthPolicy/getHealthPolicy'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive ? 'active' : ''}`
					}>
					SAĞLIK POLİÇESİ BUL
				</NavLink>

				<NavLink
					to='/healthPolicy/list'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive  ? 'active' : ''}`
					}>
					SAĞLIK POLİÇESİ LİSTELE
				</NavLink>
				<NavLink
					to='/healthPolicy/weight'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive  ? 'active' : ''}`
					}>
					SAĞLIK POLİÇESİ AĞIRLIK DÜZENLE
				</NavLink>
			</div>
		</>
	);  
}

export default HealthPolicyLeftNav