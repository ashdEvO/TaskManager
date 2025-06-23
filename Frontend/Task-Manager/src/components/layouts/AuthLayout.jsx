import React from 'react';

import UI_IMG from "../../assets/images/auth-img.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen dark:bg-gray-900">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 flex flex-col dark:bg-gray-900">
        <h2 className="text-lg font-medium text-black dark:text-white">Task Manager</h2>
        {children}
      </div>
      <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 dark:bg-gray-800 bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className="absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-60 z-10" />
        <img src={UI_IMG} className="w-64 lg:w-[90%] z-20 relative" alt="Auth Visual" />
      </div>
    </div>
  );
};

export default AuthLayout;
