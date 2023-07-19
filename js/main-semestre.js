/*
 * MAIN SEMESTRE PAGE JAVASCRIPT
 */

import {loadIframeInit} from './utils/iframe.js';
import {fetchAuthDetails} from './utils/auth';
import axios from "axios";

// Function to load iframe from url parameters and when clicking on a button
document.addEventListener('DOMContentLoaded', () => {
  loadIframeInit();
});

// Fetch authentication details
document.addEventListener('DOMContentLoaded', () => {
    const data = fetchAuthDetails();
    console.log(data);
});