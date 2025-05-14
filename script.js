import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD98Bjon-iEtJQYuTUQfZp3eivoZQmWWuc",
    authDomain: "usuario-8158d.firebaseapp.com",
    projectId: "usuario-8158d",
    storageBucket: "usuario-8158d.appspot.com",
    messagingSenderId: "759477105812",
    appId: "1:759477105812:web:8111b8abca370df12db081",
    measurementId: "G-VFV58BE5VZ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Verifica se o formulário existe antes de adicionar evento
const form = document.getElementById("formCadastro");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("inputNome").value.trim();
        const email = document.getElementById("inputEmail").value.trim();
        const endereco = document.getElementById("inputEndereco").value.trim();

        try {
            await addDoc(collection(db, "usuarios"), {
                nome,
                email,
                endereco,
            });

            mostrarToast("Usuário cadastrado com sucesso!", "bg-success");
            form.reset();
            carregarUsuarios();
        } catch (erro) {
            console.error("Erro ao cadastrar:", erro);
            mostrarToast("Erro ao cadastrar usuário.", "bg-danger");
        }
    });
}
const lista = document.getElementById("lista");

if (lista) {
    carregarUsuarios();
}

async function carregarUsuarios() {
    if (!lista) return;

    lista.innerHTML = ""; // Limpar a lista antes de atualizar
    const q = collection(db, "usuarios"); // Sem orderBy por enquanto
    ;

    try {
        const snapshot = await getDocs(q);

        // Verifique se há dados no Firestore
        if (snapshot.empty) {
            console.log("Nenhum dado encontrado.");
            lista.innerHTML = "<tr><td colspan='3'>Nenhum usuário cadastrado.</td></tr>";
            return;
        }

        snapshot.forEach((doc) => {
            const dados = doc.data();
            console.log(dados); // Adicionei para depuração

            const linha = `
                <tr>
                    <td>${dados.nome}</td>
                    <td>${dados.email}</td>
                    <td>${dados.endereco}</td>
                </tr>
            `;
            lista.innerHTML += linha;
        });
    } catch (erro) {
        console.error("Erro ao carregar usuários:", erro);
        lista.innerHTML = `<tr><td colspan="3">Erro ao carregar usuários</td></tr>`;
    }
}

function mostrarToast(mensagem, cor) {
    const toastEl = document.getElementById("toastMsg");
    if (!toastEl) return;

    // Remover as classes de cor anteriores e adicionar a nova
    toastEl.classList.remove("bg-success", "bg-danger");
    toastEl.classList.add(cor);

    // Alterar o conteúdo da mensagem do toast
    toastEl.querySelector(".toast-body").textContent = mensagem;

    // Criar o toast do Bootstrap e exibi-lo
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}
