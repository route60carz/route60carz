import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tjiogecfeocxffrwuxpi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqaW9nZWNmZW9jeGZmcnd1eHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NDAwNzUsImV4cCI6MjA4NzMxNjA3NX0.3iWEZJQEcMA5fQRTTIvX56cP0kwdYT_AQQzD7Poqg5o';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
    const { data, error } = await supabase.from('cars').select('*');
    if (error) {
        console.error('Error fetching cars:', error);
    } else {
        console.log('Successfully fetched cars:', data?.length ?? 0);
    }
}

testFetch();
