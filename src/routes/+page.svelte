<script>
	import '../app.css';
	import '../lib/styles.css';
	import '../lib/tulipStyles.scss';
	import { onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { db, ref, onValue, runTransaction, set } from '../lib/firebaseConfig';

	let capitulos = []; // Lista para armazenar os capítulos
	let userIp = '';
	let userId = '';
	let showNotification = false;
	let notificationMessage = '';
	let tulipsLoaded = false; // Variável para controlar se as tulipas já carregaram
	let visitCount = 0; // Contador de visitas

	// Função para mostrar notificações
	function showNotificationWithMessage(message) {
		notificationMessage = message;
		showNotification = true;
		setTimeout(() => {
			showNotification = false;
		}, 3000);
	}

	// Função para lidar com "curtir"
	async function handleLike(capituloId) {
		try {
			const userLikeRef = ref(db, `user_likes/${capituloId}/${userId}`);
			const ipLikeRef = ref(db, `ip_likes/${capituloId}/${userIp}`);

			const userLikeSnapshot = await new Promise((resolve, reject) => {
				onValue(userLikeRef, resolve, { onlyOnce: true });
			});

			const ipLikeSnapshot = await new Promise((resolve, reject) => {
				onValue(ipLikeRef, resolve, { onlyOnce: true });
			});

			if (userLikeSnapshot.exists() || ipLikeSnapshot.exists()) {
				showNotificationWithMessage('Você já curtiu este capítulo.');
				return;
			}

			const likesRef = ref(db, 'likes/' + capituloId);
			await runTransaction(likesRef, (currentLikes) => {
				return (currentLikes || 0) + 1;
			}).then(() => {
				set(userLikeRef, true);
				set(ipLikeRef, true);
				capitulos = capitulos.map((capitulo) =>
					capitulo.id === capituloId ? { ...capitulo, likes: capitulo.likes + 1 } : capitulo
				);
			});
		} catch (error) {
			console.error('Erro ao curtir o capítulo:', error);
		}
	}

	// Função para copiar o texto
	function handleCopy(text) {
		navigator.clipboard.writeText(text)
			.then(() => {
				showNotificationWithMessage('Texto copiado!');
			})
			.catch((err) => {
				console.error('Erro ao copiar texto:', err);
			});
	}

	// Função para incrementar o contador de visitas
	async function incrementVisitCount() {
		try {
			const visitsRef = ref(db, 'visits');
			await runTransaction(visitsRef, (currentCount) => {
				return (currentCount || 0) + 1;
			});
		} catch (error) {
			console.error('Erro ao incrementar o contador de visitas:', error);
		}
	}

	// Primeiro onMount para controlar o carregamento das tulipas e animação dos cards
	onMount(() => {
		setTimeout(() => {
			document.body.classList.remove('not-loaded');

			// Simula a duração da animação das tulipas (3 segundos)
			setTimeout(() => {
				tulipsLoaded = true;
				const container = document.getElementById('containerTextos');
				container.style.opacity = 1;

				const nomeCentralizado = document.querySelector('.nome-centralizado');
				nomeCentralizado.style.display = 'block'; // Torna o elemento visível
				setTimeout(() => {
					nomeCentralizado.style.opacity = 1; // Faz a transição de opacidade
				}, 10);

				// Carrega os cards com 1 segundo de atraso entre cada um
				const cards = document.querySelectorAll('.capitulo');
				cards.forEach((card, index) => {
					setTimeout(() => {
						card.classList.add('animate');
					}, index * 1000);
				});
			}, 3000);
		}, 1000);
	});

	// Segundo onMount para carregar dados e inicializar Firebase
	onMount(async () => {
		if (typeof window !== 'undefined') {
			userId = localStorage.getItem('user_id') || uuidv4();

			if (!localStorage.getItem('user_id')) {
				localStorage.setItem('user_id', userId);
			}

			try {
				const response = await fetch('/textos.json');
				capitulos = await response.json();

				const ipResponse = await fetch('https://api.ipify.org?format=json');
				const ipData = await ipResponse.json();
				userIp = ipData.ip.replace(/\./g, '-');

				capitulos = await Promise.all(
					capitulos.map(async (capitulo) => {
						const likesRef = ref(db, 'likes/' + capitulo.id);
						const snapshot = await new Promise((resolve, reject) => {
							onValue(likesRef, resolve, { onlyOnce: true });
						});
						return { ...capitulo, likes: snapshot.val() || 0 };
					})
				);

				// Incrementa o contador de visitas ao carregar a página
				incrementVisitCount();

				// Carrega o contador de visitas atual
				const visitsRef = ref(db, 'visits');
				onValue(visitsRef, (snapshot) => {
					visitCount = snapshot.val() || 0;
				});
			} catch (error) {
				console.error('Erro ao carregar dados:', error);
			}
		}
	});
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

<div class="background"></div>
<div class="page-container">
	<div class="nome-centralizado">
		<p><strong>Carolina Amo Você</strong></p>
	</div>
	<div id="containerTextos">
		{#each capitulos as capitulo}
			<div class="capitulo" data-id={capitulo.id}>
				<h2>{capitulo.titulo}</h2>
				<p>{capitulo.texto}</p>
				<div class="reactions">
					<button class="copy-button" on:click={() => handleCopy(capitulo.texto)}>Copiar</button>
					<button class="like-button" on:click={() => handleLike(capitulo.id)}>Curtir</button>
					<span class="likes-count">{capitulo.likes}</span>
				</div>
			</div>
		{/each}
	</div>

	<!-- Mostra o contador de visitas -->
	<div class="visit-counter">
		<p>Total de Visitas: {visitCount}</p>
	</div>
</div>

{#if showNotification}
	<div class="notification">{notificationMessage}</div>
{/if}
