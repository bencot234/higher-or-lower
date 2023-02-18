import './App.css';
import cards from './data';
import { useState, useEffect } from 'react';
import ScoreModal from './ScoreModal';

function App() {
  // 1. have initial random card
  // 2. when you click button a new card shows up next the the initial card
  // 3. compare the value of the new card and the initial card
  // 4. if the value of the new card is greater than the initial card, set the new card as the new value for the initial card, add 1 to the score
  // 5. if the cards values are the same, show message 'the cards are the same!'. dont give any points
  // 6. if the initial card value is greater than the the new card, show score. game over. give option to play again

  const [card, setCard] = useState(cards[0]);
  const [newCard, setNewCard] = useState(cards[0]);
  const [showNewCard, setShowNewCard] = useState(false);
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getRandomCard();
  }, [])

  const getRandomCard = () => {
    const randomCardIndex = Math.floor(Math.random() * cards.length);

    setCard(cards[randomCardIndex]);
  }

  const getNewRandomCard = () => {
    const randomCardIndex = Math.floor(Math.random() * cards.length);

    setNewCard(cards[randomCardIndex]);
  }

  const success = () => {
    setShowNewCard(true)
    setPoints((oldPoints) => {
      return oldPoints + 1;
    })
    setDisabled(true)
    setTimeout(() => {
      setCard(newCard)
      setShowNewCard(false)
      getNewRandomCard();
      setDisabled(false)
    }, 3000)
  }

  const checkHigher = () => {
    if (card.value > newCard.value) {
      console.log('wrong')
      setShowModal(true)
      setDisabled(true)
    }
    if (card.value < newCard.value) {
      console.log('right')
      success()
    }
    if (card.value === newCard.value) {
      console.log('same')
      getNewRandomCard();
    }
  }

  const checkLower = () => {
    if (card.value < newCard.value) {
      console.log('wrong')
      setShowModal(true)
      setDisabled(true)
    }
    if (card.value > newCard.value) {
      console.log('right')
      success()
    }
    if (card.value === newCard.value) {
      console.log('same')
      getNewRandomCard();
    }
  }

  return (
    <>
      {showModal && <ScoreModal points={points}/>}
      <p>higher...? or lower?</p>
      <p>{message}</p>
      <p>points: {points}</p>
      <div>
        <p>{card.value}</p>
        <p className={`${showNewCard ? 'show-new-card' : 'hide-new-card'}`}>{newCard.value}</p>
      </div>
      <button disabled={disabled} onClick={checkHigher}>higher</button>
      <button disabled={disabled} onClick={checkLower}>lower</button>
    </>
  );
}

export default App;
