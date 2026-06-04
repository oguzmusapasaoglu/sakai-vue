import { http } from '@/service/http';

function appendIfPresent(params, key, value) {
    if (value === null || value === undefined || value === '') {
        return;
    }

    params.append(key, value);
}

function unwrapList(response) {
    const data = response?.result?.data ?? response?.data ?? response;

    return Array.isArray(data) ? data : [];
}

function enumName(value, names) {
    if (typeof value === 'string') {
        return value;
    }

    return names[value] ?? '-';
}

function formatDate(value) {
    if (!value) {
        return '-';
    }

    return new Date(value).toLocaleDateString('tr-TR');
}

function formatPrice(value, currency) {
    if (value === null || value === undefined) {
        return '-';
    }

    return `${Number(value).toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} ${currency ?? ''}`.trim();
}

function normalizeTariff(tariff) {
    const powerType = tariff.powerType ?? tariff.PowerType;
    const activationStatus = tariff.activationStatus ?? tariff.ActivationStatus;
    const validFrom = tariff.validFrom ?? tariff.ValidFrom;
    const validTo = tariff.validTo ?? tariff.ValidTo;
    const currency = tariff.currency ?? tariff.Currency;

    return {
        id: tariff.id ?? tariff.Id,
        cpoName: tariff.cpoName ?? tariff.CpoName ?? '-',
        stationGroupId: tariff.stationGroupId ?? tariff.StationGroupId,
        powerType: enumName(powerType, { 1: 'AC', 2: 'DC' }),
        pricePerKwh: formatPrice(tariff.pricePerKwh ?? tariff.PricePerKwh, currency),
        pricePerMinute: formatPrice(tariff.pricePerMinute ?? tariff.PricePerMinute, currency),
        startFee: formatPrice(tariff.startFee ?? tariff.StartFee, currency),
        currency,
        validFrom: formatDate(validFrom),
        validTo: formatDate(validTo),
        externalPolicyId: tariff.externalPolicyId ?? tariff.ExternalPolicyId ?? '-',
        lastSyncedAt: formatDate(tariff.lastSyncedAt ?? tariff.LastSyncedAt),
        status: enumName(activationStatus, { 1: 'Active', 2: 'Passive', 3: 'Suspended' })
    };
}

export const TariffService = {
    async getTariffs(filter = {}, pagination = { pageSize: 20, pageNumber: 1 }) {
        const params = new URLSearchParams();

        appendIfPresent(params, 'TenantId', filter.tenantId);
        appendIfPresent(params, 'StationGroupId', filter.stationGroupId);
        appendIfPresent(params, 'PowerType', filter.powerType);
        appendIfPresent(params, 'Currency', filter.currency);
        appendIfPresent(params, 'ActiveAt', filter.activeAt);
        appendIfPresent(params, 'pageSize', pagination.pageSize);
        appendIfPresent(params, 'pageNumber', pagination.pageNumber);

        const query = params.toString();
        const response = await http.get(`/PricePolicy/filter${query ? `?${query}` : ''}`);

        return unwrapList(response).map(normalizeTariff);
    }
};
