import http from "../http-common";

class StudentService {
  getAll(params) {
    return http.get("/students?page=" + params.page + "&perPage=" + params.size);
  }

  get(id) {
    return http.get(`/students/${id}`);
  }

  create(data) {
    return http.post("/students", data);
  }

  update(id, data) {
    return http.put(`/students/${id}`, data);
  }

  delete(id) {
    return http.delete(`/students/${id}`);
  }
}

export default new StudentService();
