import { SidebarDemo } from '@/components/SideBarDemo'
import { cn } from '@/lib/utils'
import { Button } from '@base-ui/react';
import { SearchCheckIcon, SearchIcon, Settings2Icon } from 'lucide-react';
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
    <div className="max-w-full px-10">
      <div className="w-full flex my-5 flex-col">
        <div className=" flex gap-10 justify-end pr-10">
          <SearchIcon />
          <Settings2Icon />
        </div>
        <div className="flex justify-between px-10">
          <h1 className="text-4xl my-3">
            Documents
          </h1>
          <button>New</button>
        </div>


      </div>
      <div className="w-screen h-px bg-black ">

      </div>

    </div>
  );
};


export default page