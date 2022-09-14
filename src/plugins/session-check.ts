import { definePlugin } from '/@src/app'
import { useUserSession } from '/@src/stores/userSession'
import { useNotyf } from '/@src/composable/useNotyf'

/**
 * Here we are setting up two router navigation guards
 * (note that we can have multiple guards in multiple plugins)
 *
 * We can add meta to pages either by declaring them manually in the
 * routes' declaration (see /@src/router.ts)
 * or by adding a <route> tag into .vue files (see /@src/pages/sidebar/dashboards.ts)
 *
 * <route lang="yaml">
 * meta:
 *   requiresAuth: true
 * </route>
 *
 * <script setup lang="ts">
 *  // TS script
 * </script>
 *
 * <template>
 *  // HTML content
 * </template>
 */
export default definePlugin(async ({ router, pinia }) => {
  router.beforeEach(async (to) => {
    const userSession = useUserSession(pinia)
    const notyf = useNotyf()

    const authRoutes = ['/', '/auth/login', '/auth/signup', '/auth/reset-password']

    // Redirect to log in if not logged in
    if (!userSession.isLoggedIn && !authRoutes.includes(to.path)) {
      return { name: '/auth', query: { redirect: to.fullPath } }
    }

    // Redirect if logged in
    if (to.meta.redirectIfLoggedIn && userSession.isLoggedIn) {
      return { name: '/app' }
    }

    if (to.meta.requiresAuth && !userSession.isLoggedIn) {
      // @ts-ignore
      notyf.error({
        message: 'Sorry, you should log in to access this section.',
        duration: 7000,
      })

      return {
        // Will follow the redirection set in /@src/pages/auth/index.vue
        name: '/auth',
        // save the location we were at to come back later
        query: { redirect: to.fullPath },
      }
    }
  })
})
