<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { CpoCompanyInfoService } from '@/service/CpoCompanyInfoService';
import { CpoApiRegistryService } from '@/service/CpoApiRegistryService';

const router = useRouter();

const cpos = ref([]);
const registries = ref([]);
const selectedCpo = ref(null);
const loadingCpos = ref(false);
const loadingRegistries = ref(false);

const fallbackCpos = [
    { id: '1', tenantId: '1', cpoCode: 'ABC', companyName: 'ABC Elektrik Şarj', officialEmail: 'info@abc-charge.com' },
    { id: '2', tenantId: '2', cpoCode: 'HIZLI', companyName: 'Hızlı Şarj Ltd.', officialEmail: 'contact@hizli-sarja.com' },
    { id: '3', tenantId: '3', cpoCode: 'YESIL', companyName: 'Yeşil Enerji Ağı', officialEmail: 'support@yesilenerji.com' }
];

const fallbackRegistries = {
    '1': [
        { id: 'reg-1', version: 'v1.0', baseUrl: 'https://api.abc-charge.com/v1', isPrimary: true, isActive: true, description: 'Ana ABC entegrasyonu' },
        { id: 'reg-2', version: 'v2.0', baseUrl: 'https://api.abc-charge.com/v2', isPrimary: false, isActive: false, description: 'Test sürümü' }
    ],
    '2': [
        { id: 'reg-3', version: 'v1.0', baseUrl: 'https://api.hizli-sarja.com', isPrimary: true, isActive: true, description: 'Hızlı Şarj API' }
    ],
    '3': [
        { id: 'reg-4', version: 'v1.0', baseUrl: 'https://api.yesilenerji.com', isPrimary: true, isActive: true, description: 'Yeşil Enerji API' }
    ]
};

const selectedTenantId = computed(() => selectedCpo.value?.tenantId ?? selectedCpo.value?.id);

onMounted(async () => {
    await loadCpos();
});

watch(selectedCpo, async () => {
    await loadRegistries();
});

async function loadCpos() {
    loadingCpos.value = true;

    try {
        cpos.value = await CpoCompanyInfoService.getCpos({}, { pageSize: 100, pageNumber: 1 });
    } catch (error) {
        console.error('Error loading CPO list:', error);
        cpos.value = fallbackCpos;
    } finally {
        loadingCpos.value = false;
    }
}

async function loadRegistries() {
    registries.value = [];

    if (!selectedCpo.value) {
        return;
    }

    loadingRegistries.value = true;

    try {
        registries.value = await CpoApiRegistryService.getRegistries({ tenantId: selectedTenantId.value }, { pageSize: 50, pageNumber: 1 });
    } catch (error) {
        console.error('Error loading API registries:', error);
        registries.value = fallbackRegistries[selectedTenantId.value] ?? [];
    } finally {
        loadingRegistries.value = false;
    }
}

function boolLabel(value) {
    return value ? 'Evet' : 'Hayır';
}

function activeSeverity(value) {
    return value ? 'success' : 'secondary';
}

function openEndpoints(registry) {
    router.push({
        name: 'cpoApiEndpoints',
        params: { registryId: registry.id }
    });
}
</script>

<template>
    <div class="integration-page">
        <div class="card">
            <div class="flex flex-col xl:flex-row xl:items-end gap-4">
                <div class="flex-1">
                    <div class="text-xl font-semibold mb-4">CPO Entegrasyon</div>
                    <label class="block text-sm font-medium mb-2" for="cpoSelect">CPO Seçimi</label>
                    <Select
                        id="cpoSelect"
                        v-model="selectedCpo"
                        :options="cpos"
                        :loading="loadingCpos"
                        optionLabel="companyName"
                        placeholder="CPO seçiniz"
                        class="w-full"
                        filter
                    >
                        <template #option="{ option }">
                            <div class="flex flex-col">
                                <span class="font-medium">{{ option.companyName }}</span>
                                <small class="text-gray-500">{{ option.cpoCode }} - {{ option.officialEmail }}</small>
                            </div>
                        </template>
                        <template #value="{ value, placeholder }">
                            <span v-if="value">{{ value.companyName }}</span>
                            <span v-else>{{ placeholder }}</span>
                        </template>
                    </Select>
                </div>

                <div v-if="selectedCpo" class="selected-summary">
                    <div>
                        <span>CPO Kodu</span>
                        <strong>{{ selectedCpo.cpoCode }}</strong>
                    </div>
                    <div>
                        <span>E-posta</span>
                        <strong>{{ selectedCpo.officialEmail }}</strong>
                    </div>
                </div>
            </div>
        </div>

        <div class="card mt-4">
            <DataTable
                :value="registries"
                :loading="loadingRegistries"
                dataKey="id"
                paginator
                :rows="10"
                :rowsPerPageOptions="[10, 20, 50]"
                removableSort
                responsiveLayout="scroll"
                class="registry-table"
            >
                <template #header>
                    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <span class="text-xl font-semibold">API Kayıt Bilgileri</span>
                        <Tag v-if="selectedCpo" :value="selectedCpo.companyName" severity="info" />
                    </div>
                </template>

                <template #empty>
                    <div class="py-6 text-center text-gray-500">
                        {{ selectedCpo ? 'Seçilen CPO için API kayıt bilgisi bulunamadı.' : 'API kayıt bilgileri için CPO seçiniz.' }}
                    </div>
                </template>

                <Column field="version" header="Versiyon" sortable style="width: 12%" />
                <Column field="baseUrl" header="Base URL" sortable style="width: 38%" />
                <Column field="description" header="Açıklama" sortable style="width: 22%" />
                <Column field="isPrimary" header="Birincil" sortable style="width: 10%">
                    <template #body="{ data }">{{ boolLabel(data.isPrimary) }}</template>
                </Column>
                <Column field="isActive" header="Durum" sortable style="width: 10%">
                    <template #body="{ data }">
                        <Tag :value="data.isActive ? 'Aktif' : 'Pasif'" :severity="activeSeverity(data.isActive)" />
                    </template>
                </Column>
                <Column header="İşlem" style="width: 8%">
                    <template #body="{ data }">
                        <Button icon="pi pi-list" text rounded title="Endpointler" @click="openEndpoints(data)" />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<style scoped>
.integration-page {
    width: 100%;
}

.selected-summary {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
    min-width: min(420px, 100%);
}

.selected-summary > div {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.selected-summary span {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
}

.selected-summary strong {
    font-weight: 600;
    overflow-wrap: anywhere;
}

.registry-table :deep(.p-datatable-table) {
    table-layout: fixed;
    width: 100%;
}

.registry-table :deep(.p-datatable-tbody > tr > td),
.registry-table :deep(.p-datatable-thead > tr > th) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
