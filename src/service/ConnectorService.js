export const ConnectorService = {
    getConnectors: async () => {
        return [
            {
                id: 'CONN-1001',
                stationId: 'ST-1001',
                stationName: 'PlugHub Maslak',
                type: 'Type 2',
                power: '11 kW',
                status: 'Active',
                operatingHours: 24,
                lastMaintenance: '2025-05-15',
                totalSessions: 1245,
                averageSessionDuration: '45 min'
            },
            {
                id: 'CONN-1002',
                stationId: 'ST-1001',
                stationName: 'PlugHub Maslak',
                type: 'Type 2',
                power: '7 kW',
                status: 'Active',
                operatingHours: 24,
                lastMaintenance: '2025-05-20',
                totalSessions: 987,
                averageSessionDuration: '42 min'
            },
            {
                id: 'CONN-1003',
                stationId: 'ST-1002',
                stationName: 'PlugHub Kadikoy Marina',
                type: 'CCS',
                power: '50 kW',
                status: 'Maintenance',
                operatingHours: 16,
                lastMaintenance: '2025-06-02',
                totalSessions: 654,
                averageSessionDuration: '30 min'
            },
            {
                id: 'CONN-1004',
                stationId: 'ST-1002',
                stationName: 'PlugHub Kadikoy Marina',
                type: 'Type 2',
                power: '11 kW',
                status: 'Active',
                operatingHours: 24,
                lastMaintenance: '2025-05-10',
                totalSessions: 1102,
                averageSessionDuration: '48 min'
            },
            {
                id: 'CONN-1005',
                stationId: 'ST-1003',
                stationName: 'PlugHub Ankara Cankaya',
                type: 'Type 2',
                power: '7 kW',
                status: 'Passive',
                operatingHours: 0,
                lastMaintenance: '2025-04-20',
                totalSessions: 320,
                averageSessionDuration: '40 min'
            },
            {
                id: 'CONN-1006',
                stationId: 'ST-1004',
                stationName: 'PlugHub Izmir Alsancak',
                type: 'CCS',
                power: '50 kW',
                status: 'Active',
                operatingHours: 24,
                lastMaintenance: '2025-05-25',
                totalSessions: 2341,
                averageSessionDuration: '35 min'
            }
        ];
    },

    getConnectorById: async (id) => {
        const connectors = await this.getConnectors();
        return connectors.find(c => c.id === id);
    },

    createConnector: async (connector) => {
        return { ...connector, id: 'CONN-' + Date.now() };
    },

    updateConnector: async (id, connector) => {
        return { ...connector, id };
    },

    deleteConnector: async (id) => {
        return { success: true };
    }
};
