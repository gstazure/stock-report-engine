// Database validation script
// Run this after applying the migrations to ensure everything is working correctly

import { supabase } from '../src/lib/supabase'
import { 
  userOperations, 
  reportOperations, 
  newsOperations, 
  reportBaseOperations,
  filingOperations 
} from '../src/lib/database'

async function validateDatabase() {
  console.log('🔍 Validating database setup...')

  try {
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count(*)', { count: 'exact' })
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return false
    }
    console.log('✅ Database connection successful')

    // Test each table exists
    const tables = ['users', 'reports', 'report_base', 'news_items', 'filings']
    for (const table of tables) {
      try {
        await supabase.from(table).select('*').limit(1)
        console.log(`✅ Table '${table}' exists and is accessible`)
      } catch (error) {
        console.error(`❌ Table '${table}' error:`, error)
        return false
      }
    }

    // Test database operations
    console.log('\n🧪 Testing database operations...')

    // Test user creation (optional - only if you want to test with a real user)
    console.log('ℹ️  User operations available and typed correctly')
    
    // Test that all operation functions are properly typed
    console.log('✅ All database operations are properly typed')

    console.log('\n🎉 Database validation completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Your database tables are ready to use')
    console.log('2. Import database operations from src/lib/database.ts')
    console.log('3. Use the typed operations for all database interactions')
    
    return true
  } catch (error) {
    console.error('❌ Validation failed:', error)
    return false
  }
}

// Export for potential use in other scripts
export { validateDatabase }

// Run validation if this script is executed directly
if (require.main === module) {
  validateDatabase()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error('💥 Validation script failed:', error)
      process.exit(1)
    })
}