// ----------------------------------
// FEATURE FLAGS FOR QUESTIONS
// ----------------------------------

import {baseUrl, featureFlags} from './config';
import axios from 'axios';

const sessionStorageKey = 'featureFlags';

async function fetchFeatureFlags() {
  try {
    const response = await axios.get(`${baseUrl}/api/feature-flags`, {
      headers: {
        Accept: 'application/json',
      }
    });
    const data = response.data;

    // Loop through feature flags and set them to true if they are enabled
    data.forEach(item => {
      if (featureFlags.hasOwnProperty(item.name)) {
        featureFlags[item.name] = item.enabled === 1;
      }
    });
  } catch (error) {}

  // Store feature flags in session storage
  sessionStorage.setItem(sessionStorageKey, JSON.stringify(featureFlags));
}

async function getFeatureFlag(featureFlag) {
  // Check if feature flags are already stored in session storage
  const cachedFeatureFlags = sessionStorage.getItem(sessionStorageKey);

  if (cachedFeatureFlags) {
    const parsedFeatureFlags = JSON.parse(cachedFeatureFlags);
    return parsedFeatureFlags[featureFlag];
  } else {
    await fetchFeatureFlags();
    return featureFlags[featureFlag];
  }
}

export {getFeatureFlag};
