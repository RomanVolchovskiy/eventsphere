#!/bin/bash
# EventSphere Production Deployment Checklist

echo "🚀 EventSphere Production Setup Checklist"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}1. Google OAuth Setup${NC}"
echo "   [ ] Navigate to: https://console.cloud.google.com"
echo "   [ ] Enable Google Calendar API"
echo "   [ ] Create OAuth 2.0 Credentials"
echo "   [ ] Add redirect URIs (both prod and localhost:3000)"
echo "   [ ] Copy GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
echo ""

echo -e "${YELLOW}2. Stripe Setup${NC}"
echo "   [ ] Navigate to: https://dashboard.stripe.com/apikeys"
echo "   [ ] Switch to LIVE mode (toggle in top-left)"
echo "   [ ] Copy STRIPE_SECRET_KEY (sk_live_...)"
echo "   [ ] Copy NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_live_...)"
echo "   [ ] Go to Webhooks → Add Endpoint"
echo "   [ ] Webhook URL: https://your-domain.com/api/payments/webhook"
echo "   [ ] Add events: checkout.session.completed, charge.refunded"
echo "   [ ] Copy STRIPE_WEBHOOK_SECRET (whsec_...)"
echo ""

echo -e "${YELLOW}3. Vercel Environment Variables${NC}"
echo "   [ ] Go to: https://vercel.com/sobakahav-7468s-projects/eventsphere"
echo "   [ ] Settings → Environment Variables"
echo "   [ ] Add NEXTAUTH_URL"
echo "   [ ] Add NEXTAUTH_SECRET"
echo "   [ ] Add GOOGLE_CLIENT_ID"
echo "   [ ] Add GOOGLE_CLIENT_SECRET"
echo "   [ ] Add STRIPE_SECRET_KEY"
echo "   [ ] Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "   [ ] Add STRIPE_WEBHOOK_SECRET"
echo "   [ ] Add DATABASE_URL"
echo ""

echo -e "${YELLOW}4. Domain Setup${NC}"
echo "   [ ] Configure domain in Vercel Settings → Domains"
echo "   [ ] Wait for DNS propagation"
echo "   [ ] Verify HTTPS is active"
echo "   [ ] Update NEXTAUTH_URL with production domain"
echo ""

echo -e "${YELLOW}5. Final Deployment${NC}"
echo "   [ ] Run: vercel deploy --prod"
echo "   [ ] Wait for build to complete"
echo "   [ ] Test login with Google"
echo "   [ ] Test payment flow"
echo "   [ ] Verify Stripe webhook receives events"
echo ""

echo -e "${GREEN}All done! Your EventSphere is now in production! 🎉${NC}"
