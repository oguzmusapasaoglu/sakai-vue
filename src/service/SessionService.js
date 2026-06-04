import { http } from '@/service/http';

function unwrapList(response) {
    const data = response?.result?.data ?? response?.data ?? response;

    return Array.isArray(data) ? data : [];
}

function appendIfPresent(params, key, value) {
    if (value === null || value === undefined || value === '') {
        return;
    }

    params.append(key, value);
}

function enumName(value, names) {
    if (typeof value === 'string') {
        return value;
    }

    return names[value] ?? '-';
}

function formatDate(value) {
    if (!value) {
        return null;
    }

    return new Date(value).toLocaleString('tr-TR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatCurrency(amount, currency) {
    if (amount === null || amount === undefined) {
        return '-';
    }

    return `${Number(amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency ?? ''}`.trim();
}

function normalizeSession(session) {
    const start = session.startDateTime ?? session.StartDateTime;
    const end = session.endDateTime ?? session.EndDateTime;
    const totalKwh = session.totalKwh ?? session.TotalKwh;
    const totalCost = session.totalCost ?? session.TotalCost;
    const currency = session.currency ?? session.Currency;
    const sessionStatus = session.sessionStatus ?? session.SessionStatus;
    const paymentStatus = session.paymentStatus ?? session.PaymentStatus;

    return {
        id: session.id ?? session.Id,
        connectorId: session.connectorId ?? session.ConnectorId,
        stationId: session.stationId ?? session.StationId,
        stationName: session.stationName ?? session.StationName ?? session.stationId ?? session.StationId,
        userEmail: session.customerEmail ?? session.CustomerEmail ?? '-',
        customerEmail: session.customerEmail ?? session.CustomerEmail ?? '-',
        vehiclePlate: session.vehiclePlate ?? session.VehiclePlate ?? '-',
        startTime: formatDate(start),
        endTime: formatDate(end),
        duration: end ? '-' : 'Devam ediyor',
        energyConsumed: totalKwh === null || totalKwh === undefined ? '-' : `${totalKwh} kWh`,
        cost: formatCurrency(totalCost, currency),
        status: enumName(sessionStatus, { 1: 'Ongoing', 2: 'Completed', 3: 'Error', 4: 'Cancelled' }),
        paymentStatus: enumName(paymentStatus, { 1: 'Pending', 2: 'Success', 3: 'Failed', 4: 'Refunded', 5: 'Cancelled' })
    };
}

const mockSessions = [
    {
        id: 'SESSION-1001',
        connectorId: 'CONN-1001',
        stationName: 'PlugHub Maslak',
        userEmail: 'user1@example.com',
        vehiclePlate: '34-ABC-1234',
        startTime: '2025-06-04 08:30',
        endTime: '2025-06-04 09:15',
        duration: '45 min',
        energyConsumed: '8.2 kWh',
        cost: '65,60 TRY',
        status: 'Completed',
        paymentStatus: 'Success'
    },
    {
        id: 'SESSION-1002',
        connectorId: 'CONN-1002',
        stationName: 'PlugHub Maslak',
        userEmail: 'user2@example.com',
        vehiclePlate: '34-XYZ-5678',
        startTime: '2025-06-04 09:45',
        endTime: '2025-06-04 10:20',
        duration: '35 min',
        energyConsumed: '6.5 kWh',
        cost: '52,00 TRY',
        status: 'Completed',
        paymentStatus: 'Pending'
    },
    {
        id: 'SESSION-1003',
        connectorId: 'CONN-1004',
        stationName: 'PlugHub Kadikoy Marina',
        userEmail: 'user3@example.com',
        vehiclePlate: '34-DEF-9012',
        startTime: '2025-06-04 10:00',
        endTime: null,
        duration: 'Devam ediyor',
        energyConsumed: '4.7 kWh',
        cost: '37,60 TRY',
        status: 'Ongoing',
        paymentStatus: 'Failed'
    }
];

export const SessionService = {
    async getSessions(filter = {}, pagination = { pageSize: 20, pageNumber: 1 }) {
        const params = new URLSearchParams();

        appendIfPresent(params, 'TenantId', filter.tenantId);
        appendIfPresent(params, 'StationId', filter.stationId);
        appendIfPresent(params, 'CustomerId', filter.customerId);
        appendIfPresent(params, 'SessionStatus', filter.sessionStatus);
        appendIfPresent(params, 'pageSize', pagination.pageSize);
        appendIfPresent(params, 'pageNumber', pagination.pageNumber);

        try {
            const query = params.toString();
            const response = await http.get(`/ChargingSession/filter${query ? `?${query}` : ''}`);

            return unwrapList(response).map(normalizeSession);
        } catch (error) {
            console.warn('ChargingSession endpoint kullanılamadı, demo veri gösteriliyor.', error);
            return mockSessions;
        }
    }
};
