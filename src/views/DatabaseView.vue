<template>
  <!-- <pre>{{ aniimoHomelandAbilities }}</pre> -->
  <!-- <pre>{{ aniimoData }}</pre> -->
  <table class="table table-hover">
    <thead>
      <tr>
        <th>id</th>
        <th>Title</th>
        <th>Number</th>
        <th>Gender</th>
        <th>Image</th>
        <th>Form</th>
        <th>Elements</th>
        <th>Roles</th>
        <th>Stages</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="aniimo in aniimoData" :key="aniimo.id">
        <td>{{ aniimo.id }}</td>
        <td>{{ aniimo.fields.Title }}</td>
        <td>{{ aniimo.fields.Number.toString().padStart(3, '0') }}</td>
        <td>{{ aniimo.fields.Gender }}</td>
        <td>
          <img
            :src="getImageUrl(aniimo.fields.Image[0]?.path)"
            class="aspect-video object-cover size-10 border rounded"
            v-if="aniimo.fields.Image"
          />
        </td>
        <td>{{ aniimo.fields.Form.fields.Title }}</td>
        <td>
          {{
            aniimo.fields.Elements.map((element) => `[${element.id}] ${element.fields.Title}`).join(
              ', ',
            )
          }}
        </td>
        <td>
          {{ aniimo.fields.Roles.map((role) => `[${role.id}] ${role.fields.Title}`).join(', ') }}
        </td>
        <td>&nbsp;</td>
      </tr>
    </tbody>
  </table>

  <!-- <pre>{{ aniimoData }}</pre> -->
</template>

<script setup lang="ts">
import aniimoData from '@/data/aniimo.json';

const getImageUrl = (path: string | undefined): string => {
  if (typeof path === 'undefined') {
    return '/img/aniimo/default.png';
  }
  return '/img/aniimo/' + path.split('/').pop();
};
</script>
