import React from 'react';
import { Wifi, WifiOff, Clock } from 'lucide-react';
import { useServerStatus } from '@/hooks/useServerStatus';

const ServerStatus = ({ showDetails = true, size = 'default' }) => {
  const { isOnline, isChecking } = useServerStatus();

  const getStatusColor = () => {
    if (isChecking) return 'bg-yellow-500'; // Checking
    return isOnline ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = () => {
    if (isChecking) return 'Checking Server...';
    return isOnline ? 'Server Online' : 'Server Offline';
  };

  const getStatusIcon = () => {
    if (isChecking) return Clock;
    return isOnline ? Wifi : WifiOff;
  };

  const StatusIcon = getStatusIcon();
  const isSmall = size === 'small';

  if (!showDetails) {
    // Simple dot indicator
    return (
      <div className="flex items-center gap-2">
        <div 
          className={`w-3 h-3 rounded-full ${getStatusColor()} ${isChecking ? 'animate-pulse' : ''}`}
          title={getStatusText()}
        />
        {!isSmall && (
          <span className="text-sm text-muted-foreground">
            {getStatusText()}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-3 p-3 rounded-lg border ${
      isChecking 
        ? 'bg-yellow-50 border-yellow-200' 
        : isOnline 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
    }`}>
      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <div 
          className={`w-3 h-3 rounded-full ${getStatusColor()} ${isChecking ? 'animate-pulse' : ''}`}
        />
        <StatusIcon className={`w-4 h-4 ${
          isChecking 
            ? 'text-yellow-600' 
            : isOnline 
              ? 'text-green-600' 
              : 'text-red-600'
        }`} />
      </div>

      {/* Status Text */}
      <div className={`font-medium text-sm ${
        isChecking 
          ? 'text-yellow-800' 
          : isOnline 
            ? 'text-green-800' 
            : 'text-red-800'
      }`}>
        {getStatusText()}
      </div>
    </div>
  );
};

export default ServerStatus;