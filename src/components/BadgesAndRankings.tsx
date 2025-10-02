import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Trophy, 
  Medal, 
  Star, 
  Target, 
  Flame, 
  Crown, 
  Award,
  TrendingUp,
  Calendar,
  Users
} from 'lucide-react';

interface BadgesAndRankingsProps {
  userRole: string;
}

export function BadgesAndRankings({ userRole }: BadgesAndRankingsProps) {
  const [activeTab, setActiveTab] = useState('badges');

  const userBadges = [
    {
      id: 1,
      name: 'Consistency Champion',
      description: 'Completed 30 consecutive training sessions',
      icon: Trophy,
      earned: true,
      earnedDate: '2024-09-15',
      rarity: 'gold',
      progress: 100
    },
    {
      id: 2,
      name: 'Technique Master',
      description: 'Achieved 90%+ technique score',
      icon: Star,
      earned: true,
      earnedDate: '2024-09-28',
      rarity: 'silver',
      progress: 100
    },
    {
      id: 3,
      name: 'Speed Demon',
      description: 'Top 10% in speed category',
      icon: Flame,
      earned: true,
      earnedDate: '2024-10-01',
      rarity: 'bronze',
      progress: 100
    },
    {
      id: 4,
      name: 'Endurance Elite',
      description: 'Complete 60-minute training session',
      icon: Target,
      earned: false,
      earnedDate: null,
      rarity: 'gold',
      progress: 75
    },
    {
      id: 5,
      name: 'Perfect Form',
      description: 'Achieve 100% posture score',
      icon: Award,
      earned: false,
      earnedDate: null,
      rarity: 'platinum',
      progress: 85
    },
    {
      id: 6,
      name: 'Rising Star',
      description: 'Top 5% improvement this month',
      icon: TrendingUp,
      earned: false,
      earnedDate: null,
      rarity: 'silver',
      progress: 45
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Chen', score: 2850, badge: 'Champion', avatar: '🏆' },
    { rank: 2, name: 'Maria Rodriguez', score: 2720, badge: 'Elite', avatar: '🥈' },
    { rank: 3, name: 'David Kim', score: 2680, badge: 'Pro', avatar: '🥉' },
    { rank: 4, name: 'Sarah Johnson', score: 2650, badge: 'Advanced', avatar: '⭐' },
    { rank: 5, name: 'Mike Thompson', score: 2580, badge: 'Advanced', avatar: '⭐' },
    { rank: 6, name: 'You', score: 2520, badge: 'Advanced', avatar: '👤', isCurrentUser: true },
    { rank: 7, name: 'Emma Wilson', score: 2480, badge: 'Intermediate', avatar: '🔸' },
    { rank: 8, name: 'James Brown', score: 2450, badge: 'Intermediate', avatar: '🔸' }
  ];

  const rankingCategories = [
    { name: 'Overall Performance', rank: 6, total: 1250, percentile: 92 },
    { name: 'Technique Score', rank: 4, total: 850, percentile: 95 },
    { name: 'Consistency Rating', rank: 8, total: 1100, percentile: 88 },
    { name: 'Improvement Rate', rank: 3, total: 900, percentile: 97 }
  ];

  const getBadgeColor = (rarity: string, earned: boolean) => {
    if (!earned) return 'text-gray-400';
    
    switch (rarity) {
      case 'platinum': return 'text-purple-600';
      case 'gold': return 'text-yellow-600';
      case 'silver': return 'text-gray-600';
      case 'bronze': return 'text-orange-600';
      default: return 'text-blue-600';
    }
  };

  const getBadgeBackground = (rarity: string, earned: boolean) => {
    if (!earned) return 'bg-gray-100';
    
    switch (rarity) {
      case 'platinum': return 'bg-purple-50 border-purple-200';
      case 'gold': return 'bg-yellow-50 border-yellow-200';
      case 'silver': return 'bg-gray-50 border-gray-200';
      case 'bronze': return 'bg-orange-50 border-orange-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Achievements & Rankings</h2>
        <Badge variant="secondary">Level 12 Athlete</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Medal className="w-4 h-4" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="rankings" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Rankings
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userBadges.map((badge) => {
              const IconComponent = badge.icon;
              return (
                <Card 
                  key={badge.id} 
                  className={`transition-all hover:shadow-md ${getBadgeBackground(badge.rarity, badge.earned)}`}
                >
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${badge.earned ? getBadgeBackground(badge.rarity, true) : 'bg-gray-100'}`}>
                        <IconComponent className={`w-8 h-8 ${getBadgeColor(badge.rarity, badge.earned)}`} />
                      </div>
                      
                      <div>
                        <h3 className={`text-lg ${badge.earned ? '' : 'text-gray-500'}`}>
                          {badge.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {badge.description}
                        </p>
                        
                        {badge.earned ? (
                          <div className="mt-2">
                            <Badge variant="default" className="capitalize">
                              {badge.rarity}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              Earned: {badge.earnedDate}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-2 space-y-2">
                            <Progress value={badge.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {badge.progress}% complete
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Badge Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Badges Earned</span>
                  <span className="text-sm">{userBadges.filter(b => b.earned).length}/{userBadges.length}</span>
                </div>
                <Progress value={(userBadges.filter(b => b.earned).length / userBadges.length) * 100} />
                
                <div className="grid grid-cols-4 gap-4 text-center text-sm">
                  <div>
                    <div className="text-lg text-purple-600">0</div>
                    <div className="text-xs text-muted-foreground">Platinum</div>
                  </div>
                  <div>
                    <div className="text-lg text-yellow-600">1</div>
                    <div className="text-xs text-muted-foreground">Gold</div>
                  </div>
                  <div>
                    <div className="text-lg text-gray-600">1</div>
                    <div className="text-xs text-muted-foreground">Silver</div>
                  </div>
                  <div>
                    <div className="text-lg text-orange-600">1</div>
                    <div className="text-xs text-muted-foreground">Bronze</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rankingCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Rank</span>
                      <Badge variant="secondary">#{category.rank}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Percentile</span>
                        <span className="text-green-600">{category.percentile}%</span>
                      </div>
                      <Progress value={category.percentile} className="h-2" />
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Out of {category.total} athletes in your category
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ranking History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { period: 'This Week', rank: 6, change: '+2' },
                  { period: 'This Month', rank: 8, change: '+5' },
                  { period: 'Last Month', rank: 13, change: '+3' },
                  { period: '3 Months Ago', rank: 16, change: '' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm">{item.period}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{item.rank}</Badge>
                      {item.change && (
                        <span className="text-xs text-green-600">{item.change}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Global Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboard.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      user.isCurrentUser ? 'bg-blue-50 border-blue-200' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center w-8">
                        <div className={`text-lg ${user.rank <= 3 ? 'text-yellow-600' : ''}`}>
                          #{user.rank}
                        </div>
                      </div>
                      
                      <div className="text-2xl">{user.avatar}</div>
                      
                      <div>
                        <p className={`text-sm ${user.isCurrentUser ? 'font-semibold' : ''}`}>
                          {user.name}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {user.badge}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg">{user.score.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Weekly Rank</CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">#4</div>
                <p className="text-xs text-muted-foreground">+2 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Points This Week</CardTitle>
                <Star className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">385</div>
                <p className="text-xs text-muted-foreground">+45 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Athletes Nearby</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">12</div>
                <p className="text-xs text-muted-foreground">Within 50 points</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}