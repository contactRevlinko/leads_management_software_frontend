import { Bell, Lock, User, Users } from 'lucide-react'
import React from 'react'
import ProfileCard from './ProfileCard'
import SecurityCard from './SecurityCard'
import LogoutCard from './LogoutCard'

const Setting = () => {
  return (

    <div className="max-full pb-20 lg:mt-10 ">

      <div className="lg:mb-10 text-center">
        <h1 className="md:text-5xl text-3xl font-medium"> Settings</h1>
        <p className="md:py-3 text-sm md:text-xl py-2 text-gray-600">
          Manage your account and preferences
        </p>
      </div>
     

      <div className="mt-8 lg:w-1/2 sm:w-full  m-auto bg-white rounded-3xl  border border-gray-200 p-8 shadow-sm flex  flex-col gap-20">
        <ProfileCard/>
       <SecurityCard/>
      <LogoutCard/>
      </div>
    </div>
  )
}

export default Setting