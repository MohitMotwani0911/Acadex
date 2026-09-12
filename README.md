# Acadex

### AI-Powered Student Productivity & Academic Management Platform

Acadex is a full-stack academic management and productivity platform designed to help college students organize, track, and improve their academic life from a single dashboard.

It combines academic management features such as subjects, tasks, exams, schedules, attendance, notes, and analytics with an AI-powered academic assistant that can help students understand concepts, solve problems, plan their studies, and eventually provide personalized insights based on their academic data.

---

## Overview

Managing academic activities often requires students to use multiple applications for different purposes:

- One application for notes
- Another for tasks and assignments
- Separate calendars for exams and schedules
- Manual attendance tracking
- Different tools for academic analytics
- External AI tools for studying and problem solving

Acadex brings these functionalities together into one centralized platform.

The long-term goal of Acadex is to become an intelligent academic companion that not only stores academic information but also understands the student's academic context and provides personalized assistance.

---

# Key Features

## 1. Authentication & User Management

Acadex provides secure user authentication and protected application routes.

### Features

- User registration
- User login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Protected frontend routes
- Persistent authentication
- User-specific academic data

### Authentication Flow

```text
User
  ↓
Login / Register
  ↓
Backend Authentication
  ↓
Password Verification
  ↓
JWT Token
  ↓
Frontend Storage
  ↓
Axios Authentication Interceptor
  ↓
Protected API Requests
  ↓
Authenticated Dashboard
