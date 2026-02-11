# Auparts Website - Client Handoff

## Live Website
**URL:** https://auparts.vercel.app

---

## Admin Dashboard

**URL:** https://auparts.vercel.app/admin
**Password:** `auparts2024`

### What you can do:
- Add new products
- Edit existing products (name, price, description, image, category, stock status)
- Delete products
- Upload product images

---

## Stripe (Payments & Orders)

**Dashboard:** https://dashboard.stripe.com

All orders, payments, and customer information are managed through Stripe.

### To view orders:
1. Log in to Stripe Dashboard
2. Go to **Payments** to see all transactions
3. Click any payment to see:
   - Customer email
   - Shipping address
   - Items purchased
   - Payment status

### To enable customer email receipts:
1. Go to Stripe Dashboard → **Settings** → **Emails**
2. Turn on **"Successful payments"**
3. Customers will automatically receive order confirmations

### Test Mode vs Live Mode:
- Currently using **test mode** (no real charges)
- To go live: Switch to live mode in Stripe and update the API keys in Vercel

---

## Vercel (Hosting)

**Dashboard:** https://vercel.com

This is where the website is hosted. You can:
- View deployment status
- Check error logs
- Update environment variables

### Environment Variables (in Vercel):
- `STRIPE_SECRET_KEY` - Stripe API key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `NEXT_PUBLIC_SUPABASE_URL` - Database URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Database public key
- `SUPABASE_SERVICE_ROLE_KEY` - Database admin key
- `ADMIN_PASSWORD` - Admin dashboard password

---

## Supabase (Database & Images)

**Dashboard:** https://supabase.com/dashboard

This stores:
- Product information (name, price, description, etc.)
- Uploaded product images

### To access:
1. Log in to Supabase
2. Select the project
3. **Table Editor** → `products` table to see all products
4. **Storage** → `products` bucket to see uploaded images

---

## Shipping Settings

- **Flat rate:** $10 shipping
- **Free shipping:** Orders over $100

To change these values, edit the file `app/api/checkout/route.ts`:
```javascript
const SHIPPING_RATE = 1000 // $10 in cents
const FREE_SHIPPING_THRESHOLD = 10000 // $100 in cents
```

---

## Going Live Checklist

- [ ] Switch Stripe from test mode to live mode
- [ ] Update Stripe API keys in Vercel with live keys
- [ ] Enable email receipts in Stripe
- [ ] Test a real purchase
- [ ] Add contact email to footer (optional)
- [ ] Add favicon (optional)
- [ ] Add shipping/returns policy page (optional)

---

## Support

For technical issues with the website, contact the developer.

For payment/order issues, use Stripe Dashboard or contact Stripe support.
