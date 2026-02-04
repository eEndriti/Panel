import React from 'react'
import { CircleLoader } from 'react-spinners'

const Loader = () => {
  return (
    <div style={{ 
                              display: 'flex', 
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              height: '70vh',
                              width: '100%' 
                          }}>
                        <CircleLoader color='#1502ec' size={60} />
                      </div>
  )
}

export default Loader