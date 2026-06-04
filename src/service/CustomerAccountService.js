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

function unwrapSingle(response) {
    return response?.result?.data ?? response?.data ?? response ?? null;
}

function enumName(value, names) {
    if (typeof value === 'string') {
        return value;
    }

    return names[value] ?? '-';
}

function normalizeCustomer(customer) {
    const status = customer.status ?? customer.Status ?? customer.activationStatus ?? customer.ActivationStatus;

    return {
        id: customer.id ?? customer.Id,
        fullName: customer.fullName ?? customer.FullName ?? '-',
        email: customer.email ?? customer.Email ?? '-',
        phone: customer.phone ?? customer.Phone ?? '-',
        corporateAccountId: customer.corporateAccountId ?? customer.CorporateAccountId,
        isEmailVerified: customer.isEmailVerified ?? customer.IsEmailVerified ?? false,
        isTwoFactorEnabled: customer.isTwoFactorEnabled ?? customer.IsTwoFactorEnabled ?? false,
        preferredLanguage: customer.preferredLanguage ?? customer.PreferredLanguage ?? '-',
        status: enumName(status, { 1: 'Active', 2: 'Passive', 3: 'Suspended' }),
        isDeleted: customer.isDeleted ?? customer.IsDeleted ?? false
    };
}

export const CustomerAccountService = {
    async getCustomers(filter = {}, pagination = { pageSize: 20, pageNumber: 1 }) {
        const params = new URLSearchParams();

        appendIfPresent(params, 'FullName', filter.fullName);
        appendIfPresent(params, 'Email', filter.email);
        appendIfPresent(params, 'CorporateAccountId', filter.corporateAccountId);
        appendIfPresent(params, 'IsEmailVerified', filter.isEmailVerified);
        appendIfPresent(params, 'IsTwoFactorEnabled', filter.isTwoFactorEnabled);
        appendIfPresent(params, 'Status', filter.status);
        appendIfPresent(params, 'pageSize', pagination.pageSize);
        appendIfPresent(params, 'pageNumber', pagination.pageNumber);

        const query = params.toString();
        const response = await http.get(`/Customer/filter${query ? `?${query}` : ''}`);

        return unwrapList(response).map(normalizeCustomer);
    },

    async getCustomerById(id) {
        const response = await http.get(`/Customer/${id}`);

        return normalizeCustomer(unwrapSingle(response));
    }
};
