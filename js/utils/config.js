// ----------------------------------
// CONFIGURATION
// ----------------------------------

//const baseUrl = 'https://localhost';
//const baseUrl = 'https://hadri1sev.com';
const baseUrl = 'https://dev.hadri1sev.com';

// Technical support email address
const supportEmail = 'support-technique.analyse@groupes.epfl.ch';

// Feature flags with default values
let featureFlags = {
  authentication: false,
  questions: false,
  newQuestion: false,
}

export {baseUrl, supportEmail, featureFlags};