import { Palette } from 'lucide-react';
import React from 'react';

interface ThemePreviewProps {
  primaryColor?: string;
  secondaryColor?: string;
  primaryTextColor?: string;
  secondaryTextColor?: string;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ 
  primaryColor = '#3B5E3D',
  secondaryColor = '#DBB700',
  primaryTextColor = '#FFFFFF',
  secondaryTextColor = '#000000'
}) => {
  return (
    <div className="flex flex-col gap-2">

      <div className='flex items-center gap-2 mt-10 mb-3'>
        <Palette className="w-5 h-5" />
          <h2 className="text-base font-semibold">Theme Preview</h2>
      </div>

          <div className="flex gap-2 flex-wrap">
            <button 
              type="button"
              className="px-4 py-1 rounded-md font-medium text-sm transition-colors"
              style={{ 
                backgroundColor: primaryColor, 
                color: primaryTextColor 
              }}
            >
              Primary Button
            </button>
            <button 
              type="button"
              className="px-4 py-1 rounded-md font-medium text-sm transition-colors"
              style={{ 
                backgroundColor: secondaryColor,
                color: secondaryTextColor 
              }}
            >
              Secondary Button
            </button>
            <button 
              type="button"
              className="px-4 py-2 rounded-md font-medium text-sm border transition-colors bg-transparent"
              style={{ 
                borderColor: primaryColor, 
                color: primaryColor 
              }}
            >
              Outline Button
            </button>
          </div>
          
          <div 
            className="p-1 px-4 rounded-lg"
            style={{ 
              backgroundColor: primaryColor, 
              color: primaryTextColor 
            }}
          >
            <h3 className="font-semibold text-sm">Primary Background</h3>
            <p className='text-xs'>This uses the primary color as background</p>
          </div>
          
          <div 
            className="p-1 px-4 rounded-lg"
            style={{ 
              backgroundColor: secondaryColor,
              color: secondaryTextColor 
            }}
          >
            <h3 className="font-semibold text-sm">Secondary Background</h3>
            <p className='text-xs'>This uses the secondary color as background</p>
          </div>
    </div>
  );
};
