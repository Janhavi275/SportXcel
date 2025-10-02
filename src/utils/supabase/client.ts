import { createClient } from '@supabase/supabase-js'
import { projectId, publicAnonKey } from './info'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
)

// API base URL for server requests
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-68ab92fd`

// Helper function to make authenticated API requests
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token || publicAnonKey}`,
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`API request failed: ${response.status} ${response.statusText}`, errorText)
    throw new Error(`API request failed: ${response.statusText}`)
  }

  return response.json()
}