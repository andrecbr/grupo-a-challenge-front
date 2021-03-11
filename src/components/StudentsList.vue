<template>
  <v-row align="center" class="list px-3 mt-3 mx-auto">

    <v-dialog v-model="dialog" persistent max-width="320">
      <v-card>
        <v-card-title class="headline">
          Confirmação
        </v-card-title>
        <v-card-text
          >Por favor, confirme a exclusão do cadastro do aluno.<br /><strong
            >Atenção, este processo não poderá ser revertido.</strong
          ></v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">
            Cancelar
          </v-btn>
          <v-btn color="error" text @click="deleteStudent">
            Excluir cadastro
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-col cols="12" sm="12">
      <v-card class="mx-auto" tile>
        <v-card-title>Alunos</v-card-title>

        <v-alert dismissible v-if="deleted" dense text color="red lighten-2"
          >O cadastro do <strong>aluno</strong> foi <strong>apagado</strong> com
          sucesso</v-alert
        >

        <v-card-actions>
          <v-row>
            <v-col cols="12" sm="12" align="end" justify="end">
              <v-btn color="info" to="/students/new">
                Novo aluno
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>

        <v-data-table
          :headers="headers"
          :items="students"
          disable-pagination
          :hide-default-footer="true"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editStudent(item.ra)"
              >mdi-pencil</v-icon
            >
            <v-icon small @click="setCurrentRa(item.ra)">mdi-delete</v-icon>
          </template>
        </v-data-table>

        <v-col cols="12" sm="12">
          <v-row>
            <v-col cols="4" sm="3">
              <v-select
                v-model="pageSize"
                :items="pageSizes"
                label="Registros por página"
                @change="handlePageSize"
              ></v-select>
            </v-col>

            <v-col cols="12" sm="9">
              <v-pagination
                v-model="page"
                :length="totalPages"
                total-visible="7"
                next-icon="mdi-menu-right"
                prev-icon="mdi-menu-left"
                @input="handlePage"
              ></v-pagination>
            </v-col>
          </v-row>
        </v-col>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import StudentsService from "../services/StudentsService";
export default {
  name: "students-list",
  data() {
    return {
      students: [],
      currentRa: 0,
      title: "",
      headers: [
        { text: "Registro Acadêmico", value: "ra", sortable: true },
        { text: "Nome", align: "start", sortable: true, value: "name" },
        { text: "E-mail", value: "email", sortable: true },
        { text: "CPF", value: "cpf", sortable: true },
        { text: "Ações", value: "actions", sortable: false },
      ],
      dialog: false,
      deleted: 0,

      page: 1,
      totalPages: 0,
      pageSize: 5,
      pageSizes: [5, 10, 15],
    };
  },
  methods: {
    getRequestParams(searchTitle, page, pageSize) {
      let params = {};

      if (searchTitle) {
        params["title"] = searchTitle;
      }

      if (page) {
        params["page"] = page;
      }

      if (pageSize) {
        params["size"] = pageSize;
      }

      return params;
    },

    listStudents() {
      const params = this.getRequestParams(
        this.searchTitle,
        this.page,
        this.pageSize
      );

      StudentsService.getAll(params)
        .then((response) => {
          const { data, last_page } = response.data;

          this.students = data.map(this.displayStudent);

          this.totalPages = last_page;
        });
    },

    refreshList() {
      this.listStudents();
    },

    editStudent(ra) {
      this.$router.push({ name: "student-detail", params: { ra: ra } });
    },

    deleteStudent() {
      StudentsService.delete(this.currentRa)
        .then(() => {
          this.refreshList();
          this.deleted = this.currentRa;
          this.dialog = false;
        });
    },

    displayStudent(student) {
      return {
        ra: student.ra,
        name:
          student.name.length > 30
            ? student.name.substr(0, 30) + "..."
            : student.name,
        email:
          student.email.length > 30
            ? student.email.substr(0, 30) + "..."
            : student.email,
        cpf: student.cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4'),
      };
    },

    setCurrentRa(ra) {
      this.currentRa = ra;
      this.dialog = true;
    },

    handlePage(page) {
      this.currentPage = page;
      this.listStudents();
    },

    handlePageSize(size) {
      this.pageSize = size;
      this.page = 1;
      this.listStudents();
    },
  },
  mounted() {
    this.listStudents();
    this.deleted = this.$route.params.deleted;
  },
};
</script>