## CIVIC-SETU Mobile (Expo / React Native)

### Prereqs
- Install **Expo Go** on your phone (Android + iOS).
- Make sure your phone and your development PC are on the **same Wi‑Fi**.
- Start the backend API: `CIVIC-SETU/backend` on port `8080`.

### Configure API base URL (IMPORTANT for real phones)
On a real phone, `localhost` is the phone itself. You must point the app to your PC's LAN IP.

Set this environment variable before starting Expo:

- PowerShell:
  - `$env:EXPO_PUBLIC_API_BASE_URL="http://<YOUR_PC_LAN_IP>:8080/api"`
  - `npm run start`

Examples:
- `http://192.168.1.10:8080/api`

Default (Android emulator):
- `http://10.0.2.2:8080/api`

### Run
```bash
cd mobile
npm run start
```

Then scan the QR code with **Expo Go**.

### What’s wired up right now
- Navigation shell: Public → Login/Signup → role-based Admin/Citizen drawers
- Secure auth storage: `expo-secure-store`
- ML image flow POC: pick an image and upload it to `POST /api/detection/image`

