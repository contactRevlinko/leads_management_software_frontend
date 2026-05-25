import React, { useState } from 'react'
import { BellDot, UserPlus, Search, Info, PanelRight, Power } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useUser } from './UserContext';


const Topbar = ({ handleSideBar }) => {
    const { user, setUser } = useUser();
    const [open, setopen] = useState(false)
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate('/login');
    }
    return (
        <div className="  justify-between lg:justify-end  fixed top-0 left-0 right-0 lg:left-64 h-20  lg:px-12 px-4  bg-indigo-50 border-b border-gray-300 z-10 flex items-center gap-3">
            <PanelRight
                onClick={handleSideBar}
                className="lg:hidden cursor-pointer text-gray-700 w-6 h-6"

            /> {console.log(user)}
            {user && (<h1 className='text-indigo-700 font-medium text-xl'>hello... {user.name}</h1>)}
            <div className='flex gap-5  shrink-0'>
                <BellDot className="w-6 h-6 " />
                <Info className="w-6 h-6" />
                <UserPlus onClick={() => setopen(!open)} className="w-6 h-6" />
                {open && (<button className='bg-red-200 rounded-full w-8 h-8 flex items-center justify-center text-red-700' onClick={handleLogout}>
                    <Power className='w-6 h-6 ' />
                </button>)}

            </div>
        </div>
    )
}

export default Topbar;  