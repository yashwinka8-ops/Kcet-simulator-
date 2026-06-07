# 🚀 KCET College Predictor - Live Intelligence Hub

A premium, high-fidelity college prediction platform for KCET (Karnataka Common Entrance Test) aspirants. This platform transitions traditional static data into a **Real-Time Cloud-Synced** ecosystem.

![Premium Design](https://img.shields.io/badge/Design-Premium-orange?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20|%20Firebase%20|%20Tailwind-blue?style=for-the-badge)

## ✨ Key Features

- **🎯 Smart Predictor**: Real-time prediction engine based on 2024-2025 official institutional data.
- **📡 Live Cloud Sync**: Powered by Firestore with a version-controlled "Stage & Publish" workflow.
- **🛡️ Admin Console**: Enterprise-grade institutional management (Merge, Edit, Seed, and Global Find/Replace).
- **🚀 Ultra-Fast Caching**: Optimized for zero-latency with a lightweight version-tracking sync system.
- **💎 Premium UX**: Sleek dark-mode interface with micro-animations and responsive institutional explorer.

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Framer Motion
- **Backend/Database**: Google Firebase & Cloud Firestore
- **State Management**: Real-time Context Providers with intelligent caching
- **Styling**: Vanilla CSS with modern glassmorphism principles

## 🏗️ Architecture

The project uses a **Dual-Sync Strategy**:
1.  **Users**: Benefit from a version-checked cache. They only download data when the Admin "Deploys" a new version, saving bandwidth and speed.
2.  **Administrators**: Experience a live, un-cached "Master View" of the cloud database for absolute data accuracy during edits.

## 🚀 Getting Started

1. Clone the repo: `git clone https://github.com/yashwinka8-ops/KCET-COLLEGE-PREDICTOR.git`
2. Install dependencies: `npm install`
3. Set up your `.env.local` with your Firebase credentials.
4. Run locally: `npm run dev`

---
*Created with ❤️ for KCET Aspirants.*
