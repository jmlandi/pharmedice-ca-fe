import { Amplify } from 'aws-amplify';

// Try to import Amplify outputs if available
let outputs: Record<string, unknown> = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  outputs = require('../amplify_outputs.json');
} catch {
  console.log('Amplify outputs not found - running in development mode or first deployment');
}

// Configure Amplify only if outputs are available
if (outputs && Object.keys(outputs).length > 0) {
  Amplify.configure(outputs);
}

export default Amplify;