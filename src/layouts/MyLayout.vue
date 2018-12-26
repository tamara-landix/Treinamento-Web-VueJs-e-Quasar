<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        class="justify-between"
        color="dark"
        :glossy="$q.theme === 'mat'"
        :inverted="$q.theme === 'ios'"
      >
        <div class="row">
          <q-btn
            flat
            dense
            round
            @click="leftDrawerOpen = !leftDrawerOpen"
            aria-label="Menu"
          >
            <q-icon name="menu" />
          </q-btn>

          <q-toolbar-title>
            <img src="../statics/icon.png" width="30dp"/>
          </q-toolbar-title>
        </div>

        <q-tabs
          color="dark"
          :glossy="$q.theme === 'mat'"
          :inverted="$q.theme === 'ios'"
        >
          <q-route-tab
            slot="title"
            icon="fas fa-users"
            to="/users"
            replace
            hide="icon"
            :label="capitalize($t('label.user'))"
            @click.native="users"
          />
          <q-route-tab
            slot="title"
            icon="fas fa-code-branch"
            to="/branches"
            replace
            hide="icon"
            :label="capitalize($t('label.branch'))"
          />
        </q-tabs>

        <div>
          <q-btn-dropdown :label="$q.localStorage.get.item('user').name" >
            <q-list link>
              <q-item>
                <q-item-main @click.native="logout">
                  <q-item-tile label>Logout</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme == 'mat' ? 'bg-gray-2' : null"
    >
      <q-list
        no-border
        link
        insert-delimiter
      >
        <q-item>
          <q-item-side icon="fas fa-users" />
          <q-item-main :label="capitalize($t('label.user'))" />
        </q-item>
        <q-item>
          <q-item-side icon="fas fa-code-branch" />
          <q-item-main :label="capitalize($t('label.branch'))" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL, format } from 'quasar'
const { capitalize } = format

export default {
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      capitalize
    }
  },
  methods: {
    openURL,
    users () {
      this.$router.push('users')
    }
  }
}
</script>

<style>
</style>
