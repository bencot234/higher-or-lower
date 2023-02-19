import React from 'react'

const ScoreModal = ({points, topScore}) => {
  return (
    <div className="game-over">
      <p>game over!</p> your score is {points}
      <p>top score is {topScore}</p>
    </div>
  )
}

export default ScoreModal
