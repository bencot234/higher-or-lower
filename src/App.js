import './App.css'
import axios from 'axios'
import data from './data'
import { useState, useEffect } from 'react'
import ScoreModal from './ScoreModal'

const getLocalStorage = () => {
	let topScore = JSON.parse(localStorage.getItem('topScore'))
	if (topScore) {
		return topScore;
	}
	return 0;
}

function App() {
	// 1. have initial random card
	// 2. when you click button a new card shows up next the the initial card
	// 3. compare the value of the new card and the initial card
	// 4. if the value of the new card is greater than the initial card, set the new card as the new value for the initial card, add 1 to the score
	// 5. if the cards values are the same, show message 'the cards are the same!'. dont give any points
	// 6. if the initial card value is greater than the the new card, show score. game over. give option to play again

	const [initialCard, setInitialCard] = useState(null);
	const [nextCard, setNextCard] = useState({});
	const [showNextCard, setShowNextCard] = useState(false);
	const [message, setMessage] = useState('');
	const [points, setPoints] = useState(0);
	const [disabled, setDisabled] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [deckId, setDeckId] = useState('');
	const [showButton, setShowButton] = useState(true);
	const [anotherGame, setAnotherGame] = useState(false);
	const [topScore, setTopScore] = useState(getLocalStorage());


	const fetchDeck = async () => {
		try {
			const response = await axios('https://www.deckofcardsapi.com/api/deck/new/shuffle/')
			const newDeck = await response.data;
			const newDeckId = newDeck.deck_id;
			setDeckId(newDeckId);
		} catch (err) {
			console.log(err)
		}
	}

	const drawInitialCards = async () => {
		try {
			const response = await axios(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
			const cards = await response.data.cards;
			setInitialCard(cards[0])
			setNextCard(cards[1])
		} catch (error) {
			console.log(error)
		}
	}

	const drawNextCard = async () => {
		try {
			const response = await axios(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
			const card = await response.data.cards[0];
			setNextCard(card)
		} catch (error) {
			console.log(error)
		}
	}
 
	const beginGame = () => {
		drawInitialCards()
		setDisabled(false)
		setPoints(0)
		setShowButton(false)
		setShowModal(false)
		setShowNextCard(false)
	}

	useEffect(() => {
		fetchDeck()
	}, [])

	const rightGuess = () => {
		console.log('right')
		setPoints((oldPoints) => {
			return oldPoints + 1;
		})
		setTimeout(() => {
			setInitialCard(nextCard)
			setShowNextCard(false)
			drawNextCard();
			setDisabled(false)
		}, 3000)
	}

	const numerizeValue = (value) => {
			if (value === 'KING') value = 13;
			if (value === 'QUEEN') value = 12;
			if (value === 'JACK') value = 11;
			if (value === 'ACE') value = 1;

		return value;
	}

	const sameGuess = () => {
		console.log('same')
		setMessage('The values are the same!')
		setTimeout(() => {
			setMessage('')
			drawNextCard();
		}, 3000)
	}

	const wrongGuess = () => {
		console.log('wrong')
		setShowModal(true)
		setDisabled(true)
		setShowButton(true)
		setAnotherGame(true)
		if (points > topScore) {
			localStorage.setItem('topScore', JSON.stringify(points))
		}
	}

	const compareValues = async (guess) => {
		setShowNextCard(true)
		const initialCardValue = numerizeValue(initialCard.value)
		const nextCardValue = numerizeValue(nextCard.value)

		if (initialCardValue < nextCardValue) {
			guess === 'higher' ? rightGuess() : wrongGuess()
		}
		if (initialCardValue > nextCardValue) {
			guess === 'lower' ? rightGuess() : wrongGuess()
		}
		if (initialCardValue === nextCardValue) {
			sameGuess()
		}
	}

	return (
		<main>
			<p>topscore: {topScore}</p>
			{showModal && <ScoreModal points={points}/>}
			<p>higher...? or lower?</p>
			
			<p>{message}</p>
			<p>points: {points}</p>
			<button className={`${showButton ? 'show' : 'hide'}  btn`} onClick={beginGame}>{anotherGame ? 'play again' : 'begin'}</button>
			<div className="cards-container">
				{initialCard &&
					<div>
						<img src={initialCard.image} alt="initial card" />
					</div>
				}
				{nextCard && 
					<div className={`${showNextCard ? 'show' : 'hide'}`}>
						<img src={nextCard.image} alt="next card" />
					</div>
				}

			</div>
			<button className="btn" disabled={disabled} onClick={() => compareValues('higher')}>higher</button>
			<button className="btn" disabled={disabled} onClick={() => compareValues('lower')}>lower</button>
		</main>
	);
}

export default App;
