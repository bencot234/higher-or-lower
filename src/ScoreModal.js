import React from 'react'

const ScoreModal = ({points}) => {
  return (
    <div className="game-over">
      <p>game over!</p> your score is {points}
    </div>
  )
}

export default ScoreModal
