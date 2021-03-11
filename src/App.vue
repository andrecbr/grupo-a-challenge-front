<template>
  <v-app>
    <v-app-bar app dark color="blue accent-4">
      <div class="d-flex align-center mr-10">
        Módulo Acadêmico
      </div>

      <v-btn @click="listStudents" text>
        Lista de Alunos
      </v-btn>

      <v-btn @click="newStudent" text>
        Novo Aluno
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view :key="$route.path" />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  methods: {
    listStudents() {
      this.$router.push("/students/list").catch(() => {});
    },
    newStudent() {
      this.$router.push("/students/new").catch(() => {});
    },
  },
};
</script>
