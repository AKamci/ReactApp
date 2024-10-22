import { NavLink } from 'react-router-dom';

const CarPolicyLeftNav = () => {

  return (
    <div className="list-group">

<NavLink
    to="/carPolicy"
    end
    className={({ isActive }) =>
        `list-group-item list-group-item-action ${isActive ? 'active' : ''}`
    }
>
    TÜM İŞLEMLER
</NavLink>

  <NavLink
    to="/carPolicy/createCarPolicy"
    end
    className={({ isActive }) =>
        `list-group-item list-group-item-action ${isActive ? 'active' : ''}`
    }
>
    ARABA POLİÇESİ OLUŞTUR.
</NavLink>

<NavLink
    to="/carPolicy/getCarPolicy"
    end
    className={({ isActive }) =>
        `list-group-item list-group-item-action ${isActive ? 'active' : ''}`
    }
>
  ARABA POLİÇESİ BUL
</NavLink>

<NavLink
    to="/carPolicy/list"
    end
    className={({ isActive }) =>
        `list-group-item list-group-item-action ${isActive? 'active' : ''}`
    }
>
    TÜM ARABA POLİÇELERİNİ LİSTELE
</NavLink>
  </div>

  )
}

export default CarPolicyLeftNav