// ----------------------------------
// FEATURE FLAGS FOR QUESTIONS
// ----------------------------------

import {baseUrl, featureFlags} from './config';
import axios from 'axios';

const featureFlagsUrl = `${baseUrl}/api/feature-flags`;
const sessionStorageKey = 'featureFlags';

async function fetchFeatureFlags() {
  try {
    const response = await axios.get(featureFlagsUrl, {
      headers: {
        Accept: 'application/json',
      }
    });
    const data = response.data;

    // Loop through feature flags and set them to true if they are enabled
    featureFlags.forEach((featureFlag) => {
      featureFlags[featureFlag] = data[featureFlag] === true;
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
