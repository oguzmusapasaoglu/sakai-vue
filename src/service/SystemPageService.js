export const SystemPageService = {
    getSystemPages: async () => {
        return [
            {
                id: 'PAGE-1001',
                title: 'Terms of Service',
                slug: 'terms-of-service',
                description: 'General terms and conditions for platform usage',
                status: 'Published',
                group: 'Legal',
                author: 'Admin',
                createdDate: '2024-01-01',
                lastModified: '2025-05-15',
                viewCount: 5432,
                isActive: true
            },
            {
                id: 'PAGE-1002',
                title: 'Privacy Policy',
                slug: 'privacy-policy',
                description: 'Information about how we collect and use data',
                status: 'Published',
                group: 'Legal',
                author: 'Admin',
                createdDate: '2024-01-01',
                lastModified: '2025-04-20',
                viewCount: 3421,
                isActive: true
            },
            {
                id: 'PAGE-1003',
                title: 'FAQ',
                slug: 'faq',
                description: 'Frequently asked questions about the service',
                status: 'Published',
                group: 'Help',
                author: 'Support',
                createdDate: '2024-02-15',
                lastModified: '2025-05-10',
                viewCount: 8765,
                isActive: true
            },
            {
                id: 'PAGE-1004',
                title: 'How to Use',
                slug: 'how-to-use',
                description: 'Step-by-step guide for using the platform',
                status: 'Published',
                group: 'Help',
                author: 'Support',
                createdDate: '2024-03-01',
                lastModified: '2025-03-20',
                viewCount: 6543,
                isActive: true
            },
            {
                id: 'PAGE-1005',
                title: 'Pricing Information',
                slug: 'pricing',
                description: 'Detailed pricing plans and features comparison',
                status: 'Draft',
                group: 'Info',
                author: 'Marketing',
                createdDate: '2025-05-01',
                lastModified: '2025-06-02',
                viewCount: 234,
                isActive: false
            },
            {
                id: 'PAGE-1006',
                title: 'Contact Us',
                slug: 'contact-us',
                description: 'Contact information and support channels',
                status: 'Published',
                group: 'Help',
                author: 'Support',
                createdDate: '2024-04-10',
                lastModified: '2025-05-25',
                viewCount: 4321,
                isActive: true
            }
        ];
    },

    getSystemPageById: async (id) => {
        const pages = await this.getSystemPages();
        return pages.find(p => p.id === id);
    },

    createSystemPage: async (page) => {
        return { ...page, id: 'PAGE-' + Date.now() };
    },

    updateSystemPage: async (id, page) => {
        return { ...page, id };
    },

    deleteSystemPage: async (id) => {
        return { success: true };
    },

    publishPage: async (id) => {
        return { success: true };
    }
};
