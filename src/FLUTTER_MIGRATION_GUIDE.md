# SportXcel Flutter Migration Guide

## Project Structure Mapping

### Current React Structure → Flutter Structure

```
React App Structure:
├── App.tsx (main routing)
├── components/
└── utils/supabase/

Flutter App Structure:
├── lib/
│   ├── main.dart (entry point)
│   ├── app.dart (main app widget)
│   ├── models/
│   ├── screens/
│   ├── widgets/
│   ├── services/
│   └── utils/
├── android/
├── ios/
└── pubspec.yaml (dependencies)
```

## Dependencies (pubspec.yaml)

```yaml
name: sportxcel
description: AI-powered mobile application for athletes

dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  provider: ^6.1.1
  
  # Backend & Auth
  supabase_flutter: ^2.0.0
  
  # UI & Navigation
  go_router: ^12.1.3
  flutter_svg: ^2.0.9
  cached_network_image: ^3.3.0
  
  # Camera & Video
  camera: ^0.10.5+5
  video_player: ^2.8.1
  image_picker: ^1.0.4
  
  # Forms & Validation
  flutter_form_builder: ^9.1.1
  form_builder_validators: ^9.1.0
  
  # Charts & Analytics
  fl_chart: ^0.66.0
  
  # Animations
  lottie: ^2.7.0
  
  # Utils
  intl: ^0.19.0
  uuid: ^4.2.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
```

## Screen Mapping

### 1. App.tsx → main.dart + app.dart

**main.dart**
```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'app.dart';
import 'services/auth_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Supabase.initialize(
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  );

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        // Add other providers
      ],
      child: SportXcelApp(),
    ),
  );
}
```

**app.dart**
```dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'services/auth_service.dart';
import 'screens/login_screen.dart';
import 'screens/registration_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/bmi_form_screen.dart';
import 'screens/video_analysis_screen.dart';
import 'screens/analysis_report_screen.dart';

class SportXcelApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'SportXcel',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Color(0xFF030213),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Color(0xFF030213),
          brightness: Brightness.dark,
        ),
        useMaterial3: true,
      ),
      routerConfig: _router,
    );
  }

  final GoRouter _router = GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(
        path: '/login',
        builder: (context, state) => LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => RegistrationScreen(),
      ),
      GoRoute(
        path: '/bmi-form',
        builder: (context, state) => BMIFormScreen(),
      ),
      GoRoute(
        path: '/dashboard',
        builder: (context, state) => DashboardScreen(),
      ),
      GoRoute(
        path: '/video-analysis',
        builder: (context, state) => VideoAnalysisScreen(),
      ),
      GoRoute(
        path: '/analysis-report',
        builder: (context, state) => AnalysisReportScreen(),
      ),
    ],
  );
}
```

### 2. Login.tsx → login_screen.dart

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../widgets/custom_text_field.dart';
import '../widgets/custom_button.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo and Title
                Icon(
                  Icons.sports,
                  size: 80,
                  color: Theme.of(context).colorScheme.primary,
                ),
                SizedBox(height: 16),
                Text(
                  'SportXcel',
                  style: Theme.of(context).textTheme.headlineLarge,
                ),
                Text(
                  'AI-Powered Athletic Performance',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                SizedBox(height: 48),

                // Email Field
                CustomTextField(
                  controller: _emailController,
                  label: 'Email',
                  validator: (value) {
                    if (value?.isEmpty ?? true) return 'Email is required';
                    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$')
                        .hasMatch(value!)) {
                      return 'Invalid email format';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),

                // Password Field
                CustomTextField(
                  controller: _passwordController,
                  label: 'Password',
                  isPassword: true,
                  validator: (value) {
                    if (value?.isEmpty ?? true) return 'Password is required';
                    return null;
                  },
                ),
                SizedBox(height: 24),

                // Login Button
                CustomButton(
                  text: 'Sign In',
                  isLoading: _isLoading,
                  onPressed: _handleLogin,
                ),
                SizedBox(height: 16),

                // Register Link
                TextButton(
                  onPressed: () => context.go('/register'),
                  child: Text('Don\'t have an account? Sign up'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final authService = context.read<AuthService>();
      await authService.signIn(
        _emailController.text.trim(),
        _passwordController.text,
      );
      
      if (mounted) {
        final user = authService.currentUser;
        if (user?.userMetadata?['role'] == 'athlete') {
          context.go('/dashboard');
        } else {
          context.go('/dashboard');
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Login failed: $e')),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
```

### 3. Dashboard.tsx → dashboard_screen.dart

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/auth_service.dart';
import '../widgets/dashboard_card.dart';
import '../widgets/recent_activity.dart';
import '../widgets/performance_chart.dart';

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('SportXcel'),
        actions: [
          IconButton(
            icon: Icon(Icons.notifications),
            onPressed: () => _showNotifications(),
          ),
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'logout') {
                context.read<AuthService>().signOut();
                context.go('/login');
              }
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: 'profile',
                child: Text('Profile'),
              ),
              PopupMenuItem(
                value: 'settings',
                child: Text('Settings'),
              ),
              PopupMenuItem(
                value: 'logout',
                child: Text('Logout'),
              ),
            ],
          ),
        ],
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: [
          _buildHomeTab(),
          _buildAnalysisTab(),
          _buildNutritionTab(),
          _buildProgressTab(),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.analytics),
            label: 'Analysis',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.restaurant),
            label: 'Nutrition',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.trending_up),
            label: 'Progress',
          ),
        ],
      ),
      floatingActionButton: _currentIndex == 1
          ? FloatingActionButton(
              onPressed: () => context.go('/video-analysis'),
              child: Icon(Icons.videocam),
            )
          : null,
    );
  }

  Widget _buildHomeTab() {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Welcome Message
          Card(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 24,
                    child: Icon(Icons.person),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome back!',
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        Text('Ready to improve your performance?'),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 16),

          // Quick Actions
          Text(
            'Quick Actions',
            style: Theme.of(context).textTheme.titleLarge,
          ),
          SizedBox(height: 8),
          GridView.count(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
            children: [
              DashboardCard(
                title: 'Video Analysis',
                icon: Icons.videocam,
                onTap: () => context.go('/video-analysis'),
              ),
              DashboardCard(
                title: 'Nutrition Plan',
                icon: Icons.restaurant,
                onTap: () => setState(() => _currentIndex = 2),
              ),
              DashboardCard(
                title: 'Progress Report',
                icon: Icons.analytics,
                onTap: () => setState(() => _currentIndex = 3),
              ),
              DashboardCard(
                title: 'Training Plan',
                icon: Icons.fitness_center,
                onTap: () => _showTrainingPlan(),
              ),
            ],
          ),
          SizedBox(height: 16),

          // Recent Activity
          RecentActivity(),
        ],
      ),
    );
  }

  Widget _buildAnalysisTab() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.analytics, size: 80),
          SizedBox(height: 16),
          Text('Performance Analysis'),
          Text('Upload a video to get started'),
          SizedBox(height: 24),
          ElevatedButton.icon(
            onPressed: () => context.go('/video-analysis'),
            icon: Icon(Icons.videocam),
            label: Text('Start Analysis'),
          ),
        ],
      ),
    );
  }

  Widget _buildNutritionTab() {
    return Center(
      child: Text('Nutrition recommendations will be displayed here'),
    );
  }

  Widget _buildProgressTab() {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        children: [
          PerformanceChart(),
          // Add more progress widgets
        ],
      ),
    );
  }

  void _showNotifications() {
    // Implement notifications
  }

  void _showTrainingPlan() {
    // Implement training plan
  }
}
```

### 4. VideoAnalysis.tsx → video_analysis_screen.dart

```dart
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class VideoAnalysisScreen extends StatefulWidget {
  @override
  _VideoAnalysisScreenState createState() => _VideoAnalysisScreenState();
}

class _VideoAnalysisScreenState extends State<VideoAnalysisScreen> {
  CameraController? _cameraController;
  List<CameraDescription>? cameras;
  bool _isRecording = false;
  File? _selectedVideo;
  final ImagePicker _picker = ImagePicker();

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    cameras = await availableCameras();
    if (cameras?.isNotEmpty ?? false) {
      _cameraController = CameraController(
        cameras![0],
        ResolutionPreset.high,
      );
      await _cameraController!.initialize();
      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Video Analysis'),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () => context.go('/dashboard'),
        ),
      ),
      body: Column(
        children: [
          // Camera Preview
          Expanded(
            flex: 3,
            child: _cameraController?.value.isInitialized ?? false
                ? CameraPreview(_cameraController!)
                : Center(child: CircularProgressIndicator()),
          ),

          // Controls
          Expanded(
            flex: 1,
            child: Container(
              padding: EdgeInsets.all(16),
              child: Column(
                children: [
                  // Sport Selection
                  DropdownButtonFormField<String>(
                    decoration: InputDecoration(
                      labelText: 'Select Sport',
                      border: OutlineInputBorder(),
                    ),
                    items: ['Running', 'Swimming', 'Cycling', 'Weightlifting', 'Yoga', 'Other']
                        .map((sport) => DropdownMenuItem(
                              value: sport,
                              child: Text(sport),
                            ))
                        .toList(),
                    onChanged: (value) {
                      // Handle sport selection
                    },
                  ),
                  SizedBox(height: 16),

                  // Action Buttons
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      // Upload Video Button
                      ElevatedButton.icon(
                        onPressed: _pickVideo,
                        icon: Icon(Icons.upload),
                        label: Text('Upload'),
                      ),

                      // Record Button
                      ElevatedButton.icon(
                        onPressed: _toggleRecording,
                        icon: Icon(_isRecording ? Icons.stop : Icons.fiber_manual_record),
                        label: Text(_isRecording ? 'Stop' : 'Record'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _isRecording ? Colors.red : null,
                        ),
                      ),

                      // Analyze Button
                      ElevatedButton.icon(
                        onPressed: _selectedVideo != null ? _analyzeVideo : null,
                        icon: Icon(Icons.analytics),
                        label: Text('Analyze'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _pickVideo() async {
    final XFile? video = await _picker.pickVideo(source: ImageSource.gallery);
    if (video != null) {
      setState(() {
        _selectedVideo = File(video.path);
      });
    }
  }

  Future<void> _toggleRecording() async {
    if (!_isRecording) {
      await _cameraController!.startVideoRecording();
      setState(() => _isRecording = true);
    } else {
      final XFile video = await _cameraController!.stopVideoRecording();
      setState(() {
        _isRecording = false;
        _selectedVideo = File(video.path);
      });
    }
  }

  Future<void> _analyzeVideo() async {
    // Implement video analysis logic
    // This would call your Supabase function
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text('Analyzing your performance...'),
          ],
        ),
      ),
    );

    // Simulate analysis
    await Future.delayed(Duration(seconds: 3));
    Navigator.of(context).pop();
    
    context.go('/analysis-report');
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    super.dispose();
  }
}
```

## Services

### auth_service.dart
```dart
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthService extends ChangeNotifier {
  final SupabaseClient _supabase = Supabase.instance.client;
  
  User? get currentUser => _supabase.auth.currentUser;
  bool get isAuthenticated => currentUser != null;

  Future<void> signUp(String email, String password, String role, String name) async {
    final response = await _supabase.auth.signUp(
      email: email,
      password: password,
      data: {
        'role': role,
        'name': name,
      },
    );
    
    if (response.user != null) {
      notifyListeners();
    }
  }

  Future<void> signIn(String email, String password) async {
    await _supabase.auth.signInWithPassword(
      email: email,
      password: password,
    );
    notifyListeners();
  }

  Future<void> signOut() async {
    await _supabase.auth.signOut();
    notifyListeners();
  }
}
```

## Key Differences and Considerations

### 1. State Management
- React: useState, useContext
- Flutter: Provider, Riverpod, or Bloc

### 2. Navigation
- React: Custom state-based routing
- Flutter: GoRouter or Navigator 2.0

### 3. Styling
- React: Tailwind CSS classes
- Flutter: ThemeData and custom widgets

### 4. Components vs Widgets
- React components become Flutter widgets
- Props become constructor parameters
- State hooks become StatefulWidget

### 5. Camera Implementation
- React: Browser MediaRecorder API
- Flutter: camera plugin with native access

### 6. Backend Integration
- Both use Supabase, but Flutter has dedicated SDK
- Similar auth patterns but different syntax

## Migration Steps

1. **Setup Flutter Project**
   ```bash
   flutter create sportxcel
   cd sportxcel
   ```

2. **Add Dependencies**
   - Copy pubspec.yaml content above

3. **Create Folder Structure**
   ```
   lib/
   ├── main.dart
   ├── app.dart
   ├── models/
   ├── screens/
   ├── widgets/
   └── services/
   ```

4. **Convert Components One by One**
   - Start with simple components (Login, Registration)
   - Then complex ones (Dashboard, VideoAnalysis)
   - Test each conversion thoroughly

5. **Setup Supabase**
   - Configure with Flutter SDK
   - Test auth flow
   - Migrate backend functions

6. **Test on Devices**
   - iOS and Android testing
   - Camera permissions
   - Video upload functionality

## Development Timeline Estimate

- **Week 1-2**: Project setup, basic screens (Login, Registration, Dashboard)
- **Week 3-4**: Video analysis, camera integration
- **Week 5-6**: Backend integration, data flow
- **Week 7-8**: Testing, refinement, deployment

This migration requires significant development effort but will result in a native mobile app with better performance and platform integration.