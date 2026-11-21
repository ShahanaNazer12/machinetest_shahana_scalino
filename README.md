
# Brew & Bite – Café Website

A responsive café website developed using React 18 and Vite, integrated with the REST APIs provided by Scalino Technologies.

The application includes a public-facing café website and an admin panel for managing café information.

## Technologies Used

- React 18
- Vite
- JavaScript
- React Router DOM
- Axios
- React Icons
- HTML5
- CSS3
- REST API Integration

## Features

### Client Website

- Display café menu items and categories.
- Filter menu items by category.
- Display café team members.
- Display customer testimonials.
- Display café opening hours.
- Table reservation form.
- Contact form.
- Responsive design for desktop and mobile devices.

### Admin Panel

- Admin login and logout.
- Dashboard with summary information.
- Add, edit, and delete menu categories.
- Add, edit, and delete menu items.
- Manage team members.
- Manage testimonials.
- Manage opening hours.
- View and delete customer reservations.
- View and delete contact messages.

## API Integration

**API Base URL:**

https://mockapi.scalinotechnologies.com/api/v1

**Swagger Documentation:**

https://mockapi.scalinotechnologies.com/swagger/ui/index

Axios is used for API communication. API operations are organized into reusable service files with response handling and error handling.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/ShahanaNazer12/machinetest_shahana_scalino.git
```

### 2. Navigate to the project folder

```bash
cd machinetest_shahana_scalino
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

```env
VITE_API_BASE_URL=https://mockapi.scalinotechnologies.com/api/v1
```

### 5. Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal.

### 6. Create a production build

```bash
npm run build
```

### 7. Preview the production build

```bash
npm run preview
```

## Admin Panel Access

**Admin Login URL:** `/admin/login`

**Username:** `admin`

**Password:** `Admin@123`

Note: This is a basic frontend demo login.

## Project Structure

```text
machinetest_shahana_scalino/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   │   └── admin/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## Developer

Developed as part of the React Machine Test for Scalino Technologies.
