<script setup>
import { computed, onMounted, ref } from 'vue';
import { SessionService } from '@/service/SessionService';

const sessions = ref([]);
const loading = ref(false);
const selectedCpo = ref(null);
const selectedGroup = ref(null);
const stationSearch = ref('');
const detailDialogVisible = ref(false);
const selectedSession = ref(null);

const cpos = [
    { id: 'cpo-1', name: 'ABC Elektrik Şarj' },
    { id: 'cpo-2', name: 'Hızlı Şarj Ltd.' },
    { id: 'cpo-3', name: 'Yeşil Enerji Ağı' }
];

const stationGroups = [
    { id: 'grp-1', cpoId: 'cpo-1', name: 'İstanbul Avrupa Grubu' },
    { id: 'grp-2', cpoId: 'cpo-1', name: 'İstanbul Anadolu Grubu' },
    { id: 'grp-3', cpoId: 'cpo-2', name: 'Ege Bölge Grubu' },
    { id: 'grp-4', cpoId: 'cpo-3', name: 'Ankara Merkez Grubu' }
];

const stationMeta = {
    'PlugHub Maslak': { cpoId: 'cpo-1', groupId: 'grp-1' },
    'PlugHub Kadikoy Marina': { cpoId: 'cpo-1', groupId: 'grp-2' },
    'PlugHub Izmir Alsancak': { cpoId: 'cpo-2', groupId: 'grp-3' },
    'PlugHub Ankara Cankaya': { cpoId: 'cpo-3', groupId: 'grp-4' }
};

const availableGroups = computed(() => {
    if (!selectedCpo.value) {
        return stationGroups;
    }

    return stationGroups.filter((group) => group.cpoId === selectedCpo.value.id);
});

const filteredSessions = computed(() => {
    const search = stationSearch.value.trim().toLowerCase();

    return sessions.value.filter((session) => {
        const meta = stationMeta[session.stationName] ?? {};
        const matchesCpo = !selectedCpo.value || meta.cpoId === selectedCpo.value.id;
        const matchesGroup = !selectedGroup.value || meta.groupId === selectedGroup.value.id;
        const matchesStation = !search || session.stationName.toLowerCase().includes(search);

        return matchesCpo && matchesGroup && matchesStation;
    });
});

onMounted(async () => {
    await loadSessions();
});

async function loadSessions() {
    loading.value = true;

    try {
        sessions.value = await SessionService.getSessions();
    } catch (error) {
        console.error('Error loading sessions:', error);
    } finally {
        loading.value = false;
    }
}

function clearFilters() {
    selectedCpo.value = null;
    selectedGroup.value = null;
    stationSearch.value = '';
}

function onCpoChange() {
    selectedGroup.value = null;
}

function viewSession(session) {
    selectedSession.value = session;
    detailDialogVisible.value = true;
}

function getStatusSeverity(status) {
    return status === 'Ongoing' || status === 'Active' ? 'success' : status === 'Completed' ? 'info' : 'danger';
}

function getPaymentSeverity(status) {
    const severities = {
        Success: 'success',
        Pending: 'warn',
        Failed: 'danger',
        Refunded: 'info',
        Cancelled: 'secondary'
    };

    return severities[status] ?? 'secondary';
}

function formatValue(value) {
    return value === null || value === undefined || value === '' ? '-' : value;
}
</script>

<template>
    <div class="card">
        <div class="flex flex-col gap-4 mb-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <span class="text-xl font-semibold">Şarj Oturumları</span>
                <Button label="Yenile" icon="pi pi-refresh" text @click="loadSessions" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2" for="cpoFilter">CPO</label>
                    <Select id="cpoFilter" v-model="selectedCpo" :options="cpos" optionLabel="name" placeholder="CPO seçiniz" class="w-full" showClear @change="onCpoChange" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="groupFilter">İstasyon Grubu</label>
                    <Select id="groupFilter" v-model="selectedGroup" :options="availableGroups" optionLabel="name" placeholder="Grup seçiniz" class="w-full" showClear />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2" for="stationSearch">İstasyon Arama</label>
                    <InputText id="stationSearch" v-model="stationSearch" class="w-full" placeholder="İstasyon adı" />
                </div>
                <div class="flex items-end">
                    <Button label="Temizle" icon="pi pi-times" severity="secondary" text class="w-full md:w-auto" @click="clearFilters" />
                </div>
            </div>
        </div>

        <DataTable :value="filteredSessions" :loading="loading" paginator :rows="20" dataKey="id" removableSort responsiveLayout="scroll" class="session-table">
            <Column field="id" header="Oturum ID" sortable style="width: 12%" />
            <Column field="stationName" header="İstasyon" sortable style="width: 18%" />
            <Column field="userEmail" header="Müşteri E-posta" sortable style="width: 18%" />
            <Column field="startTime" header="Başlangıç" sortable style="width: 13%" />
            <Column field="energyConsumed" header="Enerji" sortable style="width: 8%" />
            <Column field="cost" header="Tutar" sortable style="width: 8%" />
            <Column field="paymentStatus" header="Ödeme" sortable style="width: 9%">
                <template #body="{ data }">
                    <Tag :value="data.paymentStatus" :severity="getPaymentSeverity(data.paymentStatus)" />
                </template>
            </Column>
            <Column field="status" header="Durum" sortable style="width: 8%">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
            <Column header="Detay" style="width: 6%">
                <template #body="{ data }">
                    <Button icon="pi pi-eye" text rounded title="Detay" @click="viewSession(data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="detailDialogVisible" modal header="Şarj Oturumu Detayı" :style="{ width: 'min(760px, 95vw)' }">
            <div v-if="selectedSession" class="detail-grid">
                <div><span>Oturum ID</span><strong>{{ formatValue(selectedSession.id) }}</strong></div>
                <div><span>Konnektör ID</span><strong>{{ formatValue(selectedSession.connectorId) }}</strong></div>
                <div><span>İstasyon</span><strong>{{ formatValue(selectedSession.stationName) }}</strong></div>
                <div><span>Kullanıcı</span><strong>{{ formatValue(selectedSession.userEmail) }}</strong></div>
                <div><span>Ödeme Durumu</span><Tag :value="selectedSession.paymentStatus" :severity="getPaymentSeverity(selectedSession.paymentStatus)" /></div>
                <div><span>Plaka</span><strong>{{ formatValue(selectedSession.vehiclePlate) }}</strong></div>
                <div><span>Başlangıç</span><strong>{{ formatValue(selectedSession.startTime) }}</strong></div>
                <div><span>Bitiş</span><strong>{{ formatValue(selectedSession.endTime) }}</strong></div>
                <div><span>Süre</span><strong>{{ formatValue(selectedSession.duration) }}</strong></div>
                <div><span>Enerji</span><strong>{{ formatValue(selectedSession.energyConsumed) }}</strong></div>
                <div><span>Tutar</span><strong>{{ formatValue(selectedSession.cost) }}</strong></div>
                <div><span>Durum</span><Tag :value="selectedSession.status" :severity="getStatusSeverity(selectedSession.status)" /></div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.session-table :deep(.p-datatable-table) {
    table-layout: fixed;
    width: 100%;
}

.session-table :deep(.p-datatable-tbody > tr > td),
.session-table :deep(.p-datatable-thead > tr > th) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1rem;
}

.detail-grid > div {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.detail-grid span {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
}

.detail-grid strong {
    font-weight: 600;
    overflow-wrap: anywhere;
}

@media (min-width: 768px) {
    .detail-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
