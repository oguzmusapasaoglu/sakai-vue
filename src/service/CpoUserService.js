export const CpoUserService = {
    getCpoUsers: async () => {
        return [
            {
                id: 'CPOUSER-1001',
                firstName: 'Ahmet',
                lastName: 'Yilmaz',
                email: 'ahmet.yilmaz@plughub.com',
                phone: '+90-532-111-2222',
                role: 'Manager',
                tenantName: 'PlugHub Istanbul',
                status: 'Active',
                joinDate: '2024-02-01',
                lastLogin: '2025-06-04 14:32'
            },
            {
                id: 'CPOUSER-1002',
                firstName: 'Fatma',
                lastName: 'Kaya',
                email: 'fatma.kaya@plughub.com',
                phone: '+90-533-333-4444',
                role: 'Operator',
                tenantName: 'PlugHub Istanbul',
                status: 'Active',
                joinDate: '2024-03-15',
                lastLogin: '2025-06-04 10:15'
            },
            {
                id: 'CPOUSER-1003',
                firstName: 'Mehmet',
                lastName: 'Demir',
                email: 'mehmet.demir@ankara.plughub.com',
                phone: '+90-534-555-6666',
                role: 'Supervisor',
                tenantName: 'PlugHub Ankara',
                status: 'Active',
                joinDate: '2024-04-01',
                lastLogin: '2025-06-04 09:20'
            },
            {
                id: 'CPOUSER-1004',
                firstName: 'Zeynep',
                lastName: 'Özdemir',
                email: 'zeynep.ozdemir@izmir.plughub.com',
                phone: '+90-535-777-8888',
                role: 'Operator',
                tenantName: 'PlugHub Izmir',
                status: 'Active',
                joinDate: '2024-05-10',
                lastLogin: '2025-06-02 16:45'
            },
            {
                id: 'CPOUSER-1005',
                firstName: 'Hasan',
                lastName: 'Çelik',
                email: 'hasan.celik@regional.com',
                phone: '+90-536-999-0000',
                role: 'Manager',
                tenantName: 'Regional Charging',
                status: 'Pending',
                joinDate: '2025-05-01',
                lastLogin: null
            },
            {
                id: 'CPOUSER-1006',
                firstName: 'Ayşe',
                lastName: 'Polat',
                email: 'ayse.polat@plughub.com',
                phone: '+90-537-222-3333',
                role: 'Operator',
                tenantName: 'PlugHub Istanbul',
                status: 'Inactive',
                joinDate: '2023-12-01',
                lastLogin: '2024-12-15 11:20'
            }
        ];
    },

    getCpoUserById: async (id) => {
        const users = await this.getCpoUsers();
        return users.find(u => u.id === id);
    },

    createCpoUser: async (user) => {
        return { ...user, id: 'CPOUSER-' + Date.now() };
    },

    updateCpoUser: async (id, user) => {
        return { ...user, id };
    },

    deleteCpoUser: async (id) => {
        return { success: true };
    }
};
