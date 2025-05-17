# itsajoke

A cross-platform (Expo/React Native) app that fetches and displays a short, harsh, but funny AI-generated joke with a playful UI and haptic feedback.

---

## Features

- **Big Red Button**: Tap to trigger a burst animation and fetch a joke.
- **AI-Powered**: Uses OpenAI's GPT-4o-mini to generate jokes.
- **Haptic Feedback**: Tactile response on supported devices.
- **Animated Effects**: Colorful blobs and flash for a fun experience.
- **Modal Display**: Jokes shown in a modal with error/loading handling.
- **Cross-Platform**: Runs on iOS, Android, and Web via Expo.

---

## Screenshots

| ![ss-1.png](assets/ss-1.png) | ![ss-2.png](assets/ss-2.png) | ![ss-3.png](assets/ss-3.png) |
| :--------------------------: | :--------------------------: | :--------------------------: |

---

## Getting Started

1. **Install dependencies**:
   ```sh
   npm install
   ```
2. **Set your OpenAI API key**:
   - Copy `.env.example` to `.env` and fill in your key as `EXPO_PUBLIC_OPENAI_API_KEY`.
3. **Run the app**:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

---

## Project Structure

- `App.tsx`: Main UI and logic.
- `openai.util.ts`: Fetches jokes from OpenAI.
- `assets/`: App icons, splash, and screenshots.
- `app.json`: Expo config (icons, splash, API key).
- `tsconfig.json`: TypeScript strict mode.

---

## Dependencies

- `expo`, `react`, `react-native`
- `expo-haptics`, `expo-status-bar`
- `openai` (API client)
- TypeScript, Babel, type definitions

---

## Configuration

- **API Key**: Required in `.env` or via Expo's `extra` config.
- **Assets**: Icons and splash images in `assets/`.

---

## Scripts

- `npm start` – Expo dev server
- `npm run ios` – Run on iOS
- `npm run android` – Run on Android
- `npm run web` – Run in browser

---

## License

MIT
