# 🏥 Smart Organ Transplant Priority Analyzer

> **An intelligent healthcare decision support platform that leverages Artificial Intelligence, Machine Learning, Structured Analytic Hierarchy Process (SAHP), and Explainable AI (SHAP) to assist clinicians in prioritizing organ transplant recipients through transparent and data-driven decision making.**

<p align="center">

![Status](https://img.shields.io/badge/Project-Under%20Development-orange?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-Random%20Forest-success?style=for-the-badge)
![Explainable AI](https://img.shields.io/badge/Explainable%20AI-SHAP-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

---

## 📖 Project Overview

Organ transplantation is one of the most critical healthcare processes, where selecting the most suitable recipient must consider numerous medical, ethical, and clinical factors.

**Smart Organ Transplant Priority Analyzer** is an AI-powered decision support platform that helps healthcare professionals evaluate transplant candidates using a transparent, data-driven approach.

The system combines:

- 🤖 Machine Learning (Random Forest) for priority prediction
- 📊 Structured Analytic Hierarchy Process (SAHP) for multi-criteria decision making
- 🔍 SHAP (SHapley Additive Explanations) for model interpretability
- 📈 Interactive dashboards for visualization and analytics
- 🏥 A modern healthcare-focused web interface for clinicians

The objective is **not to replace medical professionals**, but to assist them by providing explainable, evidence-based recommendations that improve decision-making and transparency.

---

# 📑 Table of Contents

- [✨ Features](#-features)
- [🧠 AI & ML Pipeline](#-ai--ml-pipeline)
- [🏗️ System Architecture](#️-system-architecture)
- [🖥️ Application Modules](#️-application-modules)
- [⚙️ Technology Stack](#️-technology-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Installation](#-installation)
- [📸 Screenshots](#-screenshots)
- [🗂️ Dataset](#️-dataset)
- [🔮 Future Scope](#-future-scope)
- [🤝 Contributors](#-contributors)
- [👩‍💻 Authors](#-authors)

---

# ✨ Features

## 🏥 Healthcare Decision Support

- Intelligent organ transplant recipient prioritization
- AI-assisted clinical decision support
- Multi-criteria patient evaluation
- Medical urgency assessment
- Risk score calculation
- Transparent recommendation generation

---

## 🤖 Artificial Intelligence

- Random Forest based prediction engine
- Explainable AI using SHAP
- Feature importance analysis
- Prediction confidence scoring
- Future-ready ML pipeline

---

## 📊 Decision Analysis

- Structured Analytic Hierarchy Process (SAHP)
- Clinical parameter weighting
- Organ allocation priority score
- Risk assessment
- Final recommendation support

---

## 📈 Dashboard & Analytics

- Interactive healthcare dashboard
- Patient statistics
- Priority distribution
- Explainability visualization
- Ranked patient analytics
- Report generation

---

## 💻 Modern User Interface

- Responsive React application
- Healthcare-inspired UI
- Interactive forms
- Search & filtering
- Responsive tables
- Smooth navigation
- Mobile-friendly layout

---

## 📄 Reporting

- Patient ranking reports
- Decision summaries
- Explainable AI reports
- Export-ready analytics

---

# 🧠 AI & ML Pipeline

The Smart Organ Transplant Priority Analyzer follows a structured Artificial Intelligence and Machine Learning workflow to provide transparent, data-driven decision support for organ transplant prioritization.

```text
                Patient Medical Data
                        │
                        ▼
              Data Preprocessing
        (Cleaning & Feature Preparation)
                        │
                        ▼
          Medical Parameter Validation
                        │
                        ▼
     Structured Analytic Hierarchy Process
                 (SAHP Weighting)
                        │
                        ▼
        Machine Learning Prediction
            (Random Forest Model)
                        │
                        ▼
      Explainable AI Interpretation
              (SHAP Analysis)
                        │
                        ▼
      Patient Priority Score Generation
                        │
                        ▼
          Ranked Patient List
                        │
                        ▼
     Final Clinical Decision Support
```

### 🔍 Workflow Description

The Smart Organ Transplant Priority Analyzer follows a structured Artificial Intelligence and Decision Support workflow to assist healthcare professionals in prioritizing organ transplant recipients.

#### 1️⃣ Patient Data Collection
- Collects demographic information, medical history, laboratory reports, and clinical parameters.
- Ensures all required patient information is available for analysis.

#### 2️⃣ Data Preprocessing
- Cleans and validates patient records.
- Handles missing or inconsistent values.
- Prepares the dataset for analysis and prediction.

#### 3️⃣ SAHP-Based Criteria Weighting
- Applies the **Structured Analytic Hierarchy Process (SAHP)** to assign weights to multiple clinical criteria.
- Supports transparent multi-criteria decision making based on medical importance.

#### 4️⃣ Machine Learning Prediction
- Uses a **Random Forest** model to estimate the transplant priority of each patient.
- Identifies patterns from historical medical data to support decision making.

#### 5️⃣ Explainable AI (SHAP)
- Generates explanations for every prediction.
- Highlights the contribution of each clinical feature towards the final prediction.
- Improves transparency and clinician trust.

#### 6️⃣ Patient Priority Ranking
- Combines Machine Learning prediction with SAHP weighting.
- Calculates an overall priority score.
- Produces a ranked list of transplant candidates.

#### 7️⃣ Clinical Decision Support
- Displays ranked patients through an interactive healthcare dashboard.
- Provides explainable recommendations to support clinicians in making informed, transparent, and data-driven decisions.

> **Note:** The current version primarily focuses on the frontend prototype. Backend integration, Machine Learning execution, SAHP computation, SHAP analysis, and database connectivity are planned for future development.
---

# 🏗️ System Architecture

The Smart Organ Transplant Priority Analyzer follows a modular and scalable architecture that separates the presentation layer, backend services, machine learning engine, decision support modules, and database. This design ensures maintainability, scalability, and transparency while supporting intelligent healthcare decision-making.

```mermaid
flowchart TD

A[👨‍⚕️ Doctor / Hospital Administrator]

A --> B[🌐 React + Vite Frontend]

B --> C[⚙️ Flask REST API]

C --> D[🗄️ Database]

C --> E[🤖 Machine Learning Engine]

E --> F[🌲 Random Forest Model]

F --> G[🔍 SHAP Explainability]

C --> H[📊 SAHP Decision Engine]

G --> I[📈 Priority Score]

H --> I

D --> I

I --> J[🏥 Ranked Patient Dashboard]

J --> K[📄 Reports & Analytics]
```

## 🧩 Architecture Layers

### 🖥️ Presentation Layer
Provides an intuitive healthcare interface for clinicians to manage patient information, visualize predictions, review rankings, and access analytical reports.

### ⚙️ Application Layer *(Planned)*
Acts as the communication layer between the frontend, Machine Learning engine, SAHP module, SHAP analysis, and database through RESTful APIs developed using Flask.

### 🤖 Machine Learning Layer *(Planned)*
Implements a Random Forest model to predict transplant priority based on patient clinical parameters.

### 📊 Decision Support Layer *(Planned)*
Uses the Structured Analytic Hierarchy Process (SAHP) to calculate weighted clinical importance and improve prioritization fairness.

### 🔍 Explainable AI Layer *(Planned)*
Generates SHAP explanations to illustrate how each clinical feature contributes to the final prediction, increasing transparency and trust.

### 🗄️ Data Layer *(Planned)*
Stores patient records, prediction history, reports, and clinical data securely using a relational database.

---

## 🔄 Overall Workflow

1. Patient information is entered by the healthcare professional.
2. The system validates and preprocesses the patient data.
3. Clinical criteria are weighted using SAHP.
4. The Machine Learning model predicts transplant priority.
5. SHAP generates feature-level explanations.
6. A final priority score is calculated.
7. Ranked patient results are displayed.
8. Reports and analytics support clinical decision-making.