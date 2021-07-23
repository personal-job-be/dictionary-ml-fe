export default function ({ $auth, next }) {
  if ($auth.loggedIn) {
    next('/dashboard')
  }
}
