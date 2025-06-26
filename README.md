# 🏨 Revenue Management Platform

A comprehensive AI-powered rates and inventory management system designed for hospitality revenue managers, distribution managers, and corporate admins.

## ✨ Features

### 🎯 Core Functionality
- **Smart Inventory Management** - Context-aware inventory analysis with dynamic status indicators
- **AI-Powered Rate Optimization** - Intelligent pricing recommendations based on market data
- **Real-time Competitive Intelligence** - Live competitor rate and availability monitoring
- **Advanced Tooltips & Analytics** - Microsoft Word-style premium tooltips with detailed insights
- **Multi-channel Distribution** - Seamless integration with major OTAs and booking platforms

### 🤖 AI & Intelligence
- **Predictive Analytics** - Forecast demand patterns and booking velocity
- **Event Impact Analysis** - Automatic detection and impact assessment of local events
- **Booking Pace Monitoring** - Real-time booking velocity tracking vs. historical data
- **Restriction Recommendations** - AI-suggested inventory restrictions for revenue optimization

### 🎨 User Experience
- **Modern Enterprise UI** - Clean, data-dense interface inspired by Airtable and Linear
- **Enhanced Tooltips** - Premium Microsoft Word-style tooltips with rich content
- **Dark/Light Mode** - Seamless theme switching
- **Responsive Design** - Optimized for desktop and tablet use
- **Keyboard Shortcuts** - Power user shortcuts for efficiency

### 📊 Analytics & Reporting
- **Revenue Impact Tracking** - Quantified impact of pricing decisions
- **Channel Performance Analysis** - Detailed performance metrics by distribution channel
- **Audit Trail** - Complete history of all rate and inventory changes
- **Export Capabilities** - Multiple export formats for reporting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/rates-inventory-management.git
   cd rates-inventory-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles and animations
├── components/            # Reusable UI components
│   ├── ai/               # AI-related components
│   ├── calendar/         # Calendar and grid components
│   ├── layout/           # Layout components
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── stores/               # State management
├── types/                # TypeScript type definitions
└── apps/                 # Microservices architecture
    ├── backend/          # NestJS backend API
    └── frontend/         # React frontend (alternative)
```

## 🎨 Key Components

### Smart Inventory Analysis
- **Dynamic Status Calculation** - Context-aware inventory status (Critical, Low, Optimal, Oversupply)
- **Multi-factor Analysis** - Considers demand pace, competition, events, and seasonality
- **Actionable Insights** - Clear recommendations with revenue impact projections

### Enhanced Tooltips
- **Microsoft Word-style Design** - Premium visual design with glass morphism
- **Rich Content** - Detailed analytics, competitor data, and recommendations
- **Smooth Animations** - Polished micro-interactions and transitions
- **Contextual Information** - Relevant data based on hover target

### AI-Powered Insights
- **Revenue Optimization** - Intelligent pricing recommendations
- **Demand Forecasting** - Predictive analytics for booking patterns
- **Event Detection** - Automatic identification of demand-impacting events
- **Competitive Analysis** - Real-time market positioning insights

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your-jwt-secret"
```

### Customization
- **Themes**: Modify `app/globals.css` for custom color schemes
- **Tooltips**: Adjust tooltip styles in the `RichTooltip` component
- **AI Settings**: Configure AI parameters in the insight generation functions

## 🚢 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Docker
```bash
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by modern enterprise tools like Airtable, Linear, and Monday.com
- Built with Next.js, React, and TypeScript
- Enhanced with AI-powered insights and analytics
- Designed for hospitality revenue management professionals

## 📞 Support

For support, email support@yourcompany.com or create an issue in this repository.

---

**Built with ❤️ for Revenue Managers** 