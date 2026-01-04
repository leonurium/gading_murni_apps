import {useState, useEffect, useCallback} from 'react';
import {Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  getCurrentLocation,
  requestLocationPermission,
} from '../utils/MapLocation';
import {enableLatestRenderer} from 'react-native-maps';
import {ILocation} from '../@types/location';

// Default coordinates: Jakarta, Indonesia (fallback for simulator/failed location)
const DEFAULT_LOCATION: ILocation = {
  latitude: -6.2088,
  longitude: 106.8456,
};

const useLocation = (): [ILocation | null, boolean, () => void] => {
  const [location, setLocation] = useState<ILocation | null>(DEFAULT_LOCATION);
  const [mapLoading, setMapLoading] = useState<boolean>(true);

  const fetchLocation = async () => {
    try {
      const hasLocationPermission: boolean =
        Platform.OS === 'ios'
          ? (await Geolocation.requestAuthorization('always')) === 'granted'
          : await requestLocationPermission();
      if (hasLocationPermission) {
        const [currentLocation, _] = await Promise.all([
          getCurrentLocation(),
          enableLatestRenderer(),
        ]);

        // Only update if we got valid coordinates
        if (currentLocation?.latitude && currentLocation?.longitude) {
          setLocation(currentLocation);
        }
      }
    } catch (error) {
      console.log('Failed to get location, using default:', error);
      // Keep default location if fetching fails
    }
    setMapLoading(false);
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const triggerLocationFetch = useCallback(() => {
    fetchLocation();
  }, []);

  return [location, mapLoading, triggerLocationFetch];
};

export default useLocation;
