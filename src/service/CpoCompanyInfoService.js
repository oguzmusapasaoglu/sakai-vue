import { http } from '@/service/http';

function appendIfPresent(params, key, value) {
    if (value === null || value === undefined || value === '') {
        return;
    }

    params.append(key, value);
}

function unwrapList(response) {
    const data = response?.result?.data ?? response?.data ?? response;

    if (Array.isArray(data)) {
        return data;
    }

    return [];
}

function unwrapSingle(response) {
    return response?.result?.data ?? response?.data ?? response ?? null;
}

export const CpoCompanyInfoService = {
    async getCpos(filter = {}, pagination = { pageSize: 20, pageNumber: 1 }) {
        const params = new URLSearchParams();

        appendIfPresent(params, 'TenantId', filter.tenantId);
        appendIfPresent(params, 'CpoCode', filter.cpoCode);
        appendIfPresent(params, 'CompanyName', filter.companyName);
        appendIfPresent(params, 'OfficialEmail', filter.officialEmail);
        appendIfPresent(params, 'IsPublicVisible', filter.isPublicVisible);
        appendIfPresent(params, 'pageSize', pagination.pageSize);
        appendIfPresent(params, 'pageNumber', pagination.pageNumber);

        const query = params.toString();
        const response = await http.get(`/CpoCompanyInfo/filter${query ? `?${query}` : ''}`);

        return unwrapList(response);
    },

    async getCpoById(id) {
        const response = await http.get(`/CpoCompanyInfo/${id}`);

        return unwrapSingle(response);
    },

    async createCpo(payload) {
        const response = await http.post('/CpoCompanyInfo', payload);

        return unwrapSingle(response);
    },

    async updateCpo(id, payload) {
        const response = await http.put(`/CpoCompanyInfo/${id}`, payload);

        return unwrapSingle(response);
    }
};
