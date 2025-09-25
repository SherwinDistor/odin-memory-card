import { useState, useEffect } from 'react';

function App() {
	const [pokemon, setPokemon] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [clicked, setClicked] = useState([]);
	const [highScore, setHighScore] = useState(0);
	const [score, setScore] = useState(0);
	const [fetchNewPokemon, setFetchNewPokemon] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		setIsLoading(true);
		let ignore = false;
		let count = 1;

		while (count <= 5) {
			async function fetchPokemon() {
				const random = Math.floor(Math.random() * 500 + 1);

				try {
					const response = await fetch(
						`https://pokeapi.co/api/v2/pokemon/${random}/`
					);

					if (response.status >= 400) {
						throw new Error('Server error code: ' + response.status);
					}

					const data = await response.json();

					if (!ignore) {
						// if by chance the same pokemon was fetched

						setPokemon((pokemon) => [...pokemon, data]);
					}
				} catch (err) {
					setError(err);
				} finally {
					setIsLoading(false);
				}
			}

			fetchPokemon();
			count++;
		}

		return () => {
			ignore = true;
		};
	}, [fetchNewPokemon]);

	function handleClick(e) {
		console.log(e.currentTarget.id);

		if (clicked.includes(e.currentTarget.id)) {
			console.log('Game Over');

			setScore(0);
			setClicked([]);

			console.log('Pull new deck');
			setPokemon([]);
			setFetchNewPokemon(!fetchNewPokemon);

			return;
		}

		setClicked([...clicked, e.currentTarget.id]);

		const newScore = score + 1;
		setScore(newScore);

		if (newScore > highScore) {
			setHighScore(newScore);
		}
		// add win condition

		console.log('shuffle deck');
		shuffle();
	}

	function shuffle() {
		let size = pokemon.length - 1;

		const randomIndex = Math.floor(Math.random() * size);

		const newDeck = [...pokemon];

		while (size >= 0) {
			const temp = newDeck[randomIndex];
			newDeck[randomIndex] = newDeck[size];
			newDeck[size] = temp;
			size--;
		}

		setPokemon(newDeck);
	}

	if (error) return <p>A network error was encountered</p>;

	return (
		<div className='h-screen flex flex-col justify-center gap-10 pb-20'>
			<header className='text-center  bg-slate-400/50 rounded-lg'>
				<h1 className='text-xl'>Pokemon Memory Game</h1>
				<p className='text-lg'>
					Score points for every <em>different</em> pokemon clicked
				</p>
				<div className='text-lg flex gap-8 justify-center'>
					<div>Score: {score}</div>
					<div>High Score: {highScore}</div>
				</div>
			</header>
			<ul className='flex gap-4 justify-center flex-wrap'>
				{isLoading
					? 'Loading...'
					: pokemon.map((poke) => (
							<li
								key={poke.id}
								className='bg-slate-400/50 rounded-lg w-32 h-40 flex flex-col justify-center hover:bg-slate-300/50'
								onClick={handleClick}
								id={poke.id}
							>
								<img src={poke.sprites.front_default} alt={poke.name} />
								<p className='text-center pb-2'>{poke.name}</p>
							</li>
					  ))}
			</ul>
		</div>
	);
}

export default App;
