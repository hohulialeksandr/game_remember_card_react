import './App.css';
import { useState, useEffect } from 'react';

import axe from './icon/minecraft-axe.png';
import pickaxe from './icon/minecraft-pickaxe.png';
import shovel from './icon/minecraft-shovel.png';
import sword from './icon/minecraft-sword.png';
import main from './icon/minecraft-main-character.png';
import zombie from './icon/minecraft-zombie.png';

import diamond from './icon/minecraft-diamond.png';
import win from './icon/win.png'

const initialCard = [
  { id: 1, img: axe },
  { id: 2, img: pickaxe },
  { id: 3, img: shovel },
  { id: 4, img: sword },
  { id: 5, img: main },
  { id: 6, img: zombie },
]

const pairOfCard = [...initialCard, ...initialCard];

const App = () => {

  const [card, setCard] = useState([]);
  const [opened, setOpened] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [openLoading, setOpenLoading] = useState(false);
  const [victory, setVictory] = useState(false);

  

  const shuffle = (array) => {
    let currentIndex = array.length,
      tempararyValue,
      randomIndex

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      tempararyValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = tempararyValue
    }
    return array
  }

  useEffect(() => {
    setCard(shuffle(pairOfCard))
  }, []);

  const flipCard = (index) => () => {
    setOpened(opened => [...opened, index])
    setMoves(prevMove => prevMove + 1)
  }

  useEffect(() => {
    if (opened.length < 2) return
    const firstMatched = card[opened[0]];
    const secondMatched = card[opened[1]];

    if (secondMatched && firstMatched.id === secondMatched.id) {
      setMatched([...matched, firstMatched.id])
    }
    setOpenLoading(true);
    if (opened.length === 2) setTimeout(() => {setOpened([]); setOpenLoading(false)}, 500)
  }, [opened]);

  useEffect(() => {
    matched.length === 6 && setVictory(true)  
  }, [matched])

  useEffect(() => {
    if (victory === true) {
      if (!localStorage.getItem('score')) localStorage.setItem('score', moves) 
      if (localStorage.getItem('score') > moves)
      localStorage.setItem('score', moves)
    } 
  }, [victory])

  const handleGameRestart = () => {
    setCard(shuffle(pairOfCard));
    setOpened([]);
    setMatched([]);
    setMoves(0);
    setVictory(false);
  }
  
  console.log(matched, victory)
  return (
    <div className="App">
      <p className='number-of-strokes'>Сделано ходов: {moves}</p>
      {victory ? <img className='victory' src={win} width='750px' alt=''/> : <div className='cards'>
        {card.map((item, index) => {
          let isFlipped = false;

          if (opened.includes(index)) isFlipped = true
          if (matched.includes(item.id)) isFlipped = true

          return (
            <div
              key={index}
              className={`card ${isFlipped ? 'flipped' : ''}`}
              onClick={opened.includes(index) || matched.includes(item.id) || openLoading ? () => { } : flipCard(index)}>
              <div className='inner'>
                <div className='front'>
                  <img src={item.img} width='180' alt='front_card' />
                </div>
                <div className='back'>
                  <img src={diamond} alt='diamond_mark' />
                </div>
              </div>
            </div>
          )
        })}
      </div>}
      <button className='button-restart' onClick={handleGameRestart} >Начать заново</button>
      {
        localStorage.getItem('score') && 
        <p className='number-of-strokes'>Рекорды: {localStorage.getItem('score')}</p>
      }
    </div>
  )
}

export default App;