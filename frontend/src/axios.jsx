import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // Replace with your Spring Boot backend URL
});

export default instance;
