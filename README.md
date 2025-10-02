## Pharmédice Customer Area Front-End

This is a front-end for Pharmédice. It provides a customer area to access order information, documents, updates, and news.

### Features

- **Authentication System**
  - User login with email and password
  - User registration with comprehensive form validation
  - Password recovery with email reset link
  - Google OAuth integration (placeholder)

- **Form Validation**
  - Real-time validation for all input fields
  - CPF/CNPJ document formatting and validation
  - Brazilian phone number formatting
  - Email validation
  - Password strength requirements

- **Responsive Design**
  - Mobile-first approach
  - Consistent design across all authentication screens
  - Portuguese (PT-BR) interface

### Available Commands

| Command         | Description                         |
|-----------------|-------------------------------------|
| `npm run dev`   | Start development server (Turbopack) |
| `npm run build` | Build the application (Turbopack)    |
| `npm start`     | Start the production server          |
| `npm run lint`  | Run ESLint for code linting          |
| `npm run format`| Format code with Prettier            |
| `npm run format:check` | Check code formatting with Prettier |

### Routes

- `/` - Redirects to login page
- `/login` - User authentication
- `/signup` - User registration
- `/forgot-password` - Password recovery
- `/dashboard` - User dashboard (after authentication)

### Tech Stack

- [Next.js](https://nextjs.org/) 15 (App Router)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [TypeScript](https://www.typescriptlang.org/) 5

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── signup/            # Registration page
│   ├── forgot-password/   # Password recovery
│   └── dashboard/         # Protected dashboard
├── components/            # Reusable UI components
│   ├── AuthLayout.tsx     # Authentication layout wrapper
│   ├── FormField.tsx      # Form input component
│   └── SubmitButton.tsx   # Button component
└── lib/
    └── utils.ts           # Utility functions (validation, formatting)
```

### API Integration

The application is prepared for Laravel API integration. Update the API endpoints in:
- `/app/login/page.tsx` - Login endpoint
- `/app/signup/page.tsx` - Registration endpoint  
- `/app/forgot-password/page.tsx` - Password reset endpoint

### User Registration Fields

- Primeiro Nome (First Name)
- Segundo Nome (Last Name)
- Como gostaria de ser chamado (Nickname)
- Número Celular (Phone Number - Brazilian format)
- E-mail
- Senha (Password)
- Confirmação de senha (Password confirmation)
- CPF ou CNPJ (Document Number with auto-formatting)

---
Feel free to contribute or open issues!