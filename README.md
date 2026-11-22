# HelpCard

A free emergency QR card: blood group, allergies, medicines and who to call. The public maker matches [helpcard.nuvolin.com](https://helpcard.nuvolin.com/). The mark is red (`#e5383b`) where that site’s icon is navy.

Anyone can make a card without an account. The QR code carries the details in the link after `#`, so a helper’s phone reads them locally. Sign in to save a copy, open it later, change it and print it again. Photos stay on the device and are not saved.

The public card maker is adapted from HelpCard by Nuvolin (MIT). See `LICENSE`.

## Run

```bash
npm install
npm run dev
```

Accounts and saved cards are stored in `data/helpcard.sqlite` (created on first use). Set `NEXT_PUBLIC_GA_ID` if you want the same visit counter the layout already supports. Card details are never included in that page view, because they live after `#`.
