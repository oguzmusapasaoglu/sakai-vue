<script setup>
import { ref, onMounted } from 'vue';
import { TenantService } from '@/service/TenantService';

const tenants = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const editingId = ref(null);
const formData = ref({});

onMounted(async () => {
    await loadTenants();
});

async function loadTenants() {
    loading.value = true;
    try {
        tenants.value = await TenantService.getTenants();
    } catch (error) {
        console.error('Error loading tenants:', error);
    } finally {
        loading.value = false;
    }
}

function getStatusSeverity(status) {
    const severities = {
        'Active': 'success',
        'Pending': 'warn',
        'Inactive': 'danger'
    };
    return severities[status] || 'info';
}

function openNew() {
    editingId.value = null;
    formData.value = {};
    showDialog.value = true;
}

function editTenant(tenant) {
    editingId.value = tenant.id;
    formData.value = { ...tenant };
    showDialog.value = true;
}

async function saveTenant() {
    if (editingId.value) {
        await TenantService.updateTenant(editingId.value, formData.value);
    } else {
        await TenantService.createTenant(formData.value);
    }
    showDialog.value = false;
    await loadTenants();
}

async function deleteTenant(id) {
    if (confirm('Kiracıyı silmek istiyor musunuz?')) {
        await TenantService.deleteTenant(id);
        await loadTenants();
    }
}
</script>

<template>
    <div class="card">
        <DataTable :value="tenants" :loading="loading" paginator :rows="20" dataKey="id" filterDisplay="menu">
            <template #header>
                <div class="flex justify-between items-center gap-4">
                    <span class="text-xl font-semibold">Kiracılar (Tenants)</span>
                    <Button label="Yeni Kiracı" icon="pi pi-plus" @click="openNew" />
                </div>
            </template>

            <Column field="name" header="Kiracı Adı" sortable style="width: 18%" />
            <Column field="companyName" header="Şirket" sortable style="width: 18%" />
            <Column field="email" header="E-posta" sortable style="width: 16%" />
            <Column field="totalStations" header="İstasyon" sortable style="width: 10%" />
            <Column field="totalConnectors" header="Konnektör" sortable style="width: 10%" />
            <Column field="status" header="Durum" style="width: 10%">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
            <Column header="İşlemler" style="width: 18%">
                <template #body="{ data }">
                    <Button icon="pi pi-eye" text rounded class="mr-2" title="Detay" />
                    <Button icon="pi pi-pencil" text rounded class="mr-2" @click="editTenant(data)" />
                    <Button icon="pi pi-trash" text rounded severity="danger" @click="deleteTenant(data.id)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="showDialog" :header="editingId ? 'Kiracıyı Düzenle' : 'Yeni Kiracı'" modal>
        <div class="grid grid-cols-1 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium mb-2">Kiracı Adı</label>
                <InputText v-model="formData.name" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Şirket Adı</label>
                <InputText v-model="formData.companyName" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Vergi ID</label>
                <InputText v-model="formData.taxId" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">E-posta</label>
                <InputText v-model="formData.email" type="email" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Telefon</label>
                <InputText v-model="formData.phone" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Durum</label>
                <Dropdown v-model="formData.status" :options="['Active', 'Pending', 'Inactive']" class="w-full" />
            </div>
        </div>
        <template #footer>
            <Button label="İptal" icon="pi pi-times" @click="showDialog = false" class="p-button-text" />
            <Button label="Kaydet" icon="pi pi-check" @click="saveTenant" />
        </template>
    </Dialog>
</template>
