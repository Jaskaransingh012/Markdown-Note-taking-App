import { SidebarDemo } from '@/components/SideBarDemo'
import { cn } from '@/lib/utils'
import React from 'react'

function page() {
  return (
        <div
          className={cn(
            "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
            "h-screen", // for your use case, use `h-screen` instead of `h-[60vh]`
          )}>

          <SidebarDemo />
          <Dashboard />

          </div>
  )
}



const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <h1 className="">
        Documents
      </h1>
    </div>
  );
};


export default page