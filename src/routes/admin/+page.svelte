<script>
	import '../../app.css';
	import '../../lib/styles.css';
	import { onMount } from 'svelte';
	import '../../lib/tulipStyles.scss';  // Importando o arquivo CSS
	import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
	import { auth } from '../../lib/firebaseConfig';

	onMount(() => {
		const c = setTimeout(() => {
		document.body.classList.remove("not-loaded");
		clearTimeout(c);
		}, 1000);
	});
  
	let capitulos = [];
	let isAuthenticated = false;
	let email = '';
	let password = '';
	let showAddModal = false;
	let newTitulo = '';
	let newTexto = '';
	let errorMessage = '';
  
	onMount(async () => {
	  await checkAuth();
	  if (isAuthenticated) {
		loadCapitulos();
	  }
	});
  
	async function checkAuth() {
	  auth.onAuthStateChanged((user) => {
		if (user) {
		  isAuthenticated = true;
		  loadCapitulos();
		} else {
		  isAuthenticated = false;
		}
	  });
	}
  
	async function loadCapitulos() {
	  const response = await fetch('/api/textos.json');
	  const data = await response.json();
	  capitulos = data;
	}
  
	function getNextId() {
	  if (capitulos.length === 0) return 1;
	  const ids = capitulos.map((capitulo) => parseInt(capitulo.id, 10));
	  return Math.max(...ids) + 1;
	}
  
	async function handleAdd() {
	  if (!newTitulo.trim() || !newTexto.trim()) {
		errorMessage = "Título e texto não podem estar vazios.";
		return;
	  }
	  const newCapitulo = { id: getNextId().toString(), titulo: newTitulo, texto: newTexto };
	  capitulos = [newCapitulo, ...capitulos];
	  await saveCapitulos();
	  newTitulo = '';
	  newTexto = '';
	  errorMessage = '';
	  showAddModal = false;
	}
  
	async function handleEdit(id) {
	  capitulos = capitulos.map((capitulo) =>
		capitulo.id === id ? { ...capitulo, isEditing: true } : capitulo
	  );
	}
  
	async function handleSave(id) {
	  capitulos = capitulos.map((capitulo) =>
		capitulo.id === id ? { ...capitulo, isEditing: false } : capitulo
	  );
	  await saveCapitulos();
	}
  
	async function handleDelete(id) {
	  capitulos = capitulos.filter((c) => c.id !== id);
	  await saveCapitulos();
	}
  
	async function saveCapitulos() {
	  await fetch('/api/textos.json', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(capitulos)
	  });
	  await loadCapitulos();
	}
  
	async function handleLogin() {
	  try {
		await signInWithEmailAndPassword(auth, email, password);
		email = '';
		password = '';
	  } catch (error) {
		errorMessage = 'Erro ao fazer login: ' + error.message;
	  }
	}
  
	async function handleLogout() {
	  await signOut(auth);
	}
  </script>

  <div class="night"></div>
  <div class="flowers">
    <div class="flower flower--1">
      <div class="flower__leafs flower__leafs--1">
        <div class="flower__leaf flower__leaf--1"></div>
        <div class="flower__leaf flower__leaf--2"></div>
        <div class="flower__leaf flower__leaf--3"></div>
        <div class="flower__leaf flower__leaf--4"></div>
        <div class="flower__white-circle"></div>

        <div class="flower__light flower__light--1"></div>
        <div class="flower__light flower__light--2"></div>
        <div class="flower__light flower__light--3"></div>
        <div class="flower__light flower__light--4"></div>
        <div class="flower__light flower__light--5"></div>
        <div class="flower__light flower__light--6"></div>
        <div class="flower__light flower__light--7"></div>
        <div class="flower__light flower__light--8"></div>

      </div>
      <div class="flower__line">
        <div class="flower__line__leaf flower__line__leaf--1"></div>
        <div class="flower__line__leaf flower__line__leaf--2"></div>
        <div class="flower__line__leaf flower__line__leaf--3"></div>
        <div class="flower__line__leaf flower__line__leaf--4"></div>
        <div class="flower__line__leaf flower__line__leaf--5"></div>
        <div class="flower__line__leaf flower__line__leaf--6"></div>
      </div>
    </div>

    <div class="flower flower--2">
      <div class="flower__leafs flower__leafs--2">
        <div class="flower__leaf flower__leaf--1"></div>
        <div class="flower__leaf flower__leaf--2"></div>
        <div class="flower__leaf flower__leaf--3"></div>
        <div class="flower__leaf flower__leaf--4"></div>
        <div class="flower__white-circle"></div>

        <div class="flower__light flower__light--1"></div>
        <div class="flower__light flower__light--2"></div>
        <div class="flower__light flower__light--3"></div>
        <div class="flower__light flower__light--4"></div>
        <div class="flower__light flower__light--5"></div>
        <div class="flower__light flower__light--6"></div>
        <div class="flower__light flower__light--7"></div>
        <div class="flower__light flower__light--8"></div>

      </div>
      <div class="flower__line">
        <div class="flower__line__leaf flower__line__leaf--1"></div>
        <div class="flower__line__leaf flower__line__leaf--2"></div>
        <div class="flower__line__leaf flower__line__leaf--3"></div>
        <div class="flower__line__leaf flower__line__leaf--4"></div>
      </div>
    </div>

    <div class="flower flower--3">
      <div class="flower__leafs flower__leafs--3">
        <div class="flower__leaf flower__leaf--1"></div>
        <div class="flower__leaf flower__leaf--2"></div>
        <div class="flower__leaf flower__leaf--3"></div>
        <div class="flower__leaf flower__leaf--4"></div>
        <div class="flower__white-circle"></div>

        <div class="flower__light flower__light--1"></div>
        <div class="flower__light flower__light--2"></div>
        <div class="flower__light flower__light--3"></div>
        <div class="flower__light flower__light--4"></div>
        <div class="flower__light flower__light--5"></div>
        <div class="flower__light flower__light--6"></div>
        <div class="flower__light flower__light--7"></div>
        <div class="flower__light flower__light--8"></div>

      </div>
      <div class="flower__line">
        <div class="flower__line__leaf flower__line__leaf--1"></div>
        <div class="flower__line__leaf flower__line__leaf--2"></div>
        <div class="flower__line__leaf flower__line__leaf--3"></div>
        <div class="flower__line__leaf flower__line__leaf--4"></div>
      </div>
    </div>

    <div class="grow-ans" style="--d:1.2s">
      <div class="flower__g-long">
        <div class="flower__g-long__top"></div>
        <div class="flower__g-long__bottom"></div>
      </div>
    </div>

    <div class="growing-grass">
      <div class="flower__grass flower__grass--1">
        <div class="flower__grass--top"></div>
        <div class="flower__grass--bottom"></div>
        <div class="flower__grass__leaf flower__grass__leaf--1"></div>
        <div class="flower__grass__leaf flower__grass__leaf--2"></div>
        <div class="flower__grass__leaf flower__grass__leaf--3"></div>
        <div class="flower__grass__leaf flower__grass__leaf--4"></div>
        <div class="flower__grass__leaf flower__grass__leaf--5"></div>
        <div class="flower__grass__leaf flower__grass__leaf--6"></div>
        <div class="flower__grass__leaf flower__grass__leaf--7"></div>
        <div class="flower__grass__leaf flower__grass__leaf--8"></div>
        <div class="flower__grass__overlay"></div>
      </div>
    </div>

    <div class="growing-grass">
      <div class="flower__grass flower__grass--2">
        <div class="flower__grass--top"></div>
        <div class="flower__grass--bottom"></div>
        <div class="flower__grass__leaf flower__grass__leaf--1"></div>
        <div class="flower__grass__leaf flower__grass__leaf--2"></div>
        <div class="flower__grass__leaf flower__grass__leaf--3"></div>
        <div class="flower__grass__leaf flower__grass__leaf--4"></div>
        <div class="flower__grass__leaf flower__grass__leaf--5"></div>
        <div class="flower__grass__leaf flower__grass__leaf--6"></div>
        <div class="flower__grass__leaf flower__grass__leaf--7"></div>
        <div class="flower__grass__leaf flower__grass__leaf--8"></div>
        <div class="flower__grass__overlay"></div>
      </div>
    </div>

    <div class="grow-ans" style="--d:2.4s">
      <div class="flower__g-right flower__g-right--1">
        <div class="leaf"></div>
      </div>
    </div>

    <div class="grow-ans" style="--d:2.8s">
      <div class="flower__g-right flower__g-right--2">
        <div class="leaf"></div>
      </div>
    </div>

    <div class="grow-ans" style="--d:2.8s">
      <div class="flower__g-front">
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--1">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--2">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--3">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--4">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--5">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--6">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--7">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--8">
          <div class="flower__g-front__leaf"></div>
        </div>
        <div class="flower__g-front__line"></div>
      </div>
    </div>

    <div class="grow-ans" style="--d:3.2s">
      <div class="flower__g-fr">
        <div class="leaf"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--1"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--2"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--3"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--4"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--5"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--6"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--7"></div>
        <div class="flower__g-fr__leaf flower__g-fr__leaf--8"></div>
      </div>
    </div>

    <div class="long-g long-g--0">
      <div class="grow-ans" style="--d:3s">
        <div class="leaf leaf--0"></div>
      </div>
      <div class="grow-ans" style="--d:2.2s">
        <div class="leaf leaf--1"></div>
      </div>
      <div class="grow-ans" style="--d:3.4s">
        <div class="leaf leaf--2"></div>
      </div>
      <div class="grow-ans" style="--d:3.6s">
        <div class="leaf leaf--3"></div>
      </div>
    </div>

    <div class="long-g long-g--1">
      <div class="grow-ans" style="--d:3.6s">
        <div class="leaf leaf--0"></div>
      </div>
      <div class="grow-ans" style="--d:3.8s">
        <div class="leaf leaf--1"></div>
      </div>
      <div class="grow-ans" style="--d:4s">
        <div class="leaf leaf--2"></div>
      </div>
      <div class="grow-ans" style="--d:4.2s">
        <div class="leaf leaf--3"></div>
      </div>
    </div>

    <div class="long-g long-g--2">
      <div class="grow-ans" style="--d:4s">
        <div class="leaf leaf--0"></div>
      </div>
      <div class="grow-ans" style="--d:4.2s">
        <div class="leaf leaf--1"></div>
      </div>
      <div class="grow-ans" style="--d:4.4s">
        <div class="leaf leaf--2"></div>
      </div>
      <div class="grow-ans" style="--d:4.6s">
        <div class="leaf leaf--3"></div>
      </div>
    </div>

    <div class="long-g long-g--3">
      <div class="grow-ans" style="--d:4s">
        <div class="leaf leaf--0"></div>
      </div>
      <div class="grow-ans" style="--d:4.2s">
        <div class="leaf leaf--1"></div>
      </div>
      <div class="grow-ans" style="--d:3s">
        <div class="leaf leaf--2"></div>
      </div>
      <div class="grow-ans" style="--d:3.6s">
        <div class="leaf leaf--3"></div>
      </div>
    </div>

    <div class="long-g long-g--4">
      <div class="grow-ans" style="--d:4s">
        <div class="leaf leaf--0"></div>
      </div>
      <div class="grow-ans" style="--d:4.2s">
        <div class="leaf leaf--1"></div>
      </div>
      <div class="grow-ans" style="--d:3s">
        <div class="leaf leaf--2"></div>
      </div>
      <div class="grow-ans" style="--d:3.6s">
        <div class="leaf leaf--3"></div>
      </div>
    </div>

    <div class="long-g long-g--5">
      <div class="grow-ans" style="--d:4s">
        <div class="leaf leaf--0"></div>
      </div>
      <div class="grow-ans" style="--d:4.2s">
        <div class="leaf leaf--1"></div>
      </div>
      <div class="grow-ans" style="--d:3s">
        <div class="leaf leaf--2"></div>
      </div>
      <div class="grow-ans" style="--d:3.6s">
        <div class="leaf leaf--3"></div>
      </div>
    </div>

    <div class="long-g long-g--6">
      <div class="grow-ans" style="--d:4.2s">
        <div class="leaf leaf--0"></div>
      </div>
      <div class="grow-ans" style="--d:4.4s">
        <div class="leaf leaf--1"></div>
      </div>
      <div class="grow-ans" style="--d:4.6s">
        <div class="leaf leaf--2"></div>
      </div>
      <div class="grow-ans" style="--d:4.8s">
        <div class="leaf leaf--3"></div>
      </div>
    </div>

    <div class="long-g long-g--7">
      <div class="grow-ans" style="--d:3s">
        <div class="leaf leaf--0"></div>
      </div>
      <div class="grow-ans" style="--d:3.2s">
        <div class="leaf leaf--1"></div>
      </div>
      <div class="grow-ans" style="--d:3.5s">
        <div class="leaf leaf--2"></div>
      </div>
      <div class="grow-ans" style="--d:3.6s">
        <div class="leaf leaf--3"></div>
      </div>
    </div>
  </div>
  
  <div class="page-container">
	<div class="nome-centralizado">
	  <p><strong>Painel de Administração</strong></p>
	  {#if isAuthenticated}
		<button class="logout-button" on:click={handleLogout}>Logout</button>
	  {/if}
	</div>
  
	{#if isAuthenticated}
	  <div class="actions">
		<button class="add-button" on:click={() => (showAddModal = true)}>Adicionar Capítulo</button>
	  </div>
	  {#each capitulos as { id, titulo, texto, isEditing }}
		<div class="capitulo" data-id={id}>
		  {#if isEditing}
			<input type="text" bind:value={titulo} class="edit-titulo" placeholder="Título" />
			<textarea bind:value={texto} class="edit-texto" placeholder="Texto"></textarea>
			<button on:click={() => handleSave(id)}>Salvar</button>
		  {:else}
			<h3>{titulo}</h3>
			<p>{texto}</p>
			<button on:click={() => handleEdit(id)}>Editar</button>
		  {/if}
		  <button on:click={() => handleDelete(id)}>Excluir</button>
		</div>
	  {/each}
  
	  {#if showAddModal}
		<div class="modal">
		  <div class="modal-content">
			<span class="close" on:click={() => (showAddModal = false)}>&times;</span>
			<h2>Adicionar Novo Capítulo</h2>
			{#if errorMessage}
			  <p class="error-message">{errorMessage}</p>
			{/if}
			<input type="text" bind:value={newTitulo} class="modal-input" placeholder="Título" />
			<textarea bind:value={newTexto} class="modal-textarea" placeholder="Texto"></textarea>
			<button on:click={handleAdd} class="modal-button">Adicionar</button>
		  </div>
		</div>
	  {/if}
	{:else}
	  <div class="login-container">
		<div class="login-box">
		  <h1>Login</h1>
		  {#if errorMessage}
			<p class="error-message">{errorMessage}</p>
		  {/if}
		  <input type="email" bind:value={email} class="login-input" placeholder="Email" />
		  <input type="password" bind:value={password} class="login-input" placeholder="Senha" />
		  <button on:click={handleLogin} class="login-button">Login</button>
		</div>
	  </div>
	{/if}
  </div>
  
  <style>
	.edit-titulo,
	.edit-texto {
	  width: 100%;
	  margin-top: 10px;
	}
  
	.edit-titulo {
	  height: 40px;
	  font-size: 1.2em;
	}
  
	.edit-texto {
	  height: 100px;
	  font-size: 1em;
	  resize: vertical;
	}
  
	.add-button {
	  display: block;
	  margin: 40px auto;
	  background-color: #4caf50;
	  color: white;
	  border: none;
	  padding: 10px 20px;
	  font-size: 18px;
	  cursor: pointer;
	  border-radius: 5px;
	}
  
	.actions {
	  text-align: center;
	}
  
	.logout-button {
	  background-color: #f44336;
	  color: white;
	  border: none;
	  padding: 10px 20px;
	  font-size: 18px;
	  cursor: pointer;
	  border-radius: 5px;
	  position: absolute;
	  right: 20px;
	  top: 10px;
	}
  
	button {
	  background-color: #4caf50;
	  color: white;
	  border: none;
	  padding: 5px 10px;
	  text-align: center;
	  text-decoration: none;
	  display: inline-block;
	  font-size: 16px;
	  cursor: pointer;
	  border-radius: 5px;
	  margin-top: 10px;
	}
  
	.close {
	  color: black;
	  border: none;
	  font-size: 25px;
	  font-weight: bold;
	  position: absolute;
	  top: 10px;
	  right: 20px;
	  cursor: pointer;
	  transition: transform 0.3s ease;
	}
  
	.close:hover,
	.close:focus {
	  color: #000;
	  text-decoration: none;
	  transform: rotate(90deg);
	}
  
	.modal {
	  display: block; /* Show the modal */
	  position: fixed;
	  z-index: 1000; /* Sit on top */
	  padding-top: 60px; /* Location of the box */
	  left: 0;
	  top: 0;
	  width: 100%; /* Full width */
	  height: 100%; /* Full height */
	  overflow: auto; /* Enable scroll if needed */
	  background-color: rgb(0, 0, 0); /* Fallback color */
	  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
	}
  
	.modal-content {
	  background-color: #fefefe;
	  margin: 5% auto; /* 15% from the top and centered */
	  padding: 20px;
	  border: 1px solid #888;
	  width: 80%; /* Could be more or less, depending on screen size */
	  max-width: 500px;
	  position: relative; /* Ensures that the close button is positioned relative to the modal content */
	  text-align: center; /* Center the text */
	  border-radius: 10px; /* Round the corners */
	  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow */
	}
  
	.modal-input,
	.modal-textarea {
	  width: 90%;
	  padding: 10px;
	  margin: 10px auto;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  font-size: 16px;
	  display: block;
	}
  
	.modal-textarea {
	  resize: vertical;
	}
  
	.modal-button {
	  background-color: #4caf50;
	  color: white;
	  border: none;
	  padding: 10px 20px;
	  font-size: 18px;
	  cursor: pointer;
	  border-radius: 5px;
	  margin-top: 20px;
	  width: 90%;
	  display: block;
	  margin-left: auto;
	  margin-right: auto;
	}
  
	.login-container {
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  height: 100vh;
	}
  
	.login-box {
	  background-color: rgba(255, 255, 255, 0.9);
	  padding: 40px;
	  border-radius: 10px;
	  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	  text-align: center;
	}
  
	.login-input {
	  width: 100%;
	  padding: 10px;
	  margin: 10px 0;
	  border: 1px solid #ccc;
	  border-radius: 5px;
	  font-size: 16px;
	}
  
	.login-button {
	  background-color: #4caf50;
	  color: white;
	  border: none;
	  padding: 10px 20px;
	  font-size: 18px;
	  cursor: pointer;
	  border-radius: 5px;
	  margin-top: 20px;
	  width: 100%;
	}
  
	.error-message {
	  color: #f44336;
	  font-size: 14px;
	  margin-bottom: 15px;
	}
  
	@media (max-width: 768px) {
	  .add-button {
		margin: 0px auto;
	  }
  
	  .logout-button {
		font-size: 12px;
		border-radius: 5px;
		right: 5px;
		top: -5px;
	  }
	}
  
	@media (max-width: 414px) {
	  .add-button {
		margin: 0px auto;
	  }
  
	  .logout-button {
		font-size: 12px;
		border-radius: 5px;
		right: 5px;
		top: -5px;
	  }
	}
  </style>
  