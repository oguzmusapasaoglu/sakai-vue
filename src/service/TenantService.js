export const TenantService = {
    getTenants: async () => {
        return [
            {
                id: 'TENANT-1001',
                name: 'PlugHub Istanbul',
                companyName: 'PlugHub Elektrik A.Ş.',
                taxId: '1234567890',
                registrationNumber: 'TR001',
                email: 'istanbul@plughub.com',
                phone: '+90-212-123-4567',
                status: 'Active',
                createdDate: '2024-01-15',
                totalStations: 5,
                totalConnectors: 12
            },
            {
                id: 'TENANT-1002',
                name: 'PlugHub Ankara',
                companyName: 'PlugHub Ankara Ltd.',
                taxId: '0987654321',
                registrationNumber: 'TR002',
                email: 'ankara@plughub.com',
                phone: '+90-312-456-7890',
                status: 'Active',
                createdDate: '2024-02-20',
                totalStations: 3,
                totalConnectors: 8
            },
            {
                id: 'TENANT-1003',
                name: 'PlugHub Izmir',
                companyName: 'PlugHub Izmir İnşaat',
                taxId: '5555555555',
                registrationNumber: 'TR003',
                email: 'izmir@plughub.com',
                phone: '+90-232-789-0123',
                status: 'Active',
                createdDate: '2024-03-10',
                totalStations: 4,
                totalConnectors: 10
            },
            {
                id: 'TENANT-1004',
                name: 'Regional Charging',
                companyName: 'Regional Elektrik Hizmetleri',
                taxId: '9999999999',
                registrationNumber: 'TR004',
                email: 'info@regional.com',
                phone: '+90-216-555-6789',
                status: 'Pending',
                createdDate: '2025-05-01',
                totalStations: 2,
                totalConnectors: 4
            },
            {
                id: 'TENANT-1005',
                name: 'Green Energy Solutions',
                companyName: 'Yeşil Enerji Çözümleri Ltd.',
                taxId: '3333333333',
                registrationNumber: 'TR005',
                email: 'support@greenergy.com',
                phone: '+90-262-111-2222',
                status: 'Inactive',
                createdDate: '2023-11-05',
                totalStations: 1,
                totalConnectors: 2
            }
        ];
    },

    getTenantById: async (id) => {
        const tenants = await this.getTenants();
        return tenants.find(t => t.id === id);
    },

    createTenant: async (tenant) => {
        return { ...tenant, id: 'TENANT-' + Date.now() };
    },

    updateTenant: async (id, tenant) => {
        return { ...tenant, id };
    },

    deleteTenant: async (id) => {
        return { success: true };
    }
};
