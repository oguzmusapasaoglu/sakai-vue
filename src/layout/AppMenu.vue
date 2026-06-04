<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Ana Ekran',
        items: [
            { label: 'Dashboard', icon: 'pi pi-home', to: '/' }
        ]
    },
    {
        label: 'Kurumsal Yönetim',
        items: [
            { label: 'Müşteriler', icon: 'pi pi-id-card', to: '/customers' },
            { label: 'Kurumsal Hesaplar', icon: 'pi pi-briefcase', to: '/corporate-accounts' },
            { label: 'Bakiye İşlemleri', icon: 'pi pi-money-bill', to: '/corporate-balance-transactions' },
            { label: 'Çalışanlar', icon: 'pi pi-users', to: '/corporate-employees' }
        ]
    },
    {
        label: 'CPO Yönetimi',
        items: [
            { label: 'CPO Listesi', icon: 'pi pi-building', to: '/cpo-list' },
            { label: 'CPO Entegrasyon', icon: 'pi pi-share-alt', to: '/cpo-integration' }
        ]
    },
    {
        label: 'Şarj Altyapısı',
        items: [
            { label: 'İstasyon Grupları', icon: 'pi pi-map', to: '/stations' },
            { label: 'Oturumlar', icon: 'pi pi-clock', to: '/sessions' },
            { label: 'Tarifeler', icon: 'pi pi-tag', to: '/tariffs' }
        ]
    },
    {
        label: 'Sistem Yönetimi',
        items: [
            { label: 'Sistem Kullanıcıları', icon: 'pi pi-shield', to: '/system-users' },
            { label: 'Departman Sayfa Erişimi', icon: 'pi pi-key', to: '/department-page-access' },
            { label: 'Sistem Sayfaları', icon: 'pi pi-book', to: '/system-pages' }
        ]
    },
    {
        label: 'Ödeme & Ayarlar',
        items: [
            { label: 'Kampanyalar', icon: 'pi pi-percentage', to: '/campaigns' },
            { label: 'Ödeme Sağlayıcıları', icon: 'pi pi-credit-card', to: '/payment-providers' },
            { label: 'Bildirimler', icon: 'pi pi-bell', to: '/notifications' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
