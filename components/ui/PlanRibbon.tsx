'use client'
import React, { ReactNode } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ArrowPathIcon, QuestionMarkCircleIcon } from '@heroicons/react/20/solid';

interface RibbonProps {
  stripeLink: string;
  displayText: string;
  userEmail?: string;
  children?: ReactNode; // Add this line for the children prop
}

const PlanRibbon: React.FC<RibbonProps> = ({ stripeLink, displayText, userEmail, children }) => {
  const handleClick = () => {
    const link = userEmail
      ? `${stripeLink}?prefilled_email=${encodeURIComponent(userEmail)}`
      : stripeLink;

    window.open(link, '_blank');
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="relative z-20">
        <div className="absolute top-5 left-5">
          <HoverCard>
            <HoverCardTrigger>
              <QuestionMarkCircleIcon width={32} className="text-white" />
            </HoverCardTrigger>
            <HoverCardContent className="w-[800px] h-[1000px]">
              <iframe src="https://link.excalidraw.com/p/readonly/cHcTRMmQ0XX3NzUpQZ6I" width="100%" height="100%"></iframe>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      <div
        className="absolute left-[-80px] top-[46px] w-72 h-10 bg-indigo-600 rounded-br-lg z-10 shadow-lg cursor-pointer transform -rotate-45 items-center justify-center"
        onClick={handleClick}
      >
        <div className="text-white flex items-center justify-center font-bold text-lg">
          {displayText}
        </div>

      </div>
      <div className="bg-white rounded-lg shadow p-6 relative z-0">
        {children} {/* Render the children here */}
      </div>
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-500/50 rounded-lg z-0" />
    </div>
  );
};

export default PlanRibbon;
