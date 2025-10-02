import { useState } from 'react';
import { Login } from './components/Login';
import { Registration } from './components/Registration';
import { BMIFormEnhanced } from './components/BMIFormEnhanced';
import { Dashboard } from './components/Dashboard';
import { VideoAnalysis } from './components/VideoAnalysis';
import { AnalysisReport } from './components/AnalysisReport';

type AppState = 'login' | 'register' | 'bmi-form' | 'dashboard' | 'video-analysis' | 'analysis-report' | 'edit-profile';

interface User {
  username: string;
  role: string;
  profile?: any;
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [currentReport, setCurrentReport] = useState<any>(null);

  const handleLogin = (userData: any) => {
    console.log('User logged in with role:', userData.role);
    setUser(userData);
    
    // Role-based routing after login
    if (userData.role === 'athlete') {
      setCurrentState('dashboard');
    } else if (userData.role === 'official') {
      setCurrentState('dashboard'); // Officials go to dashboard with limited access
    } else if (userData.role === 'administrator') {
      setCurrentState('dashboard'); // Admins get full dashboard access
    } else {
      setCurrentState('dashboard'); // Default fallback
    }
  };

  const handleRegister = (userData: any) => {
    setUser(userData);
    
    // Role-based routing after registration
    if (userData.role === 'athlete') {
      setCurrentState('bmi-form'); // Athletes need BMI form for personalized recommendations
    } else if (userData.role === 'official') {
      setCurrentState('dashboard'); // Officials skip BMI form and go directly to dashboard
    } else if (userData.role === 'administrator') {
      setCurrentState('dashboard'); // Admins skip BMI form and go directly to dashboard
    } else {
      setCurrentState('bmi-form'); // Default to BMI form
    }
  };

  const handleBMIComplete = (profileData: any) => {
    if (user) {
      setUser({ ...user, profile: profileData });
    }
    setCurrentState('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentState('login');
  };

  const handleStartVideoAnalysis = () => {
    setCurrentState('video-analysis');
  };

  const handleBackToDashboard = () => {
    setCurrentState('dashboard');
  };

  const handleViewReport = (reportData: any) => {
    setCurrentReport(reportData);
    setCurrentState('analysis-report');
  };

  const handleBackFromReport = () => {
    setCurrentReport(null);
    setCurrentState('dashboard');
  };

  const handleEditProfile = () => {
    setCurrentState('edit-profile');
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    if (user) {
      setUser({ ...user, profile: { ...user.profile, ...updatedProfile } });
    }
    setCurrentState('dashboard');
  };

  return (
    <div className="size-full safe-area-top safe-area-bottom">
      {currentState === 'login' && (
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentState('register')}
        />
      )}
      
      {currentState === 'register' && (
        <Registration 
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentState('login')}
        />
      )}
      
      {currentState === 'bmi-form' && user && user.role === 'athlete' && (
        <BMIFormEnhanced 
          onComplete={handleBMIComplete}
          userRole={user.role}
        />
      )}
      
      {currentState === 'dashboard' && user && (
        <Dashboard 
          user={user}
          onLogout={handleLogout}
          onStartVideoAnalysis={handleStartVideoAnalysis}
          onViewReport={handleViewReport}
          onEditProfile={handleEditProfile}
        />
      )}
      
      {currentState === 'video-analysis' && user && (user.role === 'athlete' || user.role === 'administrator') && (
        <VideoAnalysis 
          onBack={handleBackToDashboard}
          userRole={user.role}
        />
      )}
      
      {currentState === 'edit-profile' && user && (
        <BMIFormEnhanced 
          onComplete={handleProfileUpdate}
          userRole={user.role}
          initialData={user.profile}
          isEditing={true}
        />
      )}

      {currentState === 'analysis-report' && currentReport && user && (
        <AnalysisReport 
          analysisData={currentReport}
          onBack={handleBackFromReport}
          userRole={user.role}
        />
      )}
    </div>
  );
}