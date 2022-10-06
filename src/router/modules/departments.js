import Layout from '@/layout'

export default {
  path: '/departments ',
  component: Layout,
  children: [
    {
      path: '',
      name: 'departments',
      component: () => import('@/views/departments/index.vue'),
      meta: { title: '组织架构', icon: 'tree' }
    }
  ]
}
