import React from 'react'
import { useSelector } from 'react-redux';
import Confetti from './lottie/Confetti';

const ConfettiBox = () => {

  // ? store
  const confet = useSelector(state => state.confetti);
  const panelSize = useSelector(state => state.panelSize);
  const mascotSettings = useSelector(state => state.mascotSettings);

  if (!mascotSettings) return null;

  return (
    <div
      style={{
        width: mascotSettings.size.width,
        height: mascotSettings.size.height,
        position: "absolute",
        top: panelSize.up,
        zIndex: 200,
        pointerEvents: confet ? "auto" : "none"
      }}
    >
      <Confetti start={confet} />
    </div>
  )
}

export default ConfettiBox;