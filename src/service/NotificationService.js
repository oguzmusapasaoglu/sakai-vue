export const NotificationService = {
    getNotifications: async () => {
        return [
            {
                id: 'NOTIF-1001',
                title: 'Connector Maintenance Required',
                message: 'Connector CONN-1003 at PlugHub Kadikoy requires scheduled maintenance.',
                type: 'Warning',
                severity: 'warn',
                sender: 'System',
                recipient: 'Station Manager',
                date: '2025-06-04 10:30',
                read: false
            },
            {
                id: 'NOTIF-1002',
                title: 'New Station Registered',
                message: 'New charging station "PlugHub Bursa Nilüfer" has been successfully registered.',
                type: 'Info',
                severity: 'info',
                sender: 'System',
                recipient: 'Admin',
                date: '2025-06-04 09:15',
                read: true
            },
            {
                id: 'NOTIF-1003',
                title: 'Payment Received',
                message: 'Payment of ₺15,240 received from Corporate Account "Acme Corp".',
                type: 'Success',
                severity: 'success',
                sender: 'Payment System',
                recipient: 'Accounting',
                date: '2025-06-04 08:45',
                read: true
            },
            {
                id: 'NOTIF-1004',
                title: 'High Usage Alert',
                message: 'Station PlugHub Izmir has exceeded 80% of daily capacity.',
                type: 'Alert',
                severity: 'danger',
                sender: 'System',
                recipient: 'Operations',
                date: '2025-06-04 07:20',
                read: false
            },
            {
                id: 'NOTIF-1005',
                title: 'User Login Failure',
                message: 'Multiple failed login attempts detected for user account.',
                type: 'Security',
                severity: 'danger',
                sender: 'Security System',
                recipient: 'Admin',
                date: '2025-06-03 22:30',
                read: true
            },
            {
                id: 'NOTIF-1006',
                title: 'System Update Available',
                message: 'New system update v2.1.0 is available. Schedule maintenance window.',
                type: 'Update',
                severity: 'info',
                sender: 'System',
                recipient: 'IT Admin',
                date: '2025-06-03 15:00',
                read: true
            }
        ];
    },

    getNotificationById: async (id) => {
        const notifications = await this.getNotifications();
        return notifications.find(n => n.id === id);
    },

    markAsRead: async (id) => {
        return { success: true };
    },

    deleteNotification: async (id) => {
        return { success: true };
    },

    createNotification: async (notification) => {
        return { ...notification, id: 'NOTIF-' + Date.now() };
    }
};
