import { useState, useEffect } from 'react';

export default function App() {
	const [pokemon, setPokemon] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [clicked, setClicked] = useState([]);
	const [highScore, setHighScore] = useState(0);
	const [score, setScore] = useState(0);
	const [fetchNewPokemon, setFetchNewPokemon] = useState(true);
	const [error, setError] = useState(null);
	const [gameState, setGameState] = useState(0);

	useEffect(() => {
		setIsLoading(true);
		let ignore = false;
		let count = 1;
		let duplicate = [];

		while (count <= 5) {
			async function fetchPokemon() {
				let random = Math.floor(Math.random() * 1000 + 1);
				// Check to see if there are duplicate random ids
				if (duplicate.includes(random)) {
					random += 5;
				}
				duplicate.push(random);

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
			duplicate = [];
		};
	}, [fetchNewPokemon]);

	function handleClick(e) {
		console.log(e.currentTarget.id);

		if (clicked.includes(e.currentTarget.id)) {
			console.log('Game Over');
			setGameState(2);

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

		// win condition
		if (newScore == 5) {
			setGameState(1);
			setScore(0);
			setClicked([]);
			setPokemon([]);
			setFetchNewPokemon(!fetchNewPokemon);
			console.log('triggered');
			return;
		}
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

	function handleGameState() {
		setGameState(0);
	}

	if (error) return <p>A network error was encountered</p>;

	return (
		<>
			{gameState >= 1 ? (
				<div className='h-screen w-screen fixed z-10 bg-slate-400/75'>
					<div className='z-20 fixed rounded-lg bg-slate-700 top-1/2 left-1/2 -translate-1/2 px-24 py-16 text-center'>
						<h2 className='text-4xl mb-4'>
							{gameState == 1 ? 'You win!' : 'Game Over :('}
						</h2>
						<p className='text-lg mb-2'>Play again?</p>
						<div className='flex justify-center gap-8'>
							<button
								className='rounded-lg px-4 py-1 bg-green-400 hover:bg-green-300'
								onClick={handleGameState}
								value={0}
							>
								Yes
							</button>
						</div>
					</div>
				</div>
			) : (
				''
			)}
			<div className='h-screen flex flex-col justify-center gap-10 pb-20 z-0'>
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
		</>
	);
}
