import React from 'react';
import { HiX } from "react-icons/hi";
import { Banner, BannerCollapseButton } from "flowbite-react";

export function PrivacyBanner() {
  return (
<Banner className="max-w-3xl mx-auto"> 
  <div className="flex w-full h-auto flex-col justify-between border-b border-gray-200 bg-red-900 p-4 dark:border-gray-600 dark:bg-red-900 rounded-lg md:flex-row">
    <div className="mb-4 md:mb-0 md:mr-4">
      <h2 className="px-4 mb-1 text-xl font-semibold text-gray-900 dark:text-white text-left font-Arial">
      ⚠ Your Privacy Matters!
      </h2>
      <p className="px-6 text-lg font-Arial font-normal text-white dark:text-white text-left leading-tight text-justify">
        In accordance with data protection and privacy policies, we do not store any uploaded images.
        All images are temporarily saved only for the duration of your try-on session and are automatically removed when you close this session.
      </p>
    </div>
    <div className="flex shrink-0 items-center">
      <BannerCollapseButton color="gray" className="border-0 bg-transparent text-white dark:text-white hover:scale-125">
        <HiX className="h-6 w-6" />
      </BannerCollapseButton>
    </div>
  </div>
</Banner>

  );
}
export default PrivacyBanner;