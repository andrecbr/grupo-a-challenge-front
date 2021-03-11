<template>
  <div class="submit-form mt-3 mx-auto">
    <v-row align="start" justify="start">
      <v-btn text small class="ma-3" to="/students/list">
        <v-icon left>
          mdi-arrow-left
        </v-icon>
        Voltar
      </v-btn>
    </v-row>

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

    <div class="edit-form py-3">
      <v-alert v-if="submitted" dense text type="success" :value="alert" transition="fade-transition"
        >O cadastro do <strong>aluno</strong> foi <strong>salvo</strong> com sucesso</v-alert
      >

      <p class="headline">Cadastro</p>

      <v-form>
        <v-text-field
          v-if="student.ra"
          v-model="student.ra"
          label="RA"
          disabled
          filled
        ></v-text-field>

        <v-text-field
          v-model="student.name"
          :error-messages="nameErrors"
          label="Nome"
          maxlength="50"
          required
          @input="$v.student.name.$touch()"
          @blur="$v.student.name.$touch()"
        ></v-text-field>

        <v-text-field
          v-model="student.email"
          :error-messages="emailErrors"
          label="E-mail"
          maxlength="80"
          required
          type="email"
          @input="$v.student.email.$touch()"
          @blur="$v.student.email.$touch()"
        ></v-text-field>

        <v-text-field
          v-model="student.cpf"
          :error-messages="cpfErrors"
          label="CPF"
          required
          maxlength="14"
          v-mask="'###.###.###-##'"
          ref="cpf"
          @input="$v.student.cpf.$touch()"
          @blur="$v.student.cpf.$touch()"
          :disabled="student.ra"
        ></v-text-field>
      </v-form>

      <v-btn color="success" class="mr-2 mt-10" @click="saveStudent"
        >Salvar Aluno</v-btn
      >
      <v-btn color="default" class="mt-10" @click="dialog = true" v-if="student.ra"
        >Apagar cadastro</v-btn
      >
    </div>
  </div>
</template>

<script>
import StudentsService from "../services/StudentsService";
import { validationMixin } from 'vuelidate';
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators';
import { mask } from 'vue-the-mask';

export default {
  mixins: [validationMixin],
  directives: {mask},
  name: "student-detail",

  validations: {
    student: {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50),
      },
      email: {
        required,
        email,
      },
      cpf: {
        required,
        minLength: minLength(14),
        maxLength: maxLength(14),
      },
    },
  },

  data() {
    return {
      valid: false,
      student: {
        ra: null,
        name: "",
        email: "",
        cpf: "",
      },
      alert: true,
      submitted: false,
      dialog: false,
    };
  },

  methods: {
    getStudent(ra) {
      StudentsService.get(ra)
        .then((response) => {
          this.student = response.data;
          this.$nextTick(() => {
              this.$refs.cpf.$emit('input');
          })
        });
    },
    saveStudent() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        const data = {
          name: this.student.name,
          email: this.student.email,
          cpf: this.student.cpf,
        };

        this.alert = true;

        if (this.student.ra) {
          StudentsService.update(this.student.ra, data)
            .then(() => {
              this.submitted = true;
              setTimeout(()=>{
                this.alert = false;
              },5000);
            });
        } else {
          StudentsService.create(data)
            .then((response) => {
              this.student.ra = response.data.ra;
              this.submitted = true;
              setTimeout(()=>{
                this.alert = false;
              },5000);
            });
        }
      }
    },
    deleteStudent() {
      StudentsService.delete(this.student.ra)
        .then(() => {
          this.$router.push({ name: "students-list", params: { deleted: this.student.ra } });
          this.dialog = false;
        });
    },

    newStudent() {
      this.submitted = false;
      this.alert = true;
      this.student = {};
    },
  },
  computed: {
    nameErrors () {
      const errors = [];
      if (!this.$v.student.name.$dirty) return errors;
      !this.$v.student.name.minLength && errors.push('O nome deve ter no mínimo 3 caracteres.');
      !this.$v.student.name.maxLength && errors.push('O nome deve ter no máximo 50 caracteres.');
      !this.$v.student.name.required && errors.push('O preenchimento do nome é obrigatório.');
      return errors;
    },
    emailErrors () {
      const errors = [];
      if (!this.$v.student.email.$dirty) return errors;
      !this.$v.student.email.email && errors.push('Informe um e-mail válido.');
      !this.$v.student.email.required && errors.push('O preenchimento do e-mail é obrigatório.');
      return errors;
    },
    cpfErrors () {
      const errors = [];
      if (!this.$v.student.cpf.$dirty) return errors;
      !this.$v.student.cpf.minLength && errors.push('O CPF deve ter 14 dígitos.');
      !this.$v.student.cpf.maxLength && errors.push('O CPF deve ter 14 dígitos.');
      !this.$v.student.cpf.required && errors.push('O preenchimento do CPF é obrigatório.');
      return errors;
    },
  },
  mounted() {
    const ra = this.$route.params.ra;

    if (ra) {
      this.getStudent(ra);
    }
  },
};
</script>

<style>
.submit-form {
  max-width: 400px;
}
</style>
