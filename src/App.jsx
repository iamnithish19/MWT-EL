import React, { useEffect, useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import Profile from './components/Profile.jsx';
import FitnessPlans from './components/FitnessPlans.jsx';
import HealthTracker from './components/HealthTracker.jsx';
import Devices from './components/Devices.jsx';
import NutritionPlan from './components/NutritionPlan.jsx';
import ProgressReports from './components/ProgressReports.jsx';
import Login from './components/Login.jsx';

import WorkoutLive from './components/WorkoutLive.jsx';
import SleepAnalytics from './components/SleepAnalytics.jsx';
import HeartCardioZones from './components/HeartCardioZones.jsx';
import HydrationTracker from './components/HydrationTracker.jsx';
import RecipeLibrary from './components/RecipeLibrary.jsx';
import MacroCalculator from './components/MacroCalculator.jsx';
import BodyComposition from './components/BodyComposition.jsx';
import GoalsMilestones from './components/GoalsMilestones.jsx';
import HabitTracker from './components/HabitTracker.jsx';
import SupplementManager from './components/SupplementManager.jsx';
import CommunityLeaderboard from './components/CommunityLeaderboard.jsx';
import Settings from './components/Settings.jsx';
import GymMasterPortal from './components/GymMasterPortal.jsx';

import * as db from './services/db.js';

const AUTH_STORAGE_KEY = 'sfc_auth_user_id';

function MainAppShell() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tables, setTables] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? Number(saved) : null;
  });

  const refresh = useCallback(() => {
    setTables({
      users: db.getAll('users'),
      fitnessPlans: db.getAll('fitnessPlans'),
      workouts: db.getAll('workouts'),
      exercises: db.getAll('exercises'),
      healthTrackers: db.getAll('healthTrackers'),
      devices: db.getAll('devices'),
      nutritionPlans: db.getAll('nutritionPlans'),
      progressReports: db.getAll('progressReports'),
      sleepLogs: db.getAll('sleepLogs'),
      hydrationLogs: db.getAll('hydrationLogs'),
      recipes: db.getAll('recipes'),
      bodyMeasurements: db.getAll('bodyMeasurements'),
      goals: db.getAll('goals'),
      habits: db.getAll('habits'),
      supplements: db.getAll('supplements'),
      chatMessages: db.getAll('chatMessages'),
      communityRankings: db.getAll('communityRankings')
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleLoginSuccess = (user) => {
    setCurrentUserId(user.user_id);
    localStorage.setItem(AUTH_STORAGE_KEY, String(user.user_id));
    db.recordUserLogin(user);
    refresh();

    if (user.role === 'gym_master') {
      navigate('/gym-master');
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (currentUserId && tables && tables.users) {
      const user = tables.users.find((u) => u.user_id === currentUserId);
      if (user) db.recordUserLogin(user);
    }
  }, [currentUserId, tables]);

  const handleLogout = () => {
    setCurrentUserId(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    navigate('/');
  };

  if (!tables) return null;

  const currentUser = tables.users.find((u) => u.user_id === currentUserId) || tables.users[0];

  // If not logged in, show Login page route
  if (!currentUserId || !currentUser) {
    return (
      <Routes>
        <Route path="*" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      </Routes>
    );
  }

  const scoped = (rows) => (rows || []).filter((r) => !r.user_id || r.user_id === currentUserId);

  const planActions = {
    onAddPlan: (payload) => {
      db.insert('fitnessPlans', { user_id: currentUserId, ...payload });
      refresh();
    },
    onDeletePlan: (planId) => {
      db.remove('fitnessPlans', planId);
      refresh();
    },
    onAddWorkout: (planId, payload) => {
      db.insert('workouts', { plan_id: planId, ...payload });
      refresh();
    },
    onDeleteWorkout: (workoutId) => {
      db.remove('workouts', workoutId);
      refresh();
    },
    onAddExercise: (workoutId, payload) => {
      db.insert('exercises', { workout_id: workoutId, ...payload });
      refresh();
    },
    onDeleteExercise: (exerciseId) => {
      db.remove('exercises', exerciseId);
      refresh();
    }
  };

  const healthActions = {
    onAddHealth: (payload) => {
      db.insert('healthTrackers', { user_id: currentUserId, timestamp: new Date().toISOString(), ...payload });
      refresh();
    },
    onDeleteHealth: (id) => {
      db.remove('healthTrackers', id);
      refresh();
    }
  };

  const deviceActions = {
    onAddDevice: (payload) => {
      db.insert('devices', { user_id: currentUserId, sync_status: 'Synced', last_sync: 'Just now', battery: 100, ...payload });
      refresh();
    },
    onSyncDevice: (id) => {
      db.update('devices', id, { sync_status: 'Synced', last_sync: 'Just now' });
      refresh();
    },
    onDeleteDevice: (id) => {
      db.remove('devices', id);
      refresh();
    }
  };

  const nutritionActions = {
    onAddNutrition: (payload) => {
      db.insert('nutritionPlans', { user_id: currentUserId, ...payload });
      refresh();
    },
    onDeleteNutrition: (id) => {
      db.remove('nutritionPlans', id);
      refresh();
    }
  };

  const reportActions = {
    onGenerateReport: () => {
      db.generateProgressReport(currentUserId);
      refresh();
    },
    onDeleteReport: (id) => {
      db.remove('progressReports', id);
      refresh();
    }
  };

  const handleUpdateProfile = (userId, patch) => {
    db.updateProfile(userId, patch);
    refresh();
  };

  const navigateToRoute = (routeKey) => {
    navigate(`/${routeKey}`);
  };

  const defaultRoute = currentUser.role === 'gym_master' ? '/gym-master' : '/dashboard';

  return (
    <div className="app-shell">
      <Sidebar currentUser={currentUser} onLogout={handleLogout} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to={defaultRoute} replace />} />
          <Route path="/login" element={<Navigate to={defaultRoute} replace />} />

          {/* Route Concept Navigation Pages */}
          <Route
            path="/dashboard"
            element={
              <Dashboard
                user={currentUser}
                plans={scoped(tables.fitnessPlans)}
                workouts={tables.workouts}
                health={scoped(tables.healthTrackers)}
                devices={scoped(tables.devices)}
                nutrition={scoped(tables.nutritionPlans)}
                reports={scoped(tables.progressReports)}
                sleep={scoped(tables.sleepLogs)}
                onNavigate={navigateToRoute}
              />
            }
          />

          <Route
            path="/gym-master"
            element={
              <GymMasterPortal
                currentUser={currentUser}
                allUsers={tables.users}
                fitnessPlans={tables.fitnessPlans}
                workouts={tables.workouts}
                healthTrackers={tables.healthTrackers}
                nutritionPlans={tables.nutritionPlans}
                progressReports={tables.progressReports}
                sleepLogs={tables.sleepLogs}
                onRefresh={refresh}
              />
            }
          />

          <Route
            path="/plans"
            element={
              <FitnessPlans
                plans={scoped(tables.fitnessPlans)}
                workouts={tables.workouts}
                exercises={tables.exercises}
                actions={planActions}
              />
            }
          />

          <Route
            path="/workout-live"
            element={
              <WorkoutLive
                plans={scoped(tables.fitnessPlans)}
                workouts={tables.workouts}
                exercises={tables.exercises}
                user={currentUser}
              />
            }
          />

          <Route
            path="/reports"
            element={
              <ProgressReports
                reports={scoped(tables.progressReports)}
                onGenerate={reportActions.onGenerateReport}
                onDelete={reportActions.onDeleteReport}
                user={currentUser}
              />
            }
          />

          <Route
            path="/health"
            element={
              <HealthTracker
                records={scoped(tables.healthTrackers)}
                onAdd={healthActions.onAddHealth}
                onDelete={healthActions.onDeleteHealth}
              />
            }
          />

          <Route
            path="/sleep"
            element={
              <SleepAnalytics
                sleepLogs={scoped(tables.sleepLogs)}
                user={currentUser}
                onRefresh={refresh}
              />
            }
          />

          <Route
            path="/heart-zones"
            element={
              <HeartCardioZones
                healthTrackers={scoped(tables.healthTrackers)}
                user={currentUser}
              />
            }
          />

          <Route
            path="/hydration"
            element={
              <HydrationTracker
                hydrationLogs={scoped(tables.hydrationLogs)}
                user={currentUser}
                onRefresh={refresh}
              />
            }
          />

          <Route
            path="/supplements"
            element={
              <SupplementManager
                supplements={scoped(tables.supplements)}
                user={currentUser}
                onRefresh={refresh}
              />
            }
          />

          <Route
            path="/nutrition"
            element={
              <NutritionPlan
                plans={scoped(tables.nutritionPlans)}
                onAdd={nutritionActions.onAddNutrition}
                onDelete={nutritionActions.onDeleteNutrition}
                user={currentUser}
              />
            }
          />

          <Route
            path="/recipes"
            element={
              <RecipeLibrary
                recipes={tables.recipes}
                user={currentUser}
                onRefresh={refresh}
              />
            }
          />

          <Route
            path="/macro-calc"
            element={<MacroCalculator user={currentUser} />}
          />

          <Route
            path="/body-comp"
            element={
              <BodyComposition
                measurements={scoped(tables.bodyMeasurements)}
                user={currentUser}
                onRefresh={refresh}
              />
            }
          />

          <Route
            path="/community"
            element={
              <CommunityLeaderboard
                rankings={tables.communityRankings}
                currentUser={currentUser}
                users={tables.users}
                healthTrackers={tables.healthTrackers}
              />
            }
          />

          <Route
            path="/habits"
            element={
              <HabitTracker
                habits={scoped(tables.habits)}
                user={currentUser}
                onRefresh={refresh}
              />
            }
          />

          <Route
            path="/devices"
            element={
              <Devices
                devices={scoped(tables.devices)}
                onAdd={deviceActions.onAddDevice}
                onSync={deviceActions.onSyncDevice}
                onDelete={deviceActions.onDeleteDevice}
              />
            }
          />

          <Route
            path="/profile"
            element={
              <Profile
                user={currentUser}
                onUpdateProfile={handleUpdateProfile}
              />
            }
          />

          <Route
            path="/settings"
            element={<Settings user={currentUser} />}
          />

          <Route
            path="/goals"
            element={
              <GoalsMilestones
                goals={scoped(tables.goals)}
                user={currentUser}
                onRefresh={refresh}
              />
            }
          />

          <Route path="*" element={<Navigate to={defaultRoute} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <MainAppShell />
    </HashRouter>
  );
}
