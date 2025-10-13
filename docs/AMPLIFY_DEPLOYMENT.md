# AWS Amplify Deployment Guide

This project is a standard Next.js application configured for AWS Amplify hosting.

## API Configuration

The API URL is hardcoded in the application:

| Configuration | Value |
|---------------|-------|
| API URL | `https://api.pharmedice.com.br/api` |
| Location | `src/lib/config.ts` |

## Build Configuration

### `amplify.yml`
- **Framework**: Next.js 15.5.2 with Turbopack
- **Build Command**: `npm run build`
- **Build Directory**: `.next`
- **Node Version**: Detected automatically
- **Cache**: Node modules and Next.js cache

## Important Notes

### Next.js Configuration
- Standard Next.js build process
- API URL hardcoded in `src/lib/config.ts`
- Build artifacts served from `.next` directory

### Security
- API URL: `https://api.pharmedice.com.br/api`
- Configure **CORS** on your backend to allow requests from Amplify domain

### Troubleshooting

#### Build Fails
1. Check environment variables are set correctly
2. Verify API URL is accessible
3. Check build logs in Amplify Console

#### Runtime Errors
1. Check browser console for API connection errors
2. Verify CORS configuration on backend
3. Test API endpoints directly

## Local Development

For local development, the application will use the production API:
- **API URL**: `https://api.pharmedice.com.br/api`
- **Location**: `src/lib/config.ts`

To use a local API during development, modify `src/lib/config.ts` temporarily.

## Deployment Process

1. **Push to Repository**
   ```bash
   git push origin main
   ```

2. **Amplify Auto-Deploy**
   - Amplify detects changes
   - Runs build process
   - Deploys automatically

3. **Manual Deploy**
   - Go to Amplify Console
   - Navigate to your app
   - Click **Run build** or **Redeploy**

## Branch-Based Deployments

Amplify supports branch-based deployments:

- **main/master**: Production environment
- **develop**: Staging environment  
- **feature/***: Preview environments

All branches use the same hardcoded API URL: `https://api.pharmedice.com.br/api`