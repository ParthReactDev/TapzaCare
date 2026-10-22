# Tapza — Smart Healthcare & Clinical Booking App 🩺⚡

> A Zepto-style, config-driven mobile healthcare platform built with **React Native (0.88)**, **TypeScript**, and the **MVVM (Model-View-ViewModel)** architectural pattern.

---

## 🌟 Key Highlights & Architecture

### 1. MVVM Architectural Pattern
- **Model**: Pure domain entities and DTOs ([`BackendApi.ts`](src/models/BackendApi.ts), [`Booking.ts`](src/models/Booking.ts), [`Prescription.ts`](src/models/Prescription.ts)).
- **ViewModel**: Decoupled business logic, reactive state, validations, and optimistic updates ([`useHomeViewModel.ts`](src/viewmodels/useHomeViewModel.ts), [`useBookingViewModel.ts`](src/viewmodels/useBookingViewModel.ts), [`usePrescriptionViewModel.ts`](src/viewmodels/usePrescriptionViewModel.ts), [`useReminderViewModel.ts`](src/viewmodels/useReminderViewModel.ts), [`useSplashViewModel.ts`](src/viewmodels/useSplashViewModel.ts)).
- **View**: Pure presentation components, animated headers, bottom sheets, and design system ([`views/screens/`](src/views/screens/), [`views/sections/`](src/views/sections/)).
- **Repositories & Mock Backend**: Reactive mock services with offline resilience and latency simulation ([`MockBackendApi.ts`](src/services/api/MockBackendApi.ts)).

---

## 🚀 Core Features

### 1. Home Feed (Zepto-style, Config-Driven)
- Fetches `GET /config` and dynamically renders themes, tabs, and ordered sections.
- Distinct background bands (solid color, gradient, or image) as the user scrolls.
- Collapsible shrinking header (72px → 54px) with parallax translation on hero banners.
- Supported section types:
  - `hero_banner`: Full-width banner with greeting, badge, and parallax.
  - `category_chips`: Horizontal scrollable clinical specialties.
  - `quick_actions`: Icon tiles: Book Doctor, Prescriptions, Reminders, Family Care.
  - `service_grid`: Dynamic 2 or 3-column cards with Rupee (`₹`) pricing.
  - `doctor_carousel`: Specialist cards with photo, rating, clinic location, and next slot.
  - `offer_strip`: Thin promotional strip with discount codes.
  - **Graceful degradation**: Unknown section types (e.g. `quantum_teleport_pod`) are skipped safely without crashing.
- **Two Shipped Configs**:
  - **Standard Care Mode (v1)**: Clean emerald/teal clinical palette, standard order, 2-column service grid.
  - **Diwali Dhamaka Mode (v2)**: Festive saffron/gold palette, Diwali greeting banner, offer strip prioritized at top, 3-column festive care packages.
  - **Runtime Switcher**: One-tap toggle in header changes colors, banners, and section orders with zero code changes.

### 2. Interactive Booking Flow
- Direct booking sheet from doctor cards or service items.
- **Date & Slot Selector**: Horizontal 7-day date selector and categorized slots (Morning, Afternoon, Evening).
- **Optimistic Confirmation**: Confirms immediately in UI, then reconciles with the mock backend.
- **HTTP 201 Created vs 409 Conflict**: Returns 201 on success or 409 if slot is taken, advising the user to pick another slot.
- **Celebration Animation**: Custom particle confetti burst, expanding shockwave halo, and receipt card.

### 3. Prescriptions & Medication Adherence
- Lists active clinical prescriptions from Hyderabad & Vijayawada clinics (Apollo Jubilee Hills, KIMS Gachibowli, Manipal Hospital Benz Circle, Rainbow Children's Hospital Banjara Hills).
- **Dose Schedule Timeline**: Shows medicine regimen categorized by designated slots:
  - 🌅 Morning (08:30 AM)
  - ☀️ Afternoon (01:30 PM)
  - 🌙 Night (09:00 PM)
- **Mark Dose as Taken**: One-tap button logs doses with real-time adherence progress tracking.

### 4. Resilience & Network Simulation
- **Control Panel Modal**:
  - Network Latency: `0ms`, `400ms`, `1500ms`, or `3500ms (Slow 3G)`.
  - Simulate Config 500 Failure (triggers automatic fallback to cached config).
  - Simulate 409 Conflict on Slot Booking.
  - Simulate Empty Sections list.
- **Offline Cache**: Automatically caches the last good config to `AsyncStorage` and displays a non-blocking retry banner during network failures.

---

## 🎁 Bonus Features Included

- **Multilingual i18n**: English (`en`), Telugu (`te` — తెలుగు), and Hindi (`hi` — हिन्दी) with persistent state and live header toggle.
- **Offline Queue**: Enqueues bookings made while offline; auto-syncs via `POST /bookings` when reconnected.
- **Haptic Feedback**: Cross-platform tactile feedback (`Haptics.selection()`, `Haptics.success()`, `Haptics.error()`).
- **Deep Linking**: Configured URL schemes (`tapza://home`, `tapza://prescription/:id`, `tapza://admin`).
- **Live In-App Admin Editor**: Live color swatches, festival mode toggle, section manager, and raw JSON editor with live reload.
- **E2E Tests**: Maestro flow ([`e2e/home_booking_prescription.maestro.yaml`](e2e/home_booking_prescription.maestro.yaml)) and Detox suite ([`e2e/app.e2e.js`](e2e/app.e2e.js)).

---

## 📡 Mock Backend Endpoints & Shapes

| Endpoint | Method | Response Shape |
| :--- | :---: | :--- |
| `/config` | `GET` | `LayoutConfig` |
| `/doctors` | `GET` | `Doctor[]` |
| `/slots?doctorId=&date=` | `GET` | `Slot[]` |
| `/bookings` | `POST` | `BookingResponse` (201) / 409 |
| `/prescriptions` | `GET` | `Prescription[]` |

---

## 🛠️ Project Setup & Running Locally

### Prerequisites
- Node.js >= 22.11.0
- React Native CLI
- Android Studio / Xcode

### 1. Install Dependencies
```bash
npm install
```

### 2. Type Checking
```bash
npx tsc --noEmit
```

### 3. Start Metro Dev Server
```bash
npm start
```

### 4. Run on Android or iOS
```bash
# Android
npm run android

# iOS
bundle install
bundle exec pod install
npm run ios
```

---

## 📂 Project Directory Structure

```
Tapza/
├── e2e/                             # End-to-end test suites (Maestro & Detox)
├── src/
│   ├── i18n/                        # Multilingual translations (EN, TE, HI)
│   ├── models/                      # Domain entities, BackendApi & DTOs
│   ├── navigation/                  # Root Navigator, Bottom Tabs, Deep Linking
│   ├── services/                    # Reactive Repositories & Mock Backend API
│   ├── theme/                       # Design tokens and color system
│   ├── utils/                       # Haptics and helpers
│   ├── viewmodels/                  # MVVM ViewModels
│   └── views/
│       ├── components/              # Reusable UI & Celebration Animation
│       ├── screens/                 # Splash, Home, Booking, Prescriptions, Admin
│       └── sections/                # Config-driven sections & SectionRenderer
├── App.tsx                          # App Entrypoint with Providers & Linking
└── package.json
```

---

## 📄 License
MIT © 2026 Tapza
