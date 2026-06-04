<script setup>
import { ref, onMounted } from 'vue';
import { ConnectorService } from '@/service/ConnectorService';

const connectors = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const editingId = ref(null);
const formData = ref({});

onMounted(async () => {
    await loadConnectors();
});

async function loadConnectors() {
    loading.value = true;
    try {
        connectors.value = await ConnectorService.getConnectors();
    } catch (error) {
        console.error('Error loading connectors:', error);
    } finally {
        loading.value = false;
    }
}

function getStatusSeverity(status) {
    const severities = {
        'Active': 'success',
        'Maintenance': 'warn',
        'Passive': 'danger'
    };
    return severities[status] || 'info';
}

function openNew() {
    editingId.value = null;
    formData.value = {};
    showDialog.value = true;
}

function editConnector(connector) {
    editingId.value = connector.id;
    formData.value = { ...connector };
    showDialog.value = true;
}

async function saveConnector() {
    if (editingId.value) {
        await ConnectorService.updateConnector(editingId.value, formData.value);
    } else {
        await ConnectorService.createConnector(formData.value);
    }
    showDialog.value = false;
    await loadConnectors();
}

async function deleteConnector(id) {
    if (confirm('Konnektörü silmek istiyor musunuz?')) {
        await ConnectorService.deleteConnector(id);
        await loadConnectors();
    }
}
</script>

<template>
    <div class="card">
        <DataTable :value="connectors" :loading="loading" paginator :rows="20" dataKey="id" filterDisplay="menu">
            <template #header>
                <div class="flex justify-between items-center gap-4">
                    <span class="text-xl font-semibold">Konnektörler</span>
                    <Button label="Yeni Konnektör" icon="pi pi-plus" @click="openNew" />
                </div>
            </template>

            <Column field="id" header="Konnektör ID" sortable style="width: 12%" />
            <Column field="stationName" header="İstasyon" sortable style="width: 18%" />
            <Column field="type" header="Tip" sortable style="width: 10%" />
            <Column field="power" header="Güç" sortable style="width: 10%" />
            <Column field="status" header="Durum" style="width: 10%">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
            <Column field="totalSessions" header="Oturumlar" sortable style="width: 10%" />
            <Column header="İşlemler" style="width: 20%">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" text rounded class="mr-2" @click="editConnector(data)" />
                    <Button icon="pi pi-trash" text rounded severity="danger" @click="deleteConnector(data.id)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="showDialog" :header="editingId ? 'Konnektörü Düzenle' : 'Yeni Konnektör'" modal>
        <div class="grid grid-cols-1 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium mb-2">İstasyon Adı</label>
                <InputText v-model="formData.stationName" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Tip</label>
                <Dropdown v-model="formData.type" :options="['Type 2', 'CCS', 'CHAdeMO']" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Güç</label>
                <InputText v-model="formData.power" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Durum</label>
                <Dropdown v-model="formData.status" :options="['Active', 'Maintenance', 'Passive']" class="w-full" />
            </div>
        </div>
        <template #footer>
            <Button label="İptal" icon="pi pi-times" @click="showDialog = false" class="p-button-text" />
            <Button label="Kaydet" icon="pi pi-check" @click="saveConnector" />
        </template>
    </Dialog>
</template>
