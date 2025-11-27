# Job Planner Portal - JavaScript + Material-UI

A React-based job planning and capacity management system for factory and warehouse operations.

## Features

- **Drag & Drop Scheduling**: Move jobs between unfirmed/firmed lists and calendar dates
- **Production Line Management**: Filter and manage multiple production lines
- **Capacity Visualization**: Color-coded calendar showing utilization levels
- **Real-time Updates**: Automatic calculation of capacity and job statistics
- **Interactive Calendar**: Monthly view with detailed day information
- **Job Management**: Track job details, priorities, deadlines, and customers

## Tech Stack

- **Frontend**: React 18 + JavaScript (ES6+)
- **UI Library**: Material-UI (MUI) v5
- **Build Tool**: Vite
- **State Management**: React Hooks + Local Storage
- **Notifications**: Notistack

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

## Installation & Setup

### Option 1: Download and Run Locally

1. **Download the project files** (all files in the `job_planner_portal` folder)

2. **Navigate to the project directory**:
   ```bash
   cd job_planner_portal
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```
   or if you prefer yarn:
   ```bash
   yarn install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   or with yarn:
   ```bash
   yarn dev
   ```

5. **Open your browser** and go to:
   ```
   http://localhost:8080
   ```

### Option 2: Create New Project from Scratch

If you want to create a new project with the same setup:

1. **Create a new Vite React project**:
   ```bash
   npm create vite@latest job-planner-portal -- --template react
   cd job-planner-portal
   ```

2. **Install Material-UI dependencies**:
   ```bash
   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material notistack
   ```

3. **Copy the source files** from this project to your new project

4. **Update package.json** with the provided configuration

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## Project Structure

```
job_planner_portal/
├── public/
│   ├── images/           # Static images
│   └── index.html        # HTML template
├── src/
│   ├── components/       # React components
│   │   ├── Dashboard.jsx     # Main dashboard
│   │   ├── LoginPage.jsx     # Authentication
│   │   ├── JobCard.jsx       # Job item component
│   │   ├── JobList.jsx       # Job list container
│   │   ├── CalendarDay.jsx   # Calendar day cell
│   │   ├── SummaryCards.jsx  # Statistics cards
│   │   └── DayDetailModal.jsx # Day details popup
│   ├── contexts/         # React contexts
│   │   └── AuthContext.jsx   # Authentication context
│   ├── types/           # Type definitions
│   │   └── job.js           # Job-related constants
│   ├── utils/           # Utility functions
│   │   └── jobUtils.js      # Job management utilities
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## Usage

### Login
- **Username**: `admin`
- **Password**: `admin`

### Basic Operations

1. **Select Production Line**: Use the dropdown to filter jobs by production line
2. **View Jobs**: Switch between "Unfirmed Job" and "Firmed Job" tabs
3. **Schedule Jobs**: Drag unfirmed jobs to calendar dates
4. **Reschedule**: Drag jobs between different calendar dates
5. **View Details**: Click on calendar days to see detailed job information
6. **Reset Data**: Use the "Reset Data" button to restore sample jobs

### Capacity Management

- **Green**: Low utilization (≤60%)
- **Yellow**: Medium utilization (61-85%)
- **Red**: High utilization (>85%)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Adding New Production Lines

Edit `src/utils/jobUtils.js`:

```javascript
export const PRODUCTION_LINES = [
  { id: 'new-line', name: 'New Production Line', dailyCapacity: 20.0 },
  // ... existing lines
];
```

### Modifying Job Properties

Update the job structure in `src/utils/jobUtils.js` and corresponding components.

### Changing Theme

Modify the Material-UI theme in `src/App.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#your-color',
    },
  },
});
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `vite.config.js`
2. **Dependencies not installing**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
3. **Build errors**: Make sure all file extensions are `.jsx` for React components

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Ensure all dependencies are properly installed
3. Verify Node.js version compatibility
4. Check that all file paths are correct

## License

This project is for demonstration purposes. Feel free to modify and use as needed.