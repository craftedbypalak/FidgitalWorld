# Lead form setup (Google Sheet, Razorpay, WhatsApp)

Every "Book", "Buy" and "Notify me" button opens the same short form. The flow is:

```
Form (name, WhatsApp, email, child's age) → saved to your Google Sheet
  → "open" or "preorder": Razorpay payment page → after payment: WhatsApp
  → "waitlist": thank-you message with a WhatsApp button
```

All the settings live in `js/site-config.js`. It takes about 15 minutes the first time.

## 1. Create the sheet
1. Open [sheets.new](https://sheets.new) and name the file **Fidgital World leads**.
2. Click **Extensions → Apps Script**.
3. Delete what's in the editor, paste in all of `docs/lead-form-sheet.gs`, and click **Save**.

## 2. Publish it as a web app
1. Click **Deploy → New deployment**. Click the gear next to **Select type** and choose **Web app**.
2. Set **Execute as** to **Me**, and **Who has access** to **Anyone**.
3. Click **Deploy**, then **Authorize access**, and allow it. Google may warn that the app isn't verified. Click **Advanced → Go to … (unsafe)**. This is your own script.
4. Copy the **Web app URL** (it ends in `/exec`).

## 3. Connect the site
In `js/site-config.js`, paste the URL into `leadEndpoint`, and add your WhatsApp link to `whatsappUrl`:
```js
leadEndpoint: "https://script.google.com/macros/s/AKfy…/exec",
whatsappUrl: "https://wa.me/91XXXXXXXXXX?text=Hi%20Fidgital%20World",
```
Commit the change. Then submit the form once yourself and check that a **Leads** tab appears in the sheet with your row.

## 4. Send payers to WhatsApp after Razorpay
For each Razorpay payment page, open it in the Razorpay dashboard, go to the page's **settings**, and under **after payment** choose **redirect to a URL**. Paste your `whatsappUrl` (or a WhatsApp group invite link).

## Changing what's on sale
Edit the product in `js/site-config.js`:

| You want to | Set |
|---|---|
| Open bookings | `status: "open"`, plus `paymentUrl`, `price` and `nextBatch` |
| Collect interest only | `status: "waitlist"` |
| Kits sold out, start pre-orders | `status: "preorder"`, plus `preorderUrl` and `nextBatch: "Ships in …"` |
| Show scarcity | `seatsLeft: 6` (use `null` to hide it) |

## If you ever update the script
After changing the Apps Script code, use **Deploy → Manage deployments → Edit → Version: New version**. The URL stays the same.
