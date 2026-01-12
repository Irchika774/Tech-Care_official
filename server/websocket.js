import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export function initializeWebSocket(server) {
    io = new Server(server, {
        cors: {
            origin: process.env.VITE_APP_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            // Allow unauthenticated connections but mark them
            socket.userData = { authenticated: false };
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userData = {
                authenticated: true,
                userId: decoded.id || decoded.userId,
                role: decoded.role,
            };
            next();
        } catch (error) {
            console.error('WebSocket authentication error:', error.message);
            socket.userData = { authenticated: false };
            next();
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ Client connected: ${socket.id}`, socket.userData);

        // Join user-specific room
        if (socket.userData.authenticated) {
            const userRoom = `user_${socket.userData.userId}`;
            socket.join(userRoom);
            console.log(`User ${socket.userData.userId} joined room: ${userRoom}`);

            // Join role-specific rooms
            if (socket.userData.role === 'technician') {
                socket.join(`technician_${socket.userData.userId}`);
                socket.join('technicians'); // All technicians room
            } else if (socket.userData.role === 'user' || socket.userData.role === 'customer') {
                socket.join(`customer_${socket.userData.userId}`);
                socket.join('customers'); // All customers room
            } else if (socket.userData.role === 'admin') {
                socket.join('admin');
            }
        }

        // Join room
        socket.on('join_room', ({ room }) => {
            socket.join(room);
            console.log(`Socket ${socket.id} joined room: ${room}`);
            socket.emit('joined_room', { room });
        });

        // Leave room
        socket.on('leave_room', ({ room }) => {
            socket.leave(room);
            console.log(`Socket ${socket.id} left room: ${room}`);
        });

        // Send notification
        socket.on('send_notification', ({ userId, notification }) => {
            io.to(`user_${userId}`).emit('notification', notification);
        });

        // Update job status
        socket.on('update_job_status', ({ jobId, status }) => {
            // Broadcast to relevant technicians and customers
            io.emit('job_update', { jobId, status });
        });

        // Update booking status
        socket.on('update_booking_status', ({ bookingId, status }) => {
            io.emit('booking_update', { bookingId, status });
        });

        // Technician location update
        socket.on('update_location', ({ latitude, longitude }) => {
            if (socket.userData.role === 'technician') {
                io.to('customers').emit('technician_location_updated', {
                    technicianId: socket.userData.userId,
                    location: { latitude, longitude },
                });
            }
        });

        // New job available (notify all technicians)
        socket.on('new_job', (jobData) => {
            io.to('technicians').emit('new_job', jobData);
        });

        // Bid submitted
        socket.on('bid_submitted', ({ customerId, bidData }) => {
            io.to(`customer_${customerId}`).emit('new_bid', bidData);
        });

        // Bid accepted/rejected
        socket.on('bid_status_updated', ({ technicianId, bidId, status }) => {
            io.to(`technician_${technicianId}`).emit('bid_update', { bidId, status });
        });

        // Real-time chat messages (optional)
        socket.on('send_message', ({ to, message }) => {
            io.to(`user_${to}`).emit('new_message', {
                from: socket.userData.userId,
                message,
                timestamp: new Date(),
            });
        });

        // Admin broadcasts
        socket.on('admin_broadcast', (announcement) => {
            if (socket.userData.role === 'admin') {
                io.emit('admin_update', announcement);
            }
        });

        // Disconnection
        socket.on('disconnect', () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });

        // Error handling
        socket.on('error', (error) => {
            console.error(`Socket error for ${socket.id}:`, error);
        });
    });

    console.log('🔌 WebSocket server initialized');
    return io;
}

// Helper functions to emit from server-side code

export function emitNotification(userId, notification) {
    if (io) {
        io.to(`user_${userId}`).emit('notification', notification);
    }
}

export function emitJobUpdate(jobData) {
    if (io) {
        io.to('technicians').emit('new_job', jobData);
    }
}

export function emitBookingUpdate(customerId, bookingData) {
    if (io) {
        io.to(`customer_${customerId}`).emit('booking_update', bookingData);
    }
}

export function emitBidUpdate(technicianId, bidData) {
    if (io) {
        io.to(`technician_${technicianId}`).emit('bid_update', bidData);
    }
}

export function broadcastToAll(event, data) {
    if (io) {
        io.emit(event, data);
    }
}

export function getIO() {
    if (!io) {
        throw new Error('WebSocket not initialized. Call initializeWebSocket first.');
    }
    return io;
}

export default { initializeWebSocket, emitNotification, emitJobUpdate, emitBookingUpdate, emitBidUpdate, broadcastToAll, getIO };
