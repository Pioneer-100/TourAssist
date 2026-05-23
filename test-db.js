// Test script to verify Supabase connection
import { supabase } from '../src/lib/supabase.js';

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');

    const { data, error } = await supabase
      .from('places')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Connection failed:', error);
      return;
    }

    console.log('✅ Connection successful!');
    console.log(`Found ${data?.length || 0} places in database`);

    if (data && data.length > 0) {
      console.log('Sample place:', data[0]);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testConnection();