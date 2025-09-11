# StartSmart Production Setup Guide

## Backend Setup

### 1. Environment Configuration
Ensure your `.env` file contains:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@startsmart.com
ADMIN_PASSWORD=StartSmart@Admin2025
ADMIN_NAME=StartSmart Administrator
ADMIN_VERIFICATION_PASSWORD=StartSmart@Admin2025
```

### 2. Admin Initialization
Run the following commands to set up the admin user:

```bash
# Navigate to backend directory
cd Backend

# Install dependencies and initialize admin
npm run setup

# Or manually initialize admin
npm run init-admin
```

### 3. Start the Server
```bash
# Development
npm run dev

# Production
npm start
```

## Frontend Setup

### 1. Environment Configuration
Ensure your `.env` file contains:
```
VITE_API_URL=http://localhost:5001
VITE_ADMIN_PASSWORD=StartSmart@Admin2025
VITE_ADMIN_EMAIL=admin@startsmart.com
```

### 2. Install Dependencies
```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install
```

### 3. Start the Frontend
```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

## Admin Access

### Default Credentials
- **Email**: admin@startsmart.com
- **Password**: StartSmart@Admin2025
- **Admin Verification Password**: StartSmart@Admin2025

### Access Flow
1. Navigate to `/admin/login`
2. Enter admin email and password
3. Complete admin verification
4. Access admin dashboard

## Security Notes

### Production Recommendations
1. **Change Default Passwords**: Update `ADMIN_PASSWORD` and `ADMIN_VERIFICATION_PASSWORD`
2. **Secure Environment Variables**: Use secure key management systems
3. **HTTPS Only**: Ensure all communication uses HTTPS
4. **Rate Limiting**: Implement rate limiting for admin endpoints
5. **IP Whitelisting**: Consider restricting admin access by IP
6. **Audit Logging**: Monitor all admin activities

### Environment Variables for Production
```bash
# Strong, unique passwords
ADMIN_PASSWORD=YourSecurePasswordHere123!
ADMIN_VERIFICATION_PASSWORD=YourSecureVerificationPasswordHere456!

# Secure JWT secret (use a strong random string)
JWT_SECRET=your_very_long_and_secure_jwt_secret_key_here

# Production MongoDB URI
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Production API URL
VITE_API_URL=https://your-production-domain.com
```

## Troubleshooting

### Common Issues

#### 1. Admin User Not Found
- Run `npm run init-admin` to create/update admin user
- Verify environment variables are set correctly

#### 2. 401 Unauthorized Error
- Ensure admin user exists in database
- Verify email and password match environment variables
- Check JWT token is valid

#### 3. Database Connection Issues
- Verify `MONGO_URI` is correct
- Ensure MongoDB cluster is accessible
- Check network connectivity

#### 4. CORS Issues
- Verify frontend URL is allowed in CORS settings
- Update API_URL in frontend environment

### Verification Steps

1. **Check Admin User Exists**:
   ```bash
   # Connect to MongoDB and verify admin user
   db.users.findOne({email: "admin@startsmart.com"})
   ```

2. **Test API Endpoints**:
   ```bash
   # Test regular login
   curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@startsmart.com","password":"StartSmart@Admin2025"}'
   ```

3. **Test Admin Verification**:
   ```bash
   # Test admin verification (replace TOKEN with actual JWT)
   curl -X POST http://localhost:5001/api/admin/verify \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TOKEN" \
     -d '{"adminPassword":"StartSmart@Admin2025"}'
   ```

## Deployment

### Backend Deployment (Render/Heroku)
1. Set environment variables in deployment platform
2. Ensure build scripts include admin initialization
3. Verify database connectivity

### Frontend Deployment (Vercel/Netlify)
1. Set environment variables in deployment platform
2. Update `VITE_API_URL` to production backend URL
3. Test admin login flow after deployment
