# 🎨 Design System & UI Guide

**Theme:** Modern Tech-Radar & Security (Dark Mode by Default, High Contrast).
The UI should feel like a command center, but offer the clean UX of modern dev tools (like Vercel or Supabase).

## Color Palette

### Backgrounds
* ⬛ **App Background:** `#0F172A` (Slate 900)
* ⬛ **Panel / Sidebar:** `#1E293B` (Slate 800)

### Accents & Status Colors
* 🟦 **Brand Primary:** `#3B82F6` (Blue 500) - *For radar elements, graph edges, buttons.*
* 🟩 **Safe / Healthy:** `#10B981` (Emerald 500) - *No CVEs, up-to-date.*
* 🟨 **Warning / EOL:** `#F59E0B` (Amber 500) - *AI-Downgraded Risk, outdated versions.*
* 🟥 **Critical Risk:** `#EF4444` (Red 500) - *Open, unmitigated CVEs.*
* 🟪 **AI Accent:** `#8B5CF6` (Violet 500) - *For Ollama chats and AI-generated insights.*

## UI Layout Structure
1. **Graph View (Center):** The main stage. Nodes represent Hosts, Containers, and Technologies.
2. **AI Chat Sidebar (Right):** A floating/collapsible sidebar for "Chat with your Stack" and manual software entry.
3. **Typography:** `Inter` (UI elements) and `Fira Code` (Tech Versions/Code Snippets).