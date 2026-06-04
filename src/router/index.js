import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const isAuthenticated = () => localStorage.getItem('plughub-demo-auth') === 'true';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/login',
            redirect: '/login'
        },
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                { path: '', name: 'dashboard', component: () => import('@/views/Dashboard.vue') },
                // Kurumsal Yönetim
                { path: 'customers', name: 'customers', component: () => import('@/views/customers/CustomerList.vue') },
                { path: 'corporate-accounts', name: 'corporateAccounts', component: () => import('@/views/pages/NotFound.vue') },
                { path: 'corporate-balance-transactions', name: 'corporateBalanceTransactions', component: () => import('@/views/pages/NotFound.vue') },
                { path: 'corporate-employees', name: 'corporateEmployees', component: () => import('@/views/pages/NotFound.vue') },
                // CPO Yönetimi
                { path: 'cpo-list', name: 'cpoList', component: () => import('@/views/cpo/CpoList.vue') },
                { path: 'cpo-integration', name: 'cpoIntegration', component: () => import('@/views/cpo/CpoIntegration.vue') },
                { path: 'cpo-integration/:registryId/endpoints', name: 'cpoApiEndpoints', component: () => import('@/views/cpo/CpoApiEndpointList.vue') },
                { path: 'cpo-new', name: 'cpoNew', component: () => import('@/views/cpo/CpoEdit.vue') },
                { path: 'cpo-edit/:id', name: 'cpoEdit', component: () => import('@/views/cpo/CpoEdit.vue') },
                // Şarj Altyapısı
                { path: 'stations', name: 'stations', component: () => import('@/views/stations/StationList.vue') },
                { path: 'connectors', name: 'connectors', component: () => import('@/views/connectors/ConnectorList.vue') },
                { path: 'sessions', name: 'sessions', component: () => import('@/views/sessions/SessionList.vue') },
                { path: 'tariffs', name: 'tariffs', component: () => import('@/views/tariffs/TariffList.vue') },
                { path: 'campaigns', name: 'campaigns', component: () => import('@/views/campaigns/CampaignList.vue') },
                // Sistem Yönetimi
                { path: 'system-users', name: 'systemUsers', component: () => import('@/views/system-users/SystemUserList.vue') },
                { path: 'department-page-access', name: 'departmentPageAccess', component: () => import('@/views/pages/NotFound.vue') },
                { path: 'system-pages', name: 'systemPages', component: () => import('@/views/pages/SystemPageList.vue') },
                // Ödeme & Ayarlar
                { path: 'payment-providers', name: 'paymentProviders', component: () => import('@/views/pages/NotFound.vue') },
                { path: 'notifications', name: 'notifications', component: () => import('@/views/notifications/NotificationList.vue') }
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

router.beforeEach((to) => {
    if (to.meta.requiresAuth && !isAuthenticated()) {
        return '/login';
    }

    if (to.name === 'login' && isAuthenticated()) {
        return '/';
    }
});

export default router;
