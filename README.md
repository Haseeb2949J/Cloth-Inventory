# ClothTracker 👕

A secure cloth inventory management system with cloud storage and email verification.

## ✨ Features

- 🔐 **Secure Authentication** - Email verification for signup and password changes
- ⚡ **Simple Daily Login** - Just email and password for regular use
- 🌐 **Cloud Storage** - Powered by Supabase for reliable data sync
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🌙 **Dark/Light Mode** - Toggle between themes
- 👔 **Professional UI** - Clean, modern interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account and project

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/YOUR_USERNAME/clothtracker.git
   cd clothtracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   Create a `.env.local` file:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   \`\`\`

4. **Set up database**
   Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor:
   - `001-create-tables.sql`
   - `008-selective-email-confirmation.sql`

5. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

\`\`\`
clothtracker/
├── app/                    # Next.js App Router pages
│   ├── secure-signup/      # Secure signup with email verification
│   ├── secure-login/       # Simple daily login
│   ├── dashboard/          # Main inventory management
│   ├── profile/            # User profile and settings
│   └── setup/              # Database setup page
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui components
│   ├── secure-auth-form.tsx
│   └── cloth-section.tsx
├── lib/                    # Utility functions
│   └── supabase.ts         # Supabase client configuration
├── scripts/                # Database setup scripts
└── public/                 # Static assets
\`\`\`

## 🔧 Configuration

### Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials** from Settings > API
3. **Run the database scripts** in the Supabase SQL editor
4. **Configure authentication** in Authentication > Settings:
   - Enable email confirmations for signup
   - Disable email confirmations for password changes (optional)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |

## 🎯 User Flow

1. **New User Signup** → Email verification required
2. **Email Confirmation** → Click link to activate account
3. **Daily Login** → Simple email/password (no verification)
4. **Password Change** → Email verification for security
5. **Inventory Management** → Add, edit, delete clothing items

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Language:** TypeScript
- **Deployment:** Vercel

## 📱 Screenshots

*Add screenshots of your app here*

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
2. **Go to [Vercel.com](https://vercel.com)** and sign in
3. **Import your GitHub repository**
4. **Add environment variables** in the Vercel dashboard
5. **Deploy!**

Your app will be live at `https://your-app.vercel.app`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/YOUR_USERNAME/clothtracker/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🙏 Acknowledgments

- Built with [v0.dev](https://v0.dev) - AI-powered development
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Database and auth by [Supabase](https://supabase.com)
- Deployed on [Vercel](https://vercel.com)

---

**Made with ❤️ and AI assistance**
