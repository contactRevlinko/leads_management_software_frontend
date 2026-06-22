import { Bell, Lock, User, Users } from 'lucide-react'
import React from 'react'
import ProfileCard from './ProfileCard'
import SecurityCard from './SecurityCard'
import LogoutCard from './LogoutCard'

const Setting = () => {
  return (

    <div className="w-full">
      <div className="mb-10">
        <h1 className="md:text-5xl text-3xl font-medium text-slate-900">Settings</h1>
        <p className="md:py-3 text-sm md:text-xl py-2 text-gray-600">
          Manage your account and preferences
        </p>
      </div>
     

      <div className="mt-8 lg:w-1/2 sm:w-full m-auto bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm flex flex-col gap-12 lg:gap-16">
        <ProfileCard/>
       <SecurityCard/>
      <LogoutCard/>
      </div>
    </div>
  )
}

export default Setting