# AWS Amplify Gen 2 Deployment Guide

This project uses **AWS Amplify Gen 2** with `@aws-amplify/backend` for full-stack deployment.

## Environment Variables Configuration

### Required Environment Variables

Configure these in the AWS Amplify Console under **App Settings > Environment variables**:

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.pharmedice.com.br/api` |

### How to Configure Environment Variables

1. **Access Amplify Console**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Select your app

2. **Navigate to Environment Variables**
   - Click on **App settings** in the left sidebar
   - Click on **Environment variables**
   - Click **Manage variables**

3. **Add Variables**
   - Click **Add variable**
   - Enter variable name: `NEXT_PUBLIC_API_URL`
   - Enter variable value: `https://your-api-domain.com/api`
   - Click **Save**

4. **Redeploy**
   - Go to **Hosting > Build history**
   - Click **Redeploy this version** or push new code to trigger build

## Amplify Gen 2 Configuration

### Backend Configuration (`amplify/backend.ts`)
- Uses `@aws-amplify/backend` for full-stack deployment
- Automatic resource management
- Environment variables handled by Amplify

### Build Configuration (`amplify.yml`)
- **Backend Phase**: Runs `npx ampx generate`
- **Frontend Phase**: Standard Next.js build
- **Framework**: Next.js 15.5.2 with Turbopack
- **Build Command**: `npm run build`
- **Build Directory**: `.next`
- **Node Version**: Detected automatically
- **Cache**: Node modules, Next.js cache, and npm cache

## Important Notes

### Next.js Configuration
- **No `output: 'standalone'`** - Amplify handles deployment
- **Environment variables** are automatically available to Next.js
- **Build artifacts** are served from `.next` directory

### Security
- Use **HTTPS** URLs for production API
- Configure **CORS** on your backend to allow requests from Amplify domain
- Consider using **AWS Secrets Manager** for sensitive configuration

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

For local development, create `.env.local`:

```bash
# Copy from example
cp .env.example .env.local

# Edit .env.local with your local API URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

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

Each branch can have different environment variables configured.