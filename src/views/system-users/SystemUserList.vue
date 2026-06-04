<script setup>
import { ref, onMounted } from 'vue';
import { SystemUserService } from '@/service/SystemUserService';

const users = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const editingId = ref(null);
const formData = ref({});

onMounted(async () => {
    await loadUsers();
});

async function loadUsers() {
    loading.value = true;
    try {
        users.value = await SystemUserService.getSystemUsers();
    } catch (error) {
        console.error('Error loading system users:', error);
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

function editUser(user) {
    editingId.value = user.id;
    formData.value = { ...user };
    showDialog.value = true;
}

async function saveUser() {
    if (editingId.value) {
        await SystemUserService.updateSystemUser(editingId.value, formData.value);
    } else {
        await SystemUserService.createSystemUser(formData.value);
    }
    showDialog.value = false;
    await loadUsers();
}

async function deleteUser(id) {
    if (confirm('Kullanıcıyı silmek istiyor musunuz?')) {
        await SystemUserService.deleteSystemUser(id);
        await loadUsers();
    }
}
</script>

<template>
    <div class="card">
        <DataTable :value="users" :loading="loading" paginator :rows="20" dataKey="id" filterDisplay="menu">
            <template #header>
                <div class="flex justify-between items-center gap-4">
                    <span class="text-xl font-semibold">Sistem Kullanıcıları</span>
                    <Button label="Yeni Kullanıcı" icon="pi pi-plus" @click="openNew" />
                </div>
            </template>

            <Column field="id" header="Kullanıcı ID" sortable style="width: 12%" />
            <Column field="firstName" header="Adı" sortable style="width: 12%" />
            <Column field="lastName" header="Soyadı" sortable style="width: 12%" />
            <Column field="email" header="E-posta" sortable style="width: 16%" />
            <Column field="role" header="Rol" sortable style="width: 12%" />
            <Column field="department" header="Departman" sortable style="width: 14%" />
            <Column field="status" header="Durum" style="width: 10%">
                <template #body="{ data }">
                    <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
                </template>
            </Column>
            <Column header="İşlemler" style="width: 12%">
                <template #body="{ data }">
                    <Button icon="pi pi-pencil" text rounded class="mr-2" @click="editUser(data)" />
                    <Button icon="pi pi-trash" text rounded severity="danger" @click="deleteUser(data.id)" />
                </template>
            </Column>
        </DataTable>
    </div>

    <Dialog v-model:visible="showDialog" :header="editingId ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı'" modal>
        <div class="grid grid-cols-1 gap-4 mb-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Adı</label>
                    <InputText v-model="formData.firstName" class="w-full" />
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Soyadı</label>
                    <InputText v-model="formData.lastName" class="w-full" />
                </div>
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
                <label class="block text-sm font-medium mb-2">Rol</label>
                <Dropdown v-model="formData.role" :options="['System Admin', 'Manager', 'Developer', 'Analyst', 'Technician', 'Accountant']" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Departman</label>
                <InputText v-model="formData.department" class="w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-2">Durum</label>
                <Dropdown v-model="formData.status" :options="['Active', 'Pending', 'Inactive']" class="w-full" />
            </div>
        </div>
        <template #footer>
            <Button label="İptal" icon="pi pi-times" @click="showDialog = false" class="p-button-text" />
            <Button label="Kaydet" icon="pi pi-check" @click="saveUser" />
        </template>
    </Dialog>
</template>
