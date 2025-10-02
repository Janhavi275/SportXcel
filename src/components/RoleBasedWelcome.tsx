import { Card, CardContent } from './ui/card';
import { Trophy, Shield, User, Target, BarChart3, FileCheck } from 'lucide-react';

interface RoleBasedWelcomeProps {
  user: {
    username: string;
    role: string;
    full_name?: string;
  };
}

export function RoleBasedWelcome({ user }: RoleBasedWelcomeProps) {
  const getRoleConfig = () => {
    switch (user.role) {
      case 'athlete':
        return {
          icon: Trophy,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          title: `Welcome back, ${user.full_name || user.username}!`,
          subtitle: 'Ready to elevate your performance?',
          features: [
            'Upload and analyze your training videos',
            'Get personalized nutrition recommendations',
            'Track your performance metrics and progress',
            'Earn achievements and compete on leaderboards'
          ]
        };
      case 'official':
        return {
          icon: Shield,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          title: `Welcome, Official ${user.full_name || user.username}`,
          subtitle: 'Time to review and validate performances',
          features: [
            'Review pending athlete submissions',
            'Validate performance analysis results',
            'Monitor system integrity and security',
            'Access official review dashboard'
          ]
        };
      case 'administrator':
        return {
          icon: User,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          title: `Administrator Dashboard - ${user.full_name || user.username}`,
          subtitle: 'Manage the entire SportXcel ecosystem',
          features: [
            'Manage user accounts and permissions',
            'Monitor system performance and analytics',
            'Configure security and cheat detection',
            'Generate comprehensive reports'
          ]
        };
      default:
        return {
          icon: Target,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          title: `Welcome, ${user.full_name || user.username}`,
          subtitle: 'Get started with SportXcel',
          features: []
        };
    }
  };

  const config = getRoleConfig();
  const IconComponent = config.icon;

  return (
    <Card className={`${config.bgColor} border-l-4 ${config.color.replace('text-', 'border-l-')}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center border`}>
            <IconComponent className={`w-6 h-6 ${config.color}`} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg mb-1">{config.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{config.subtitle}</p>
            
            {config.features.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">What you can do:</h3>
                <ul className="space-y-1">
                  {config.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}