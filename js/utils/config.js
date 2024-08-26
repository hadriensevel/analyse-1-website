// ----------------------------------
// CONFIGURATION
// ----------------------------------

const baseUrl = 'https://api.sfriedli.org';

// Technical support email address
const supportEmail = 'support-technique.analyse@groupes.epfl.ch';

// Feature flags with default values
let featureFlags = {
  authentication: false,
  questions: false,
  newQuestion: false,
}

export {baseUrl, supportEmail, featureFlags};