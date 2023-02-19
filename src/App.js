import './App.css'
import axios from 'axios'
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
	const [initialCard, setInitialCard] = useState(null);
	const [nextCard, setNextCard] = useState({});
	const [showNextCard, setShowNextCard] = useState(false);
	const [message, setMessage] = useState('');
	const [points, setPoints] = useState(0);
	const [disabled, setDisabled] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [deckId, setDeckId] = useState('');
	const [showButton, setShowButton] = useState(true);
	const [showButtons, setShowButtons] = useState(false);
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
		setShowButtons(true)
	}

	useEffect(() => {
		fetchDeck()
	}, [])

	const rightGuess = () => {
		setPoints((oldPoints) => {
			return oldPoints + 1;
		})
		setDisabled(true)
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
		setMessage('The values are the same!')
		setDisabled(true)
		setTimeout(() => {
			setShowNextCard(false)
			setMessage('')
			drawNextCard();
			setDisabled(false)
		}, 3000)
	}

	const wrongGuess = () => {
		setDisabled(true)
		setTimeout(() => {
			setShowModal(true)
			setShowButton(true)
			setAnotherGame(true)
			if (points > topScore) {
				setTopScore(points)
				localStorage.setItem('topScore', JSON.stringify(points))
			}
		}, 1000)
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
			<p className='title'>higher...? or lower?</p>
			{showModal && <ScoreModal points={points} topScore={topScore}/>}
			
			<p>{message}</p>
			<p className='top-score'>top score: {topScore}</p>
			<p className='points'>points: {points}</p>
			<button className={`${showButton ? 'show' : 'hide'}  btn begin-btn`} onClick={beginGame}>{anotherGame ? 'play again' : 'begin'}</button>
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
			<div className={showButtons ? 'show' : 'hide'}>
				<button className="btn" disabled={disabled} onClick={() => compareValues('higher')}>higher</button>
				<button className="btn" disabled={disabled} onClick={() => compareValues('lower')}>lower</button>

			</div>
		</main>
	);
}

export default App;
