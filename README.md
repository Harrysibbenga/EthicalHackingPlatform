# Ethical Hacking Learning Platform

## Overview

This project is an **interactive learning platform** for ethical hacking, designed with **bite-sized lessons (3/5/10 minutes per session)** using code examples and image-based learning. The platform is **subscription-based** and provides hands-on exercises to help users develop practical skills in cybersecurity.

## Features

- **Bite-sized lessons** on ethical hacking concepts.
- **Code execution environment** for interactive learning.
- **User authentication** with Firebase.
- **Subscription system** using Stripe.
- **Progress tracking** and quizzes.
- **AI-powered Q&A assistant** (OpenAI API).

## Tech Stack

### Frontend

- Vue.js (Nuxt.js for SEO benefits)
- Tailwind CSS for styling
- Vercel for hosting

### Backend

- FastAPI (or Django Rest Framework)
- PostgreSQL (via Supabase or Railway.app)
- Firebase Authentication
- Stripe for payments
- Docker for containerization

### Deployment

- **Backend:** Railway.app or Fly.io
- **Frontend:** Vercel
- **Database:** Supabase (managed PostgreSQL)
- **CI/CD:** GitHub Actions for automated deployments

## Project Structure

```
ethical-hacking-platform/
│── backend/               # FastAPI/Django Backend
│   ├── app/               # Main application logic
│   ├── tests/             # Unit tests
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile         # For deployment
│
│── frontend/              # Vue.js/Nuxt Frontend
│   ├── src/               # Vue source code
│   ├── components/        # Reusable components
│   ├── pages/             # Route pages
│   ├── store/             # Vuex/Pinia state management
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── Dockerfile         # For deployment
│
│── deployment/            # Infrastructure as Code
│   ├── docker-compose.yml # Local containerization
│   ├── nginx.conf         # Reverse proxy config
│   ├── ci-cd/             # GitHub Actions workflows
│   ├── terraform/         # Infrastructure automation
│   ├── railway/           # Railway deployment files
│   ├── fly.toml           # Fly.io deployment config
│   ├── staging/           # Staging environment configuration
│   └── production/        # Production environment configuration
│
│── .github/               # GitHub Actions (CI/CD)
│── .gitignore             # Ignore unnecessary files
│── README.md              # Project documentation
```

## Git Branching Strategy

- **`main`**: Active development branch.
- **`testing`**: Runs unit tests before merging.
- **`staging`**: Pre-production environment.
- **`production`**: Stable live version.

## Staging & Production Environments

- **Staging Environment:** Used for final testing before deploying to production. Includes separate API keys, database instances, and feature toggles.
- **Production Environment:** The live version used by end-users, ensuring stability and security.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ethical-hacking-platform.git
cd ethical-hacking-platform
```

### 2. Install Backend Dependencies

```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
npm run dev
```

### 4. Deploy Backend

#### Staging

```bash
railway init --environment staging
railway up --service backend-staging
```

#### Production

```bash
railway init --environment production
railway up --service backend-production
```

### 5. Deploy Frontend

#### Staging

```bash
vercel --env staging
```

#### Production

```bash
vercel --prod
```

## Contribution Guide

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-name`).
5. Submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or contributions, reach out at **sibbengaharry@gmail.com**.
