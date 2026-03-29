import React from 'react'

export const Debug = () => {
  console.log("Debug component loaded");
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'black',
      color: 'lime',
      padding: '1rem',
      fontFamily: 'monospace',
      fontSize: '0.8rem',
      maxHeight: '200px',
      overflow: 'auto',
      zIndex: 9999
    }}>
      <div>App is running!</div>
      <div>Check Full Console (F12) for detailed logs</div>
    </div>
  )
}
