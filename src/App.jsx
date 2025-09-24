import { useState, useEffect } from 'react';

function App() {
	const [pokemon, setPokemon] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [clicked, setClicked] = useState([]);
	const [highScore, setHighScore] = useState(0);
	const [score, setScore] = useState(0);
	const [fetchNewPokemon, setFetchNewPokemon] = useState(true);

	useEffect(() => {
		let ignore = false;
		let count = 1;

		while (count <= 5) {
			async function fetchPokemon() {
				const random = Math.floor(Math.random() * 500 + 1);

				const response = await fetch(
					`https://pokeapi.co/api/v2/pokemon/${random}/`
				);
				const data = await response.json();

				if (!ignore) {
					// if by chance the same pokemon was fetched

					setPokemon((pokemon) => [...pokemon, data]);
				}
			}

			fetchPokemon();
			count++;
		}

		return () => {
			ignore = true;
			setIsLoading(false);
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

	return (
		<div>
			<header className='text-center'>
				<h1>Pokemon Memory Game</h1>
				<p>
					Score points for every <em>different</em> pokemon clicked
				</p>
			</header>
			<div>
				Score: {score} High Score: {highScore}
			</div>
			<ul className='flex gap-4 justify-center items-center flex-wrap'>
				{isLoading
					? 'Loading'
					: pokemon.map((poke) => (
							<li
								key={poke.id}
								className='bg-blue-300 rounded-lg'
								onClick={handleClick}
								id={poke.id}
							>
								<img src={poke.sprites.front_default} alt={poke.name} />
								<p className='text-center'>{poke.name}</p>
							</li>
					  ))}
			</ul>
		</div>
	);
}

export default App;
