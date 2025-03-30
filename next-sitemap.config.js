/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.yourdomain.com", // Use NEXT_PUBLIC_ for client-side access if needed.
  generateRobotsTxt: true,
  // ... other options
};
