import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- CONFIGURAÇÃO MANUAL (TEMPORÁRIA) ---
// Cole os códigos do seu .env aqui dentro das aspas
const firebaseConfig = {
  apiKey: "AIzaSyAvNYrBCF9tKC28m_orkmy-KLTtLIg1Si4", 
  authDomain: "afiliattuz.mydigitaldropp.com",
  projectId: "afiliattuz-ecosystem",
  storageBucket: "afiliattuz-ecosystem.appspot.com",
  messagingSenderId: "526040361030",
  appId: "1:526040361030:web:8cb22f9c45fd5d356f8247"
};

console.log("🔥 Tentando conectar com:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;