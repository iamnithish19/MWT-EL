import React, { useEffect, useState, useCallback } from 'react';
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

import * as db from './services/db.js';

const AUTH_STORAGE_KEY = 'sfc_auth_user_id';

export default function App() {
  const [page, setPage] = useState('dashboard');
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
    setPage('dashboard');
    refresh();
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
  };

  if (!tables) return null;

  const currentUser = tables.users.find((u) => u.user_id === currentUserId) || tables.users[0];

  if (!currentUserId || !currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const scoped = (rows) => (rows || []).filter((r) => !r.user_id || r.user_id === currentUserId);

  const planActions = {
    onAddPlan: (payload) => {
      db.insert('fitnessPlans', { user_id: currentUserId, ...payload });
      refresh();
    },
    onDeletePlan: (id) => {
      db.remove('fitnessPlans', id);
      refresh();
    },
    onAddWorkout: (planId, payload) => {
      db.insert('workouts', { plan_id: planId, ...payload });
      refresh();
    },
    onDeleteWorkout: (id) => {
      db.remove('workouts', id);
      refresh();
    },
    onAddExercise: (workoutId, payload) => {
      db.insert('exercises', { workout_id: workoutId, ...payload });
      refresh();
    },
    onDeleteExercise: (id) => {
      db.remove('exercises', id);
      refresh();
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return (
          <Dashboard
            user={currentUser}
            fitnessPlans={scoped(tables.fitnessPlans)}
            workouts={tables.workouts}
            healthTrackers={scoped(tables.healthTrackers)}
            devices={scoped(tables.devices)}
            progressReports={scoped(tables.progressReports)}
            onNavigate={setPage}
          />
        );
      case 'workout-live':
        return (
          <WorkoutLive
            workouts={tables.workouts}
            exercises={tables.exercises}
            onCompleteSession={() => {
              db.generateProgressReport(currentUserId);
              refresh();
            }}
          />
        );
      case 'plans':
        return (
          <FitnessPlans
            plans={scoped(tables.fitnessPlans)}
            workouts={tables.workouts}
            exercises={tables.exercises}
            actions={planActions}
            user={currentUser}
          />
        );
      case 'health':
        return (
          <HealthTracker
            records={scoped(tables.healthTrackers)}
            onAdd={(payload) => {
              db.insert('healthTrackers', { user_id: currentUserId, ...payload });
              refresh();
            }}
            onDelete={(id) => {
              db.remove('healthTrackers', id);
              refresh();
            }}
          />
        );
      case 'sleep':
        return (
          <SleepAnalytics
            sleepLogs={scoped(tables.sleepLogs)}
            user={currentUser}
            onAddSleep={(payload) => {
              db.insert('sleepLogs', { user_id: currentUserId, ...payload });
              refresh();
            }}
          />
        );
      case 'heart-zones':
        return <HeartCardioZones user={currentUser} />;
      case 'hydration':
        return (
          <HydrationTracker
            hydrationLogs={scoped(tables.hydrationLogs)}
            onAddHydration={(payload) => {
              db.insert('hydrationLogs', { user_id: currentUserId, ...payload });
              refresh();
            }}
          />
        );
      case 'nutrition':
        return (
          <NutritionPlan
            plans={scoped(tables.nutritionPlans)}
            user={currentUser}
            onAdd={(payload) => {
              db.insert('nutritionPlans', { user_id: currentUserId, ...payload });
              refresh();
            }}
            onDelete={(id) => {
              db.remove('nutritionPlans', id);
              refresh();
            }}
          />
        );
      case 'recipes':
        return (
          <RecipeLibrary
            recipes={tables.recipes}
            onAddToPlan={(recipe) => {
              db.insert('nutritionPlans', {
                user_id: currentUserId,
                daily_calories: recipe.calories,
                diet_type: recipe.category,
                protein_g: recipe.protein,
                carbs_g: recipe.carbs,
                fats_g: recipe.fats
              });
              refresh();
            }}
          />
        );
      case 'macro-calc':
        return (
          <MacroCalculator
            user={currentUser}
            onSaveTarget={(patch) => {
              db.insert('nutritionPlans', { user_id: currentUserId, diet_type: 'Calculated Macro Goal', ...patch });
              refresh();
            }}
          />
        );
      case 'body-comp':
        return (
          <BodyComposition
            measurements={scoped(tables.bodyMeasurements)}
            user={currentUser}
            onAddMeasurement={(payload) => {
              db.insert('bodyMeasurements', { user_id: currentUserId, ...payload });
              if (payload.weight) db.updateProfile(currentUserId, { weight: payload.weight });
              refresh();
            }}
          />
        );
      case 'goals':
        return (
          <GoalsMilestones
            goals={scoped(tables.goals)}
            onAddGoal={(payload) => {
              db.insert('goals', { user_id: currentUserId, ...payload });
              refresh();
            }}
            onToggleGoal={(id, status) => {
              db.update('goals', id, { status });
              refresh();
            }}
          />
        );
      case 'habits':
        return (
          <HabitTracker
            habits={scoped(tables.habits)}
            onAddHabit={(payload) => {
              db.insert('habits', { user_id: currentUserId, ...payload });
              refresh();
            }}
            onToggleHabit={(id, completed) => {
              const habit = (tables.habits || []).find((h) => h.habit_id === id);
              const newStreak = completed ? (habit?.streak || 0) + 1 : Math.max(0, (habit?.streak || 1) - 1);
              db.update('habits', id, { completed_today: completed, streak: newStreak });
              refresh();
            }}
          />
        );
      case 'supplements':
        return (
          <SupplementManager
            supplements={scoped(tables.supplements)}
            onAddSupplement={(payload) => {
              db.insert('supplements', { user_id: currentUserId, ...payload });
              refresh();
            }}
            onToggleTaken={(id, taken) => {
              db.update('supplements', id, { taken_today: taken });
              refresh();
            }}
          />
        );
      case 'devices':
        return (
          <Devices
            devices={scoped(tables.devices)}
            onAdd={(payload) => {
              db.insert('devices', { user_id: currentUserId, ...payload });
              refresh();
            }}
            onDelete={(id) => {
              db.remove('devices', id);
              refresh();
            }}
            onToggleSync={(id, current) => {
              db.update('devices', id, { sync_status: current === 'Synced' ? 'Pending' : 'Synced' });
              refresh();
            }}
          />
        );
      case 'reports':
        return (
          <ProgressReports
            reports={scoped(tables.progressReports)}
            onGenerate={() => {
              db.generateProgressReport(currentUserId);
              refresh();
            }}
            onDelete={(id) => {
              db.remove('progressReports', id);
              refresh();
            }}
          />
        );

      case 'community':
        return <CommunityLeaderboard rankings={tables.communityRankings} />;
      case 'profile':
        return (
          <Profile
            user={currentUser}
            onUpdateProfile={(id, patch) => {
              db.updateProfile(id, patch);
              refresh();
            }}
          />
        );
      case 'settings':
        return <Settings onRefreshData={refresh} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell relative">
      <Sidebar
        active={page}
        onNavigate={setPage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="main">{renderPage()}</main>


    </div>
  );
}

