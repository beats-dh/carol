<script>
	import '../app.css';
	import '../lib/styles.css';
	import { onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { db, ref, onValue, runTransaction, set } from '../lib/firebaseConfig';

	let capitulos = [];
	let userIp = '';
	let userId;
	let showNotification = false;
	let notificationMessage = '';

	onMount(async () => {
		if (typeof window !== 'undefined') {
			userId = localStorage.getItem('user_id') || uuidv4();

			if (!localStorage.getItem('user_id')) {
				localStorage.setItem('user_id', userId);
			}

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
		}
	});

	async function handleLike(capituloId) {
		if (typeof window !== 'undefined') {
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
		}
	}

	function handleCopy(text) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				showNotificationWithMessage('Texto copiado!');
			})
			.catch((err) => {
				console.error('Erro ao copiar texto: ', err);
			});
	}

	function showNotificationWithMessage(message) {
		notificationMessage = message;
		showNotification = true;
		setTimeout(() => {
			showNotification = false;
		}, 3000);
	}
</script>

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
</div>

{#if showNotification}
	<div class="notification">{notificationMessage}</div>
{/if}
