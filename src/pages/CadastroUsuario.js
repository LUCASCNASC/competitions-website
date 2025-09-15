import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // Reaproveite seu Header/pesquisa
import "./CadastroUsuario.css";

const generos = ["Masculino", "Feminino", "Outro"];

export default function CadastroUsuario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome_completo: "",
    data_nascimento: "",
    email: "",
    confirmar_email: "",
    apelido: "",
    genero: "",
    cidade: "",
    senha: "",
    confirmar_senha: "",
    foto: null,
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    // Validação Front
    if (
      !form.nome_completo || !form.data_nascimento || !form.email ||
      !form.confirmar_email || !form.genero || !form.cidade ||
      !form.senha || !form.confirmar_senha
    ) {
      setErro("Preencha todos os campos obrigatórios!");
      return;
    }
    if (form.email !== form.confirmar_email) {
      setErro("Os e-mails não coincidem!");
      return;
    }
    if (form.senha !== form.confirmar_senha) {
      setErro("As senhas não coincidem!");
      return;
    }

    // Monta o formData para upload de imagem (mesmo se não tiver foto)
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const response = await fetch("http://localhost:3001/api/usuarios", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setSucesso("Usuário cadastrado com sucesso!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setErro(data.error || "Erro ao cadastrar.");
      }
    } catch {
      setErro("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div>
      <Header />
      <div className="cadastro-container">
        <h1>CADASTRE-SE</h1>
        <form className="cadastro-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>NOME COMPLETO*</label>
              <input name="nome_completo" value={form.nome_completo} onChange={handleChange} />
            </div>
            <div>
              <label>DATA DE NASCIMENTO*</label>
              <input name="data_nascimento" type="date" value={form.data_nascimento} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>E-MAIL*</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label>CONFIRMAR E-MAIL*</label>
              <input name="confirmar_email" type="email" value={form.confirmar_email} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>GÊNERO*</label>
              <select name="genero" value={form.genero} onChange={handleChange}>
                <option value="">Selecione</option>
                {generos.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label>APELIDO</label>
              <input name="apelido" value={form.apelido} onChange={handleChange} />
            </div>
            <div>
              <label>FOTO</label>
              <input name="foto" type="file" accept="image/*" onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>CIDADE*</label>
              <input name="cidade" value={form.cidade} onChange={handleChange} />
            </div>
          </div>
          <div className="form-row">
            <div>
              <label>SENHA*</label>
              <input name="senha" type="password" value={form.senha} onChange={handleChange} />
            </div>
            <div>
              <label>CONFIRMAR SENHA*</label>
              <input name="confirmar_senha" type="password" value={form.confirmar_senha} onChange={handleChange} />
            </div>
          </div>
          {erro && <div className="erro">{erro}</div>}
          {sucesso && <div className="sucesso">{sucesso}</div>}
          <button type="submit" className="btn-cadastrar">CADASTRAR</button>
        </form>
      </div>
    </div>
  );
}