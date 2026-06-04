<script setup>
import { ref, onMounted } from 'vue';
import { NotificationService } from '@/service/NotificationService';

const notifications = ref([]);
const loading = ref(false);

onMounted(async () => {
    await loadNotifications();
});

async function loadNotifications() {
    loading.value = true;
    try {
        notifications.value = await NotificationService.getNotifications();
    } catch (error) {
        console.error('Error loading notifications:', error);
    } finally {
        loading.value = false;
    }
}

function getSeverityColor(severity) {
    const colors = {
        'success': 'green',
        'info': 'blue',
        'warn': 'orange',
        'danger': 'red'
    };
    return colors[severity] || 'gray';
}

async function markAsRead(notification) {
    await NotificationService.markAsRead(notification.id);
    await loadNotifications();
}

async function deleteNotification(id) {
    if (confirm('Bildirimi silmek istiyor musunuz?')) {
        await NotificationService.deleteNotification(id);
        await loadNotifications();
    }
}

const unreadCount = () => notifications.value.filter(n => !n.read).length;
</script>

<template>
    <div class="card">
        <DataTable :value="notifications" :loading="loading" paginator :rows="20" dataKey="id" filterDisplay="menu">
            <template #header>
                <div class="flex justify-between items-center gap-4">
                    <div>
                        <span class="text-xl font-semibold">Bildirimler</span>
                        <span class="ml-2 text-sm text-muted-color">({{ unreadCount() }} okunmamış)</span>
                    </div>
                    <Button label="Yenile" icon="pi pi-refresh" @click="loadNotifications" text />
                </div>
            </template>

            <Column style="width: 3%">
                <template #body="{ data }">
                    <div v-if="!data.read" class="w-2 h-2 rounded-full bg-primary"></div>
                </template>
            </Column>
            <Column field="title" header="Başlık" sortable style="width: 22%" />
            <Column field="message" header="Mesaj" style="width: 28%" />
            <Column field="type" header="Tip" sortable style="width: 12%" />
            <Column field="sender" header="Gönderen" sortable style="width: 12%" />
            <Column field="date" header="Tarih" sortable style="width: 13%" />
            <Column header="İşlemler" style="width: 10%">
                <template #body="{ data }">
                    <Button
                        v-if="!data.read"
                        icon="pi pi-check"
                        text
                        rounded
                        class="mr-2"
                        @click="markAsRead(data)"
                        title="Okundu olarak işaretle" />
                    <Button
                        icon="pi pi-trash"
                        text
                        rounded
                        severity="danger"
                        @click="deleteNotification(data.id)"
                        title="Sil" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>
