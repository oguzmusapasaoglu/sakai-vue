export const SystemUserService = {
    getSystemUsers: async () => {
        return [
            {
                id: 'SYSUSER-1001',
                firstName: 'Ali',
                lastName: 'Admin',
                email: 'admin@plughub.com',
                phone: '+90-500-111-2222',
                role: 'System Admin',
                department: 'Administration',
                status: 'Active',
                joinDate: '2024-01-01',
                lastLogin: '2025-06-04 15:45'
            },
            {
                id: 'SYSUSER-1002',
                firstName: 'Elif',
                lastName: 'Müdür',
                email: 'elif.mudur@plughub.com',
                phone: '+90-501-333-4444',
                role: 'Manager',
                department: 'Operations',
                status: 'Active',
                joinDate: '2024-02-01',
                lastLogin: '2025-06-04 14:20'
            },
            {
                id: 'SYSUSER-1003',
                firstName: 'Can',
                lastName: 'Developer',
                email: 'can.dev@plughub.com',
                phone: '+90-502-555-6666',
                role: 'Developer',
                department: 'IT',
                status: 'Active',
                joinDate: '2024-03-15',
                lastLogin: '2025-06-04 10:30'
            },
            {
                id: 'SYSUSER-1004',
                firstName: 'Selin',
                lastName: 'Analist',
                email: 'selin.analyst@plughub.com',
                phone: '+90-503-777-8888',
                role: 'Analyst',
                department: 'Analytics',
                status: 'Active',
                joinDate: '2024-04-20',
                lastLogin: '2025-06-03 16:15'
            },
            {
                id: 'SYSUSER-1005',
                firstName: 'Murat',
                lastName: 'Teknik',
                email: 'murat.teknik@plughub.com',
                phone: '+90-504-999-0000',
                role: 'Technician',
                department: 'Support',
                status: 'Inactive',
                joinDate: '2024-05-01',
                lastLogin: '2025-05-20 09:00'
            },
            {
                id: 'SYSUSER-1006',
                firstName: 'Didem',
                lastName: 'Muhasebeci',
                email: 'didem.muhase@plughub.com',
                phone: '+90-505-222-3333',
                role: 'Accountant',
                department: 'Finance',
                status: 'Active',
                joinDate: '2024-06-01',
                lastLogin: '2025-06-04 09:15'
            }
        ];
    },

    getSystemUserById: async (id) => {
        const users = await this.getSystemUsers();
        return users.find(u => u.id === id);
    },

    createSystemUser: async (user) => {
        return { ...user, id: 'SYSUSER-' + Date.now() };
    },

    updateSystemUser: async (id, user) => {
        return { ...user, id };
    },

    deleteSystemUser: async (id) => {
        return { success: true };
    }
};
