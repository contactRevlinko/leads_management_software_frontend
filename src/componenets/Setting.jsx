import { Bell, Lock, User, Users } from 'lucide-react'
import React from 'react'
import ProfileCard from './ProfileCard'
import SecurityCard from './SecurityCard'
import LogoutCard from './LogoutCard'

const Setting = () => {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account and preferences
        </p>
      </div>
     
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div className="xl:col-span-2 flex flex-col gap-6 lg:gap-8">
          <ProfileCard/>
          <SecurityCard/>
        </div>
        
        <div className="xl:col-span-1 flex flex-col gap-6 lg:gap-8">
          <LogoutCard/>
        </div>
      </div>
    </div>
  )
}

export default Setting