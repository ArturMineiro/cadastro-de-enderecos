import axios from 'axios';

const apiCep = axios.create({
  baseURL: 'http://localhost:8080/api/cep',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiCep;
