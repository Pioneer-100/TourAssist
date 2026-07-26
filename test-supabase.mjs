import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vzrpiuzpthrrpdmdendw.supabase.co';
const supabaseKey = 'sb_publishable_l93JfWfYskl1k2ioZNt_tw_g9sBee1n';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Testing Supabase connection...');

const { data, error } = await supabase
  .from('places')
  .select('*')
  .limit(3);

if (error) {
  console.error('❌ Supabase error:');
  console.error('  Code:', error.code);
  console.error('  Message:', error.message);
  console.error('  Details:', error.details);
  console.error('  Hint:', error.hint);
} else {
  console.log('✅ Connection successful!');
  console.log('Rows returned:', data.length);
  console.log('Sample:', JSON.stringify(data[0], null, 2));
}
