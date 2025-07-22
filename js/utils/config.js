// ----------------------------------
// CONFIGURATION
// ----------------------------------

const baseUrl = 'https://botafogo.epfl.ch/forum';

// Technical support email address
const supportEmail = 'support-technique.analyse@groupes.epfl.ch';

// Feature flags with default values
let featureFlags = {
  authentication: false,
  questions: false,
  newQuestion: false,
}

export {baseUrl, supportEmail, featureFlags};