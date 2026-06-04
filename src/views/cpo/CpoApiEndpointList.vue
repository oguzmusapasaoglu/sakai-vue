<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CpoApiEndpointService } from '@/service/CpoApiEndpointService';

const route = useRoute();
const router = useRouter();

const endpoints = ref([]);
const loading = ref(false);
const registryId = route.params.registryId;

const fallbackEndpoints = [
    { id: 'ep-1', cpoApiRegistryId: 'reg-1', operation: 'Stations', httpMethod: 'GET', path: '/stations', timeoutSeconds: 30, retryCount: 3, isActive: true },
    { id: 'ep-2', cpoApiRegistryId: 'reg-1', operation: 'Sessions', httpMethod: 'POST', path: '/sessions', timeoutSeconds: 45, retryCount: 3, isActive: true },
    { id: 'ep-3', cpoApiRegistryId: 'reg-2', operation: 'Tariffs', httpMethod: 'POST', path: '/tariffs', timeoutSeconds: 30, retryCount: 2, isActive: false }
];

onMounted(async () => {
    await loadEndpoints();
});

async function loadEndpoints() {
    loading.value = true;

    try {
        endpoints.value = await CpoApiEndpointService.getEndpoints({ cpoApiRegistryId: registryId }, { pageSize: 50, pageNumber: 1 });
    } catch (error) {
        console.error('Error loading API endpoints:', error);
        endpoints.value = fallbackEndpoints.filter((endpoint) => endpoint.cpoApiRegistryId === registryId);
    } finally {
        loading.value = false;
    }
}

function goBack() {
    router.push({ name: 'cpoIntegration' });
}

function methodSeverity(method) {
    const severities = {
        GET: 'success',
        POST: 'info',
        PUT: 'warn',
        PATCH: 'secondary',
        DELETE: 'danger'
    };

    return severities[method] ?? 'secondary';
}

function activeSeverity(value) {
    return value ? 'success' : 'secondary';
}
</script>

<template>
    <div class="card">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div class="flex items-center gap-2">
                <Button icon="pi pi-arrow-left" text rounded title="Geri Dön" @click="goBack" />
                <span class="text-xl font-semibold">API Endpoint Listesi</span>
            </div>
        </div>

        <DataTable
            :value="endpoints"
            :loading="loading"
            dataKey="id"
            paginator
            :rows="10"
            :rowsPerPageOptions="[10, 20, 50]"
            removableSort
            responsiveLayout="scroll"
            class="endpoint-table"
        >
            <template #empty>
                <div class="py-6 text-center text-gray-500">Bu API kaydı için endpoint bulunamadı.</div>
            </template>

            <Column field="operation" header="Operasyon" sortable style="width: 18%" />
            <Column field="httpMethod" header="Metot" sortable style="width: 12%">
                <template #body="{ data }">
                    <Tag :value="data.httpMethod" :severity="methodSeverity(data.httpMethod)" />
                </template>
            </Column>
            <Column field="path" header="Yol" sortable style="width: 34%" />
            <Column field="timeoutSeconds" header="Zaman Aşımı" sortable style="width: 14%" />
            <Column field="retryCount" header="Tekrar" sortable style="width: 10%" />
            <Column field="isActive" header="Durum" sortable style="width: 12%">
                <template #body="{ data }">
                    <Tag :value="data.isActive ? 'Aktif' : 'Pasif'" :severity="activeSeverity(data.isActive)" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>
.endpoint-table :deep(.p-datatable-table) {
    table-layout: fixed;
    width: 100%;
}

.endpoint-table :deep(.p-datatable-tbody > tr > td),
.endpoint-table :deep(.p-datatable-thead > tr > th) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
