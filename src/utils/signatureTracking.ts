// Utility functions for tracking signature metadata

/**
 * Generate a device fingerprint ID
 */
export const generateDeviceId = (): string => {
  try {
    // Try to get from localStorage first
    const stored = localStorage.getItem('deviceId');
    if (stored) return stored;

    // Generate new device ID using browser fingerprinting
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Device Fingerprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Device Fingerprint', 4, 17);
    }

    const canvasData = canvas.toDataURL();
    
    // Combine with other browser properties
    const fingerprint = [
      canvasData,
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
    ].join('|');

    // Create hash
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }

    const deviceId = 'dev_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36);
    
    // Store for future use
    localStorage.setItem('deviceId', deviceId);
    
    return deviceId;
  } catch (error) {
    console.error('Error generating device ID:', error);
    // Fallback to random ID
    return 'dev_' + Math.random().toString(36).substring(2) + '_' + Date.now().toString(36);
  }
};

/**
 * Reverse geocode coordinates to get human-readable location name
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number
): Promise<string | null> => {
  try {
    console.log(`[Geocoding] Starting reverse geocode for: ${latitude}, ${longitude}`);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=18`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SignatureTracking/1.0', // Nominatim requires User-Agent
        },
      }
    );

    if (!response.ok) {
      console.warn(`[Geocoding] Failed with status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log('[Geocoding] Response received:', data);
    
    // Build detailed location name from address components
    const address = data.address || {};
    const parts: string[] = [];

    // Add most specific location first (street/building)
    const road = address.road || address.street;
    const houseNumber = address.house_number;
    
    if (houseNumber && road) {
      parts.push(`${houseNumber} ${road}`);
    } else if (road) {
      parts.push(road);
    }

    // Add neighborhood/suburb if available
    const neighborhood = address.neighbourhood || address.suburb || address.quarter;
    if (neighborhood) {
      parts.push(neighborhood);
    }

    // Add city/town/village
    const city = address.city || address.town || address.village || address.municipality;
    if (city) {
      parts.push(city);
    }

    // Add state/province
    const state = address.state || address.province || address.region;
    if (state) {
      parts.push(state);
    }

    // Add postal code if available
    const postcode = address.postcode;
    if (postcode) {
      parts.push(postcode);
    }

    // Add country
    if (address.country) {
      parts.push(address.country);
    }

    // Return formatted location or fallback to display_name
    const locationName = parts.length > 0 ? parts.join(', ') : data.display_name || null;
    console.log('[Geocoding] Location name:', locationName);
    return locationName;
  } catch (error) {
    console.error('[Geocoding] Error during reverse geocoding:', error);
    return null;
  }
};

/**
 * Capture geolocation data with location name
 */
export const captureGeolocation = (): Promise<{
  latitude: number;
  longitude: number;
  accuracy?: number;
  locationName?: string;
} | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('[Geolocation] Geolocation not supported by browser');
      resolve(null);
      return;
    }

    console.log('[Geolocation] Requesting user location...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('[Geolocation] Position obtained:', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });

        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        // Attempt reverse geocoding to get location name
        try {
          const locationName = await reverseGeocode(coords.latitude, coords.longitude);
          
          if (locationName) {
            console.log('[Geolocation] Successfully captured location with name:', locationName);
            resolve({
              ...coords,
              locationName,
            });
          } else {
            console.warn('[Geolocation] Reverse geocoding returned null, using coordinates only');
            resolve(coords);
          }
        } catch (error) {
          // If reverse geocoding fails, still return coordinates
          console.error('[Geolocation] Reverse geocoding error, returning coordinates only:', error);
          resolve(coords);
        }
      },
      (error) => {
        console.error('[Geolocation] Error getting position:', {
          code: error.code,
          message: error.message
        });
        
        // Provide user-friendly error messages
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.warn('[Geolocation] User denied geolocation permission');
            break;
          case error.POSITION_UNAVAILABLE:
            console.warn('[Geolocation] Location information unavailable');
            break;
          case error.TIMEOUT:
            console.warn('[Geolocation] Request timed out');
            break;
        }
        
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased to 15 seconds for geocoding
        maximumAge: 0,
      }
    );
  });
};

/**
 * Capture all signature metadata including IP (captured server-side)
 */
export const captureSignatureMetadata = async (): Promise<{
  deviceId: string;
  userAgent: string;
  geolocation?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    locationName?: string;
  };
}> => {
  console.log('[Metadata] Starting signature metadata capture...');
  
  const deviceId = generateDeviceId();
  const userAgent = navigator.userAgent;
  
  console.log('[Metadata] Device ID:', deviceId);
  console.log('[Metadata] User Agent:', userAgent);
  
  const geolocation = await captureGeolocation();
  
  const metadata = {
    deviceId,
    userAgent,
    ...(geolocation && { geolocation }),
  };
  
  console.log('[Metadata] Final metadata:', metadata);
  
  return metadata;
};
