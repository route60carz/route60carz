const { createServer } = require('http');
const https = require('https');

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqaW9nZWNmZW9jeGZmcnd1eHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NDAwNzUsImV4cCI6MjA4NzMxNjA3NX0.3iWEZJQEcMA5fQRTTIvX56cP0kwdYT_AQQzD7Poqg5o';

// Mock data to return if actual fetch fails
const defaultCars = [
    { id: '1', make: 'BMW', model: 'X5', year: 2022, price: 6500000, city: 'Theni', fuel_type: 'Diesel', image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop&q=60', status: 'available', created_at: new Date().toISOString() },
    { id: '2', make: 'Mercedes-Benz', model: 'C-Class', year: 2021, price: 4500000, city: 'Madurai', fuel_type: 'Petrol', image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=60', status: 'available', created_at: new Date().toISOString() },
    { id: '3', make: 'Audi', model: 'Q7', year: 2023, price: 8500000, city: 'Chennai', fuel_type: 'Diesel', image_url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0a03?w=800&auto=format&fit=crop&q=60', status: 'available', created_at: new Date().toISOString() }
];

const defaultProfiles = [
    { id: 'admin-id', email: 'admin@route60.com', full_name: 'Admin User', role: 'admin', created_at: new Date().toISOString() }
];

const defaultInquiries = [];

const server = createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, apikey, prefer, Range');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, 'http://localhost:1111');
    console.log(`[Mock Proxy] ${req.method} ${url.pathname}`);

    res.setHeader('Content-Type', 'application/json');

    // Helper to send mock response
    const sendMock = (data) => {
        res.writeHead(200);
        res.end(JSON.stringify(data));
    };

    // cars
    if (url.pathname.includes('/rest/v1/cars')) {
        return sendMock(defaultCars);
    }

    // rpc/get_all_profiles
    if (url.pathname.includes('/rest/v1/rpc/get_all_profiles') || url.pathname.includes('/rest/v1/profiles')) {
        return sendMock(defaultProfiles);
    }

    // rpc/get_all_inquiries
    if (url.pathname.includes('/rest/v1/rpc/get_all_inquiries') || url.pathname.includes('/rest/v1/contact_inquiries')) {
        return sendMock(defaultInquiries);
    }

    // default empty array for anything else
    return sendMock([]);
});

server.listen(1111, () => {
    console.log('Mock Supabase proxy running on http://127.0.0.1:1111');
});
