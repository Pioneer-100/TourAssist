const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mnqpldyfndkcyynbcylj.supabase.co';
const supabaseKey = 'sb_publishable_SyH-u-wD_ojLBiE70fcgpA_jwXweC43';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Connecting to Supabase...");
  try {
    const { data, error } = await supabase.from('profiles').select('*').limit(5);
    if (error) {
      console.error("Error querying profiles:", error);
    } else {
      console.log("Profiles queried successfully:", data);
    }
  } catch (err) {
    console.error("Exception querying profiles:", err);
  }
}

test();
