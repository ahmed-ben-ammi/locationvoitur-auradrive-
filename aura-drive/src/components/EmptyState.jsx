import React from 'react';

const EmptyState = ({ icon: Icon, title, description, className }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-4 ${className || ''}`}>
      {/* Icon Container with Pulse Animation */}
      <div className="relative mb-8">
        <div className="absolute -inset-2 bg-[#C17767]/5 rounded-full animate-pulse"></div>
        <div className="relative flex items-center justify-center w-28 h-28 bg-white dark:bg-[#242424] rounded-2xl shadow-lg border border-black/5 dark:border-white/5">
          {Icon && <Icon className="w-14 h-14 text-[#C17767]" />}
        </div>
      </div>

      {/* Content with Fade/Scale Animation */}
      <div className="max-w-md animate-in fade-in zoom-in duration-500">
        <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
