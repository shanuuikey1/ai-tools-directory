# Urban Services - Customer Web App

Complete React frontend for Urban Services marketplace platform.

## Features

✅ **User Authentication**
- Customer registration
- Customer login
- Persistent login with JWT tokens
- Logout functionality

✅ **Service Browsing**
- List all available services
- Filter by category
- Service details with pricing

✅ **Booking System**
- Select service date, time, and address
- Price breakdown and summary
- Two-step booking process

✅ **Payment Integration**
- Razorpay integration
- Secure payment processing
- Payment verification

✅ **Booking Management**
- View all your bookings
- Track booking status
- Rate completed services
- Provide feedback

✅ **User Profile**
- View account information
- Check account status
- Quick statistics

✅ **Responsive Design**
- Mobile-first approach
- Works on all devices
- Clean, modern UI

## Quick Start

### 1. Install Dependencies

```bash
cd web
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

App will open at `http://localhost:3000`

## Project Structure

```
web/
├── src/
│   ├── components/
│   │   └── Navbar.jsx              # Navigation bar
│   ├── pages/
│   │   ├── Home.jsx                # Home page
│   │   ├── Login.jsx               # Login page
│   │   ├── Register.jsx            # Registration page
│   │   ├── Services.jsx            # Services listing
│   │   ├── ServiceDetail.jsx       # Service detail & booking
│   │   ├── Bookings.jsx            # My bookings
│   │   └── Profile.jsx             # User profile
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication state
│   ├── services/
│   │   └── api.js                  # API integration
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── package.json
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS config
├── postcss.config.js               # PostCSS config
└── README.md
```

## Available Routes

```
/                    - Home page
/services            - Browse all services
/services/:id        - Service details & booking
/login               - Login page
/register            - Registration page
/bookings            - My bookings (protected)
/profile             - User profile (protected)
```

## Dependencies

### Core
- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Client-side routing
- **axios** - HTTP client

### UI & Icons
- **tailwindcss** - CSS framework
- **lucide-react** - Icon library

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

### Docker
Create a `Dockerfile`:
```dockerfile
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Environment Variables

Create `.env` file in root:

```
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Razorpay (optional)
VITE_RAZORPAY_KEY=your_key
```

## Common Issues

### API Connection Failed
- Make sure backend is running on `http://localhost:5000`
- Check `VITE_API_URL` in `.env`
- Check CORS settings in backend

### Payment Not Working
- Razorpay script needs to be loaded from CDN
- Check browser console for errors
- Use test keys from Razorpay dashboard

### CORS Errors
- Backend must have CORS enabled
- Check backend vite.config.js proxy settings

## Testing

### Test User Account
```
Email: customer@example.com
Password: Password123!
```

Create account through registration page to test full flow.

## Features Coming Soon

- [ ] Real provider selection
- [ ] Provider location/distance
- [ ] Chat with provider
- [ ] Service scheduling
- [ ] Wallet/credits system
- [ ] Referral rewards
- [ ] Service subscriptions
- [ ] Loyalty program

## Performance Tips

1. Images should be optimized
2. Use lazy loading for lists
3. Implement pagination for bookings
4. Cache API responses
5. Use web workers for heavy operations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security

- ✅ JWT token-based authentication
- ✅ HTTPS ready
- ✅ XSS protection via React
- ✅ CSRF protection via same-origin requests
- ✅ Secure password handling

## Support

For issues or questions, check the main README.md in the project root.

## License

MIT

---

**Ready to use!** This is a production-ready frontend that works with the backend API. Start the backend first, then this frontend.
