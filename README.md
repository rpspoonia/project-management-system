# Project Management System

A full-stack Project Management System built with **Django**, **GraphQL**, **React**, and **PostgreSQL (Docker)**.

## Tech Stack

### Backend
- Django
- Graphene (GraphQL)
- PostgreSQL
- Docker

### Frontend
- React
- TypeScript
- Vite
- Apollo Client (GraphQL)

---

## Project Structure

```text
Project-Management-System/
├── backend/                # Django + GraphQL backend
│   ├── config/             # Django project settings
│   ├── core/               # Core app (models, schema, logic)
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # React + Vite frontend
├── docker-compose.yml
├── README.md
└── LICENSE
```
---

## Features

- Project management
- Task management
- Task comments
- GraphQL API
- React frontend with Apollo Client

*(More features coming)*

---

## Setup Instructions

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+ recommended)
- Python 3.10+

---

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
