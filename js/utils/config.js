// ----------------------------------
// CONFIGURATION
// ----------------------------------

const baseUrl = 'https://localhost';

// Technical support email address
const supportEmail = 'support-technique.analyse@groupes.epfl.ch';

// Feature flags with default values
let featureFlags = {
  authentication: false,
  questions: true,
  newQuestion: true,
}

export {baseUrl, supportEmail, featureFlags};