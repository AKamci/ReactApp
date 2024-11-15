import React from 'react'
import { NavLink } from 'react-router-dom';

const EarthquakeLeftNav = () => {
  
    return (
		<>
			<div className='list-group'>
				<NavLink
					to='/earthQuake'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive ? 'active' : ''}`
					}>
					TÜM İŞLEMLER
				</NavLink>

				<NavLink
					to='/earthQuake/createEarthQuakePolicy'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive ? 'active' : ''}`
					}>
					MÜŞTERİ OLUŞTUR
				</NavLink>

				<NavLink
					to='/earthQuake/getEarthQuakePolicy'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive ? 'active' : ''}`
					}>
					MÜŞTERİ BUL
				</NavLink>

				<NavLink
					to='/earthQuake/list'
                    end
					className={({ isActive }) =>
						`list-group-item list-group-item-action ${isActive  ? 'active' : ''}`
					}>
					TÜM MÜŞTERİLERİ LİSTELE
				</NavLink>
			</div>
		</>
	);  
}

export default EarthquakeLeftNav