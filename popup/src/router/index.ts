import { createRouter, createWebHistory } from 'vue-router';

import UpdateUsernameView from '@/views/UpdateUsernameView.vue';
import CreateUserView from '@/views/CreateUserView.vue';
import TasksView from '@/views/TasksView.vue';
import TaskProgressView from '@/views/TaskProgressView.vue';
import NewSurveyView from '@/views/NewSurveyView.vue';
import SettingsView from '@/views/SettingsView.vue';
import LocationsView from '@/views/LocationsView.vue';
import DashboardView from '@/views/DashboardView.vue';
import ImpressumView from '@/views/ImpressumView.vue';
import TutorialView from '@/views/TutorialView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LocationsView,
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: TutorialView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: TasksView,
    },
    {
      path: '/locations',
      name: 'locations',
      component: LocationsView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/active-task',
      name: 'active-task',
      component: TaskProgressView,
    },
    {
      path: '/create',
      name: 'create-account',
      component: CreateUserView,
    },
    {
      path: '/update-username',
      name: 'update-username',
      component: UpdateUsernameView,
    },
    {
      path: '/new-questionnaire',
      name: 'new-questionnaire',
      component: NewSurveyView,
    },
    {
      path: '/impressum',
      name: 'impressum',
      component: ImpressumView,
    },
    {
      path: '/**',
      redirect: { path: '/' },
    },
  ],
});

export default router;
