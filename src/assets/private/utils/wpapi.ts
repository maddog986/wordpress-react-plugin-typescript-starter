import WPAPI from "wpapi";

// get api settings from WordPress
const wpApiSettings = (window as any).WP_API_Settings;

const wpapi = new WPAPI({
  endpoint: wpApiSettings.root,
  nonce: wpApiSettings.nonce,
});

export default wpapi;
