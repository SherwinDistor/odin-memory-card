import { useState, useEffect } from 'react';

function App() {
	const [pokemon, setPokemon] = useState([]);
	const [clicked, setClicked] = useState({});
	const [highScore, setHighScore] = useState(0);

	useEffect(() => {
		let ignore = false;
		let count = 1;

		while (count <= 5) {
			async function fetchPokemon() {
				const random = Math.floor(Math.random() * 500);

				const response = await fetch(
					`https://pokeapi.co/api/v2/pokemon/${random}/`
				);
				const data = await response.json();

				if (!ignore) {
					setPokemon((pokemon) => [...pokemon, data]);
				}
			}

			fetchPokemon();
			count++;
		}

		return () => {
			ignore = true;
		};
	}, []);

	return (
		<div className=''>
			<h1>Pokemon Memory Game</h1>
			<p>
				Score points for every <em>different</em> pokemon clicked
			</p>
			<ul className='flex gap-4 justify-center items-center '>
				{pokemon.map((poke) => (
					<li key={poke.id} className='bg-blue-300 rounded-lg'>
						<img src={poke.sprites.front_default} alt={poke.name} />
					</li>
				))}
			</ul>
		</div>
	);
}

export default App;
