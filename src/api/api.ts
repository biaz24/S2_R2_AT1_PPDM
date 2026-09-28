import axios from "axios";
import { Platform } from "react-native";

export const API_BASE_URL =
  //plataform é para identificar em qual ambiente estamos executando
  Platform.OS === "android"
    ? //   vai vericar se a plataforma que usamos vai precisar de qual ip
      // android usa esse
      "http:///10.0.2.2:3000"
    : "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, //define que a requisição pode ser esperada ate 10seg
  headers: {
    "Content-Type": "application/json", // enviando json
    Accept: "application/json", //esperando a resposta em json
  },
});

export default api;
