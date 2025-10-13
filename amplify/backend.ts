import { defineBackend } from '@aws-amplify/backend';

// Define the backend
export const backend = defineBackend({
  // Add your backend resources here
  // You can define:
  // - Auth (authentication)
  // - Data (GraphQL API)
  // - Storage (file storage)
  // - Functions (Lambda functions)
});

// Environment variables are automatically available via the Amplify console
// No need to define them here - they're injected at build time