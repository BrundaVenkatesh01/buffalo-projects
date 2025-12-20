# DNS Configuration Guide for Buffalo Projects

This guide provides step-by-step DNS setup instructions for common domain registrars to connect `buffaloprojects.com` to Vercel.

---

## Overview

You need to point your domain (`buffaloprojects.com`) to Vercel's servers so that visitors can access your site. There are two main approaches:

1. **CNAME Method** (Recommended): Point domain to `cname.vercel-dns.com`
2. **A Record Method**: Point domain to Vercel's IP addresses

---

## Step 1: Get Your Vercel Configuration

1. Go to your **Vercel Project → Settings → Domains**
2. Click **"Add Domain"**
3. Enter `buffaloprojects.com`
4. Vercel will show you DNS configuration instructions specific to your setup

**Note the following from Vercel:**

- CNAME target: `cname.vercel-dns.com`
- Or A record IPs (check Vercel dashboard for current IPs)

---

## Step 2: Configure DNS by Registrar

### Namecheap

1. **Log in to Namecheap** → **Domain List** → Click **Manage** next to your domain
2. **Navigate to "Advanced DNS" tab**
3. **Add records**:

#### For apex domain (buffaloprojects.com):

```
Type: ALIAS Record (or CNAME if supported)
Host: @
Value: cname.vercel-dns.com
TTL: Automatic
```

#### For www subdomain:

```
Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

#### Alternative: A Records (if ALIAS not available)

```
Type: A Record
Host: @
Value: 76.76.21.21
TTL: Automatic
```

4. **Save changes**
5. **Wait for propagation** (typically 10-30 minutes)

---

### GoDaddy

1. **Log in to GoDaddy** → **My Products** → **DNS** next to your domain
2. **Add records**:

#### For apex domain:

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 seconds (or Custom)
```

#### For www:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 1 Hour
```

3. **Save** and wait for propagation

---

### Cloudflare

1. **Log in to Cloudflare** → **Select your domain**
2. **Go to DNS tab**
3. **Add records**:

#### For apex domain:

```
Type: CNAME
Name: @ (or buffaloprojects.com)
Target: cname.vercel-dns.com
Proxy status: DNS only (grey cloud)
TTL: Auto
```

#### For www:

```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy status: DNS only (grey cloud)
TTL: Auto
```

**Important**: Set proxy to **"DNS only"** (grey cloud icon), not "Proxied" (orange cloud), otherwise SSL may not work correctly with Vercel.

4. **Save** and wait for propagation

---

### Google Domains

1. **Log in to Google Domains** → **Select your domain** → **DNS**
2. **Scroll to "Custom resource records"**
3. **Add records**:

#### For apex domain:

```
Name: @
Type: A
TTL: 1h
Data: 76.76.21.21
```

#### For www:

```
Name: www
Type: CNAME
TTL: 1h
Data: cname.vercel-dns.com
```

4. **Save** and wait for propagation

---

### Hover

1. **Log in to Hover** → **Select domain** → **DNS**
2. **Add records**:

#### For apex:

```
Type: A
Hostname: @
Value: 76.76.21.21
```

#### For www:

```
Type: CNAME
Hostname: www
Value: cname.vercel-dns.com
```

3. **Save**

---

### Netlify (if currently hosting elsewhere)

If you're migrating from Netlify:

1. **Remove old Netlify DNS records**
2. **Add Vercel records** as shown above for your registrar
3. **Remove custom domain** from Netlify project

---

## Step 3: Configure Redirects

In **Vercel → Project Settings → Domains**, you can configure:

### Option A: Redirect www to apex

```
www.buffaloprojects.com → buffaloprojects.com (301 redirect)
```

### Option B: Redirect apex to www

```
buffaloprojects.com → www.buffaloprojects.com (301 redirect)
```

**Recommendation**: Most sites redirect www → apex for simplicity.

---

## Step 4: Verify DNS Propagation

### Check DNS with dig (Terminal)

```bash
dig buffaloprojects.com
dig www.buffaloprojects.com
```

You should see:

- **A records** pointing to Vercel IPs (e.g., 76.76.21.21)
- Or **CNAME** records pointing to `cname.vercel-dns.com`

### Online Tools

- https://dnschecker.org
- https://www.whatsmydns.net

Enter `buffaloprojects.com` and check:

- **A Record**: Should show Vercel IPs
- **CNAME Record**: Should show `cname.vercel-dns.com`

**Typical propagation time**: 10-30 minutes (can take up to 48 hours in rare cases)

---

## Step 5: SSL Certificate

Vercel automatically issues SSL certificates via Let's Encrypt once DNS is configured correctly.

### Verify SSL

1. **In Vercel dashboard**: Domain should show "Valid Configuration" with SSL badge
2. **Visit site**: `https://buffaloprojects.com` - should load with padlock icon
3. **Check certificate**: Click padlock → Certificate → Should show Let's Encrypt

### Troubleshooting SSL

- **Certificate not issuing**: Wait 10-15 minutes after DNS propagation, Vercel auto-retries
- **Mixed content warnings**: Ensure all resources (images, scripts) load via HTTPS
- **Certificate expired**: Vercel auto-renews; check Vercel status page if issues persist

---

## Email DNS Records (If Using Resend)

If you're using Resend for transactional emails, you also need to add email authentication records.

### SPF Record

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

### DKIM Record (from Resend dashboard)

```
Type: TXT
Name: resend._domainkey
Value: [provided by Resend - long string]
TTL: 3600
```

### DMARC Record (Recommended)

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:admin@buffaloprojects.com
TTL: 3600
```

**Get these values from**: Resend dashboard → Domain Verification

---

## Common Issues & Solutions

### Issue: DNS not propagating

**Solutions**:

- Wait longer (up to 48 hours maximum)
- Clear browser cache: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Try incognito/private browsing mode
- Use `dig` command to check if DNS has propagated
- Check for typos in DNS records

### Issue: SSL certificate not issuing

**Solutions**:

- Ensure DNS is fully propagated (check with dig)
- Disable Cloudflare proxy if using Cloudflare (set to "DNS only")
- Verify domain in Vercel shows "Valid Configuration"
- Wait 15 minutes for Vercel auto-retry
- Remove and re-add domain in Vercel if still failing

### Issue: www not working

**Solutions**:

- Ensure you added CNAME record for `www` subdomain
- Configure redirect in Vercel (www → apex or apex → www)
- Check DNS propagation for www separately: `dig www.buffaloprojects.com`

### Issue: Old site still showing

**Solutions**:

- Clear browser cache
- DNS may still be pointing to old host - double-check DNS records
- Check if old hosting provider has "parking page" that needs to be removed

### Issue: Email not sending

**Solutions**:

- Verify email DNS records (SPF, DKIM) are correct
- Check Resend dashboard for domain verification status
- Wait 24 hours for email DNS to propagate
- Test with Resend dashboard's "Send Test Email" feature

---

## Verification Checklist

After configuring DNS, verify:

- [ ] `buffaloprojects.com` loads your Vercel site
- [ ] `www.buffaloprojects.com` loads (or redirects to apex)
- [ ] HTTPS works (padlock icon visible)
- [ ] SSL certificate is valid (click padlock to check)
- [ ] No mixed content warnings
- [ ] Mobile view works correctly
- [ ] DNS propagation complete globally (check with dnschecker.org)
- [ ] Email domain verified in Resend
- [ ] Test email sends successfully

---

## DNS Record Reference

### Final DNS Configuration Example

For `buffaloprojects.com` with Vercel + Resend:

```
# Main site
Type: A, Name: @, Value: 76.76.21.21, TTL: 3600
Type: CNAME, Name: www, Value: cname.vercel-dns.com, TTL: 3600

# Email authentication
Type: TXT, Name: @, Value: v=spf1 include:_spf.resend.com ~all, TTL: 3600
Type: TXT, Name: resend._domainkey, Value: [DKIM key from Resend], TTL: 3600
Type: TXT, Name: _dmarc, Value: v=DMARC1; p=none; rua=mailto:admin@buffaloprojects.com, TTL: 3600
```

---

## Need Help?

- **Vercel DNS Support**: https://vercel.com/support
- **Your Domain Registrar Support**: Contact support with "I need to point my domain to Vercel"
- **Resend Email Support**: https://resend.com/support

---

**Once DNS is configured and propagated, your site will be live at `https://buffaloprojects.com`!** 🚀
