<!--
Copyright 2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->
<template>
  <b-dropdown position="is-bottom-left" aria-role="list">
    <span slot="trigger" role="button" class="button" style="cursor: pointer">
      <img
        :src="$store.getters.userPhotoUrl"
        style="height:30px; border-radius: 50%"
      >
      &nbsp;
      <i class="fas fa-caret-down"></i>
    </span>
    <b-dropdown-item disabled aria-role="listitem">
      {{ $t('profiledropdown.Signed in as', {name: $store.getters.userDisplayName}) }}
    </b-dropdown-item>
    <b-dropdown-item @click="$router.push('/export')" aria-role="listitem">
      {{ $t('profiledropdown.Export my data') }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
  export default {
    methods: {
    }
  }
</script>
