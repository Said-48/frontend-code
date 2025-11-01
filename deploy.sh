#!/bin/bash

# Deployment Script for Vercel
# This script helps you deploy your application to Vercel

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Check if .vercel directory exists
if [ ! -d ".vercel" ]; then
    echo -e "${YELLOW}First time deployment detected.${NC}"
    echo "Please follow the Vercel CLI prompts to link your project."
    vercel
    exit 0
fi

# Parse arguments
ENVIRONMENT="preview"
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --prod|--production) ENVIRONMENT="production"; shift ;;
        --preview) ENVIRONMENT="preview"; shift ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
done

echo -e "${GREEN}Deployment target: $ENVIRONMENT${NC}"

# Build the application
echo -e "${YELLOW}Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Aborting deployment.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"

# Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"

if [ "$ENVIRONMENT" = "production" ]; then
    vercel --prod
else
    vercel
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Deployment successful!${NC}"
else
    echo -e "${RED}Deployment failed!${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Deployment complete!${NC}"
