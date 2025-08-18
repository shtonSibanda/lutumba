# School Management System

A comprehensive school administration system built with React, TypeScript, and MySQL database.

## Features

- **Student Management**: Add, edit, delete, and view student records
- **Payment Processing**: Multi-currency payment tracking (USD, ZAR, ZIG)
- **Fee Management**: Define and manage fee structures
- **Attendance Tracking**: Student and staff attendance management
- **Academic Records**: Exam results and report card generation
- **Staff Management**: Complete staff directory and roles
- **Financial Dashboard**: Real-time financial analytics
- **Reports & Export**: Data export to CSV format
- **System Settings**: School configuration and data backup

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0+
- **Authentication**: JWT tokens
- **Development**: Vite, ESLint

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

## Installation

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd school-management-system
npm install
```

### 2. Database Setup

1. **Install MySQL** if not already installed
2. **Create Database**:
   ```bash
   mysql -u root -p < server/database/schema.sql
   ```

3. **Configure Environment Variables**:
   - Copy `config.env` to `.env` in the root directory
   - Update database credentials in `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=school_management
   DB_PORT=3306
   ```

### 3. Start Development Servers

```bash
# Start both frontend and backend
npm run dev:full

# Or start separately:
# Backend only
npm run server

# Frontend only  
npm run dev
```

## API Endpoints

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/student/:studentId` - Get payments by student
- `POST /api/payments` - Create new payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment
- `GET /api/payments/daily/today` - Get today's payments

### Health Check
- `GET /api/health` - API health status

## Database Schema

The system includes the following main tables:

- **students** - Student information and academic records
- **payments** - Payment transactions with multi-currency support
- **invoices** - Generated invoices for students
- **fee_structures** - Fee structure definitions
- **attendance_records** - Student attendance tracking
- **staff** - Staff directory and roles
- **staff_attendance_records** - Staff attendance tracking
- **exam_results** - Academic performance records
- **system_settings** - School configuration
- **users** - Authentication and user management

## Multi-Currency Support

The system supports three currencies:
- **USD** (US Dollar)
- **ZAR** (South African Rand) - $1 = 17.5 ZAR
- **ZIG** (Zimbabwean Dollar) - $1 = 34 ZIG

All financial calculations are converted to USD for consistent reporting.

## Development

### Project Structure
```
├── src/                    # Frontend React application
│   ├── components/        # React components
│   ├── contexts/          # React contexts
│   ├── services/          # API services
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── server/               # Backend Express application
│   ├── config/           # Database configuration
│   ├── routes/           # API routes
│   └── database/         # Database schema
├── config.env            # Environment variables
└── package.json          # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Default Login

- **Username**: admin
- **Password**: password

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team. 