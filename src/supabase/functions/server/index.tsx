import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))

app.use('*', logger(console.log))

// Initialize storage buckets on startup
async function initializeBuckets() {
  const buckets = [
    'make-68ab92fd-videos',
    'make-68ab92fd-profile-images',
    'make-68ab92fd-analysis-reports'
  ]
  
  const { data: existingBuckets } = await supabase.storage.listBuckets()
  
  for (const bucketName of buckets) {
    const bucketExists = existingBuckets?.some(bucket => bucket.name === bucketName)
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`)
      await supabase.storage.createBucket(bucketName, { public: false })
    }
  }
}

// Initialize buckets
initializeBuckets().catch(console.error)

// Helper function to verify user authorization
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1]
  if (!accessToken) {
    return { error: 'No access token provided', status: 401 }
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken)
  if (error || !user?.id) {
    return { error: 'Invalid or expired token', status: 401 }
  }
  
  return { user, error: null }
}

// User Registration
app.post('/make-server-68ab92fd/auth/register', async (c) => {
  try {
    const { email, password, username, role, fullName } = await c.req.json()
    
    if (!email || !password || !username || !role || !fullName) {
      return c.json({ error: 'Missing required fields' }, 400)
    }
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        username, 
        role, 
        full_name: fullName,
        created_at: new Date().toISOString()
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    })
    
    if (authError) {
      console.log('Auth registration error:', authError)
      return c.json({ error: `Registration failed: ${authError.message}` }, 400)
    }
    
    // Store additional user profile data
    const userProfile = {
      user_id: authData.user.id,
      email,
      username,
      role,
      full_name: fullName,
      created_at: new Date().toISOString(),
      bmi_completed: false,
      profile_complete: false
    }
    
    await kv.set(`user_profile:${authData.user.id}`, userProfile)
    await kv.set(`username:${username}`, authData.user.id)
    
    return c.json({ 
      message: 'Registration successful', 
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username,
        role,
        full_name: fullName
      }
    })
  } catch (error) {
    console.log('Registration error:', error)
    return c.json({ error: `Registration failed: ${error.message}` }, 500)
  }
})

// Get User Profile
app.get('/make-server-68ab92fd/user/profile', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  try {
    const profile = await kv.get(`user_profile:${user.id}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }
    
    return c.json({ profile })
  } catch (error) {
    console.log('Get profile error:', error)
    return c.json({ error: 'Failed to get profile' }, 500)
  }
})

// Update BMI Form Data
app.post('/make-server-68ab92fd/user/bmi', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  try {
    const bmiData = await c.req.json()
    
    // Store BMI data
    const bmiRecord = {
      user_id: user.id,
      ...bmiData,
      updated_at: new Date().toISOString()
    }
    
    await kv.set(`bmi_data:${user.id}`, bmiRecord)
    
    // Update user profile to mark BMI as completed
    const profile = await kv.get(`user_profile:${user.id}`)
    if (profile) {
      profile.bmi_completed = true
      profile.profile_complete = true
      await kv.set(`user_profile:${user.id}`, profile)
    }
    
    return c.json({ message: 'BMI data saved successfully', data: bmiRecord })
  } catch (error) {
    console.log('BMI update error:', error)
    return c.json({ error: 'Failed to save BMI data' }, 500)
  }
})

// Get BMI Data
app.get('/make-server-68ab92fd/user/bmi', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  try {
    const bmiData = await kv.get(`bmi_data:${user.id}`)
    return c.json({ bmiData })
  } catch (error) {
    console.log('Get BMI error:', error)
    return c.json({ error: 'Failed to get BMI data' }, 500)
  }
})

// Video Upload
app.post('/make-server-68ab92fd/video/upload', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  try {
    const formData = await c.req.formData()
    const videoFile = formData.get('video') as File
    const sport = formData.get('sport') as string
    const videoType = formData.get('videoType') as string
    
    if (!videoFile) {
      return c.json({ error: 'No video file provided' }, 400)
    }
    
    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${user.id}_${timestamp}_${videoFile.name}`
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('make-68ab92fd-videos')
      .upload(fileName, videoFile, {
        contentType: videoFile.type,
        cacheControl: '3600'
      })
    
    if (uploadError) {
      console.log('Video upload error:', uploadError)
      return c.json({ error: 'Failed to upload video' }, 500)
    }
    
    // Create signed URL for access
    const { data: signedUrlData } = await supabase.storage
      .from('make-68ab92fd-videos')
      .createSignedUrl(fileName, 3600) // 1 hour expiry
    
    // Store video metadata
    const videoRecord = {
      id: `video_${timestamp}`,
      user_id: user.id,
      file_name: fileName,
      original_name: videoFile.name,
      sport,
      video_type: videoType,
      file_size: videoFile.size,
      upload_date: new Date().toISOString(),
      status: 'uploaded',
      signed_url: signedUrlData?.signedUrl
    }
    
    await kv.set(`video:${videoRecord.id}`, videoRecord)
    
    return c.json({ 
      message: 'Video uploaded successfully', 
      videoId: videoRecord.id,
      signedUrl: signedUrlData?.signedUrl
    })
  } catch (error) {
    console.log('Video upload error:', error)
    return c.json({ error: 'Failed to upload video' }, 500)
  }
})

// Start Video Analysis
app.post('/make-server-68ab92fd/video/analyze/:videoId', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  const videoId = c.req.param('videoId')
  
  try {
    const videoRecord = await kv.get(`video:${videoId}`)
    if (!videoRecord || videoRecord.user_id !== user.id) {
      return c.json({ error: 'Video not found or unauthorized' }, 404)
    }
    
    // Generate analysis ID
    const analysisId = `analysis_${Date.now()}`
    
    // Simulate AI analysis pipeline with realistic stages
    const analysisStages = [
      'Video Processing',
      'Motion Tracking',
      'Biomechanical Analysis',
      'Performance Metrics',
      'Security Verification',
      'Report Generation',
      'Quality Assessment'
    ]
    
    // Create analysis record
    const analysisRecord = {
      id: analysisId,
      video_id: videoId,
      user_id: user.id,
      sport: videoRecord.sport,
      status: 'processing',
      current_stage: 0,
      stages: analysisStages,
      started_at: new Date().toISOString(),
      progress: 0
    }
    
    await kv.set(`analysis:${analysisId}`, analysisRecord)
    
    // Start background processing (simulated)
    processVideoAnalysis(analysisId).catch(console.error)
    
    return c.json({ 
      message: 'Analysis started successfully', 
      analysisId,
      stages: analysisStages
    })
  } catch (error) {
    console.log('Analysis start error:', error)
    return c.json({ error: 'Failed to start analysis' }, 500)
  }
})

// Get Analysis Status
app.get('/make-server-68ab92fd/analysis/:analysisId/status', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  const analysisId = c.req.param('analysisId')
  
  try {
    const analysis = await kv.get(`analysis:${analysisId}`)
    if (!analysis || analysis.user_id !== user.id) {
      return c.json({ error: 'Analysis not found or unauthorized' }, 404)
    }
    
    return c.json({ analysis })
  } catch (error) {
    console.log('Get analysis status error:', error)
    return c.json({ error: 'Failed to get analysis status' }, 500)
  }
})

// Get Analysis Results
app.get('/make-server-68ab92fd/analysis/:analysisId/results', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  const analysisId = c.req.param('analysisId')
  
  try {
    const results = await kv.get(`analysis_results:${analysisId}`)
    if (!results || results.user_id !== user.id) {
      return c.json({ error: 'Results not found or unauthorized' }, 404)
    }
    
    return c.json({ results })
  } catch (error) {
    console.log('Get analysis results error:', error)
    return c.json({ error: 'Failed to get analysis results' }, 500)
  }
})

// Get User Dashboard Data
app.get('/make-server-68ab92fd/dashboard', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  try {
    // Get user profile and BMI data
    const profile = await kv.get(`user_profile:${user.id}`)
    const bmiData = await kv.get(`bmi_data:${user.id}`)
    
    // Get recent analyses
    const analysisKeys = await kv.getByPrefix(`analysis_results:`)
    const userAnalyses = analysisKeys
      .filter(item => item.value.user_id === user.id)
      .sort((a, b) => new Date(b.value.completed_at).getTime() - new Date(a.value.completed_at).getTime())
      .slice(0, 5)
    
    // Get recent activities
    const activityKeys = await kv.getByPrefix(`activity:${user.id}:`)
    const recentActivities = activityKeys
      .map(item => item.value)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 8)
    
    // Generate performance stats
    const totalAnalyses = userAnalyses.length
    const avgPerformanceScore = userAnalyses.length > 0 
      ? userAnalyses.reduce((sum, analysis) => sum + analysis.value.overall_score, 0) / userAnalyses.length
      : 0
    
    const dashboardData = {
      profile,
      bmiData,
      stats: {
        total_analyses: totalAnalyses,
        avg_performance_score: Math.round(avgPerformanceScore),
        recent_analyses: userAnalyses.length,
        improvement_trend: totalAnalyses > 1 ? 'improving' : 'baseline',
        total_activities: recentActivities.length
      },
      recent_analyses: userAnalyses.map(item => ({
        id: item.value.id,
        sport: item.value.sport,
        overall_score: item.value.overall_score,
        completed_at: item.value.completed_at
      })),
      recent_activities: recentActivities
    }
    
    return c.json({ dashboardData })
  } catch (error) {
    console.log('Dashboard data error:', error)
    return c.json({ error: 'Failed to get dashboard data' }, 500)
  }
})

// Get Nutrition Suggestions
app.get('/make-server-68ab92fd/nutrition/:sport', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  const sport = c.req.param('sport')
  
  try {
    const bmiData = await kv.get(`bmi_data:${user.id}`)
    
    // Generate sport-specific nutrition and supplement suggestions
    const nutritionSuggestions = generateNutritionSuggestions(sport, bmiData)
    
    return c.json({ suggestions: nutritionSuggestions })
  } catch (error) {
    console.log('Nutrition suggestions error:', error)
    return c.json({ error: 'Failed to get nutrition suggestions' }, 500)
  }
})

// Background processing function
async function processVideoAnalysis(analysisId: string) {
  const analysis = await kv.get(`analysis:${analysisId}`)
  if (!analysis) return
  
  const stages = analysis.stages
  
  for (let i = 0; i < stages.length; i++) {
    // Simulate processing time for each stage
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))
    
    analysis.current_stage = i
    analysis.progress = Math.round(((i + 1) / stages.length) * 100)
    
    if (i === stages.length - 1) {
      analysis.status = 'completed'
      analysis.completed_at = new Date().toISOString()
      
      // Generate comprehensive analysis results
      const results = generateAnalysisResults(analysis)
      await kv.set(`analysis_results:${analysisId}`, results)
    }
    
    await kv.set(`analysis:${analysisId}`, analysis)
  }
}

// Generate realistic analysis results
function generateAnalysisResults(analysis: any) {
  const sports = {
    basketball: { focus: 'Jumping, Ball Handling, Shooting Form', baseScore: 75 },
    soccer: { focus: 'Ball Control, Running Form, Kicking Technique', baseScore: 78 },
    tennis: { focus: 'Swing Mechanics, Footwork, Court Movement', baseScore: 73 },
    swimming: { focus: 'Stroke Technique, Body Position, Timing', baseScore: 80 },
    running: { focus: 'Running Form, Cadence, Efficiency', baseScore: 77 },
    cycling: { focus: 'Pedaling Technique, Posture, Power Transfer', baseScore: 76 },
    golf: { focus: 'Swing Plane, Balance, Follow-through', baseScore: 74 },
    default: { focus: 'Movement Efficiency, Form, Technique', baseScore: 75 }
  }
  
  const sportInfo = sports[analysis.sport.toLowerCase()] || sports.default
  const variation = (Math.random() - 0.5) * 20 // ±10 point variation
  const overallScore = Math.max(60, Math.min(100, Math.round(sportInfo.baseScore + variation)))
  
  return {
    id: analysis.id,
    user_id: analysis.user_id,
    video_id: analysis.video_id,
    sport: analysis.sport,
    overall_score: overallScore,
    completed_at: new Date().toISOString(),
    metrics: {
      technique_score: Math.max(60, Math.min(100, overallScore + Math.round((Math.random() - 0.5) * 10))),
      consistency_score: Math.max(60, Math.min(100, overallScore + Math.round((Math.random() - 0.5) * 10))),
      power_score: Math.max(60, Math.min(100, overallScore + Math.round((Math.random() - 0.5) * 10))),
      efficiency_score: Math.max(60, Math.min(100, overallScore + Math.round((Math.random() - 0.5) * 10)))
    },
    biomechanics: {
      joint_angles: `${sportInfo.focus} analysis completed`,
      movement_patterns: 'Analyzed and evaluated',
      force_distribution: 'Optimal distribution detected',
      timing_analysis: 'Good synchronization'
    },
    recommendations: [
      `Focus on improving ${sportInfo.focus.split(',')[0].toLowerCase()}`,
      'Maintain consistent training schedule',
      'Review technique videos for reference',
      'Consider working with a coach for personalized guidance'
    ],
    security_verification: {
      authenticity_score: Math.round(85 + Math.random() * 10),
      fraud_detection: 'No anomalies detected',
      blockchain_hash: `0x${Math.random().toString(16).substring(2, 18)}`,
      verification_status: 'Verified'
    }
  }
}

// Generate nutrition suggestions based on sport and BMI data
function generateNutritionSuggestions(sport: string, bmiData: any) {
  const suggestions = {
    basketball: {
      diet: ['High protein for muscle recovery', 'Complex carbs for sustained energy', 'Adequate hydration'],
      supplements: ['Whey Protein', 'Creatine', 'Multivitamin', 'Omega-3'],
      meals: ['Pre-workout: Banana with almond butter', 'Post-workout: Protein shake with berries']
    },
    soccer: {
      diet: ['Carb-loading before games', 'Lean proteins for recovery', 'Anti-inflammatory foods'],
      supplements: ['BCAA', 'Electrolytes', 'Vitamin D', 'Magnesium'],
      meals: ['Pre-game: Oatmeal with fruits', 'Post-game: Quinoa bowl with vegetables']
    },
    default: {
      diet: ['Balanced macronutrients', 'Whole foods focus', 'Proper hydration'],
      supplements: ['Multivitamin', 'Protein Powder', 'Fish Oil'],
      meals: ['Pre-workout: Light carbs', 'Post-workout: Protein and carbs']
    }
  }
  
  const sportSuggestions = suggestions[sport.toLowerCase()] || suggestions.default
  
  // Adjust based on dietary preferences
  if (bmiData?.dietaryPreference === 'vegetarian') {
    sportSuggestions.supplements = sportSuggestions.supplements.map(supp => 
      supp === 'Whey Protein' ? 'Plant Protein' : supp
    )
  }
  
  return sportSuggestions
}

// Training Plans - Get all plans for user
app.get('/make-server-68ab92fd/training-plans', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  try {
    const planKeys = await kv.getByPrefix(`training_plan:${user.id}:`)
    const plans = planKeys.map(item => item.value).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    
    return c.json({ plans })
  } catch (error) {
    console.log('Get training plans error:', error)
    return c.json({ error: 'Failed to get training plans' }, 500)
  }
})

// Training Plans - Create new plan
app.post('/make-server-68ab92fd/training-plans', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  try {
    const planData = await c.req.json()
    
    const planId = `plan_${Date.now()}`
    const plan = {
      id: planId,
      user_id: user.id,
      ...planData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    await kv.set(`training_plan:${user.id}:${planId}`, plan)
    
    return c.json({ 
      message: 'Training plan created successfully', 
      plan 
    })
  } catch (error) {
    console.log('Create training plan error:', error)
    return c.json({ error: 'Failed to create training plan' }, 500)
  }
})

// Training Plans - Update existing plan
app.put('/make-server-68ab92fd/training-plans', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  try {
    const planData = await c.req.json()
    
    if (!planData.id) {
      return c.json({ error: 'Plan ID is required for updates' }, 400)
    }
    
    // Verify ownership
    const existingPlan = await kv.get(`training_plan:${user.id}:${planData.id}`)
    if (!existingPlan) {
      return c.json({ error: 'Training plan not found or unauthorized' }, 404)
    }
    
    const updatedPlan = {
      ...existingPlan,
      ...planData,
      updated_at: new Date().toISOString()
    }
    
    await kv.set(`training_plan:${user.id}:${planData.id}`, updatedPlan)
    
    return c.json({ 
      message: 'Training plan updated successfully', 
      plan: updatedPlan 
    })
  } catch (error) {
    console.log('Update training plan error:', error)
    return c.json({ error: 'Failed to update training plan' }, 500)
  }
})

// Training Plans - Delete plan
app.delete('/make-server-68ab92fd/training-plans/:planId', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  const planId = c.req.param('planId')
  
  try {
    // Verify ownership
    const existingPlan = await kv.get(`training_plan:${user.id}:${planId}`)
    if (!existingPlan) {
      return c.json({ error: 'Training plan not found or unauthorized' }, 404)
    }
    
    await kv.del(`training_plan:${user.id}:${planId}`)
    
    return c.json({ message: 'Training plan deleted successfully' })
  } catch (error) {
    console.log('Delete training plan error:', error)
    return c.json({ error: 'Failed to delete training plan' }, 500)
  }
})

// Training Plans - Download plan as PDF
app.get('/make-server-68ab92fd/training-plans/:planId/download', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  const planId = c.req.param('planId')
  
  try {
    // Verify ownership
    const plan = await kv.get(`training_plan:${user.id}:${planId}`)
    if (!plan) {
      return c.json({ error: 'Training plan not found or unauthorized' }, 404)
    }
    
    // Generate PDF content (simplified JSON format for demo)
    const pdfContent = {
      title: `${plan.name} - Training Plan`,
      generatedDate: new Date().toLocaleDateString(),
      athlete: user.email,
      plan: {
        name: plan.name,
        sport: plan.sport,
        duration: plan.duration,
        level: plan.level,
        goal: plan.goal,
        description: plan.description,
        exercises: plan.exercises,
        schedule: plan.schedule,
        nutritionGuidelines: plan.nutritionGuidelines,
        recoveryProtocol: plan.recoveryProtocol,
        progressMetrics: plan.progressMetrics
      },
      footer: 'Generated by SportXcel AI Training System'
    }
    
    // In a real implementation, you would generate actual PDF bytes
    // For now, we'll return JSON data that the frontend can process
    const pdfData = JSON.stringify(pdfContent, null, 2)
    
    return c.json({ 
      message: 'PDF generated successfully',
      pdfData,
      filename: `${plan.name.replace(/\s+/g, '_')}_Training_Plan.pdf`
    })
  } catch (error) {
    console.log('Download training plan error:', error)
    return c.json({ error: 'Failed to generate PDF' }, 500)
  }
})

// Training Plan Analytics
app.get('/make-server-68ab92fd/training-plans/analytics', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }
  
  try {
    const planKeys = await kv.getByPrefix(`training_plan:${user.id}:`)
    const plans = planKeys.map(item => item.value)
    
    const analytics = {
      totalPlans: plans.length,
      completedPlans: plans.filter(plan => plan.status === 'completed').length,
      activePlans: plans.filter(plan => plan.status !== 'completed').length,
      sportBreakdown: plans.reduce((acc, plan) => {
        acc[plan.sport] = (acc[plan.sport] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      avgDuration: plans.length > 0 
        ? Math.round(plans.reduce((sum, plan) => sum + parseInt(plan.duration), 0) / plans.length)
        : 0,
      recentActivity: plans
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5)
        .map(plan => ({
          id: plan.id,
          name: plan.name,
          sport: plan.sport,
          updated_at: plan.updated_at
        }))
    }
    
    return c.json({ analytics })
  } catch (error) {
    console.log('Training plan analytics error:', error)
    return c.json({ error: 'Failed to get training plan analytics' }, 500)
  }
})

// Activity Logging
app.post('/make-server-68ab92fd/activity', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }

  try {
    const activityData = await c.req.json()
    
    const activityId = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const activity = {
      id: activityId,
      user_id: user.id,
      type: activityData.type, // 'video_upload', 'video_recording', 'analysis_complete', 'report_download', etc.
      title: activityData.title,
      description: activityData.description,
      metadata: activityData.metadata || {},
      timestamp: new Date().toISOString()
    }
    
    await kv.set(`activity:${user.id}:${activityId}`, activity)
    
    return c.json({ 
      message: 'Activity logged successfully', 
      activity 
    })
  } catch (error) {
    console.log('Activity logging error:', error)
    return c.json({ error: 'Failed to log activity' }, 500)
  }
})

// Get Recent Activities
app.get('/make-server-68ab92fd/activities', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }

  try {
    const limit = parseInt(c.req.query('limit') || '10')
    const activityKeys = await kv.getByPrefix(`activity:${user.id}:`)
    
    const activities = activityKeys
      .map(item => item.value)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
    
    return c.json({ activities })
  } catch (error) {
    console.log('Get activities error:', error)
    return c.json({ error: 'Failed to get activities' }, 500)
  }
})

// Export Analysis Report
app.get('/make-server-68ab92fd/analysis/:analysisId/export', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }

  const analysisId = c.req.param('analysisId')
  const format = c.req.query('format') || 'pdf'

  try {
    const results = await kv.get(`analysis_results:${analysisId}`)
    if (!results || results.user_id !== user.id) {
      return c.json({ error: 'Analysis results not found or unauthorized' }, 404)
    }

    const analysis = await kv.get(`analysis:${analysisId}`)
    const video = await kv.get(`video:${results.video_id}`)

    // Generate export data
    const exportData = {
      reportInfo: {
        analysisId: results.id,
        generatedDate: new Date().toLocaleDateString(),
        athlete: user.email,
        sport: results.sport,
        videoFile: video?.original_name || 'Unknown'
      },
      overallScore: results.overall_score,
      metrics: results.metrics,
      biomechanics: results.biomechanics,
      recommendations: results.recommendations,
      securityVerification: results.security_verification,
      completedAt: results.completed_at
    }

    if (format === 'json') {
      return c.json({
        message: 'Analysis export generated successfully',
        data: exportData,
        filename: `analysis_${analysisId}_${Date.now()}.json`
      })
    } else if (format === 'csv') {
      // Convert to CSV format
      const csvData = [
        ['Analysis ID', 'Sport', 'Overall Score', 'Technique Score', 'Consistency Score', 'Power Score', 'Efficiency Score', 'Completed Date'],
        [
          results.id,
          results.sport,
          results.overall_score,
          results.metrics.technique_score,
          results.metrics.consistency_score,
          results.metrics.power_score,
          results.metrics.efficiency_score,
          results.completed_at
        ]
      ].map(row => row.join(',')).join('\n')

      return c.json({
        message: 'CSV export generated successfully',
        csvData,
        filename: `analysis_${analysisId}_${Date.now()}.csv`
      })
    } else {
      // Default PDF format (JSON structure for frontend processing)
      const pdfContent = {
        title: `Performance Analysis Report - ${results.sport}`,
        ...exportData,
        footer: 'Generated by SportXcel AI Analysis System'
      }

      return c.json({
        message: 'PDF export generated successfully',
        pdfData: JSON.stringify(pdfContent, null, 2),
        filename: `analysis_report_${analysisId}_${Date.now()}.pdf`
      })
    }
  } catch (error) {
    console.log('Export analysis error:', error)
    return c.json({ error: 'Failed to export analysis' }, 500)
  }
})

// Download Video File
app.get('/make-server-68ab92fd/video/:videoId/download', async (c) => {
  const { user, error } = await verifyUser(c.req.raw)
  if (error) {
    return c.json({ error }, 401)
  }

  const videoId = c.req.param('videoId')

  try {
    const videoRecord = await kv.get(`video:${videoId}`)
    if (!videoRecord || videoRecord.user_id !== user.id) {
      return c.json({ error: 'Video not found or unauthorized' }, 404)
    }

    // Create a fresh signed URL for download
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('make-68ab92fd-videos')
      .createSignedUrl(videoRecord.file_name, 3600) // 1 hour expiry

    if (urlError) {
      console.log('Signed URL error:', urlError)
      return c.json({ error: 'Failed to generate download URL' }, 500)
    }

    return c.json({
      message: 'Download URL generated successfully',
      downloadUrl: signedUrlData.signedUrl,
      filename: videoRecord.original_name,
      fileSize: videoRecord.file_size
    })
  } catch (error) {
    console.log('Video download error:', error)
    return c.json({ error: 'Failed to generate download URL' }, 500)
  }
})

// Health check
app.get('/make-server-68ab92fd/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

export default app

Deno.serve(app.fetch)