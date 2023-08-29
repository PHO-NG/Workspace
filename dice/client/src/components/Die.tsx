import { FC } from 'react'

interface DieProps {
  face: number
  size: number
  reveal: boolean
  rotation?: number
  customStyle? : {}
  diceStyle? : {}
}

const Die: FC<DieProps> = ({face, size, reveal, rotation, customStyle, diceStyle}) => {
    let styles = {
        height: size,
        width: size,
        rotate: rotation ? rotation * 60 + "deg" : 0 + "deg",
        borderRadius: size/10,
        ...diceStyle
    }
    let dotStyles = {
        height: size/5.5,
        width: size/5.5,
    }

  return <>
  <div style={customStyle}>
    <div className={`relative border-2 border-black bg-white`} style={styles}>
        {reveal == true && 
            <div>
                {(face == 1 || face == 3 || face == 5) && // middle dot
                    <div className="absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 border-2 border-black bg-black rounded-full" style={dotStyles}></div> 
                }
                {(face != 1) && // top right dot + bottom left dot
                    <div>
                        <div className="absolute top-1/4 left-3/4 -translate-y-2/4 -translate-x-2/4 border-2 border-black bg-black rounded-full" style={dotStyles}></div>
                        <div className="absolute top-3/4 left-1/4 -translate-y-2/4 -translate-x-2/4 border-2 border-black bg-black rounded-full" style={dotStyles}></div>  
                    </div>
                }
                {(face == 4 || face == 5 || face == 6) && // top left dot + bottom right dot
                    <div>
                        <div className="absolute top-1/4 left-1/4 -translate-y-2/4 -translate-x-2/4 border-2 border-black bg-black rounded-full" style={dotStyles}></div>
                        <div className="absolute top-3/4 left-3/4 -translate-y-2/4 -translate-x-2/4 border-2 border-black bg-black rounded-full" style={dotStyles}></div>  
                    </div>
                }
                {(face == 6) && // middle left dot + middle right dot
                    <div>
                    <div className="absolute top-2/4 left-3/4 -translate-y-2/4 -translate-x-2/4 border-2 border-black bg-black rounded-full" style={dotStyles}></div>
                    <div className="absolute top-2/4 left-1/4 -translate-y-2/4 -translate-x-2/4 border-2 border-black bg-black rounded-full" style={dotStyles}></div>  
                </div>
                }
            </div>
        }
    </div>
  </div>
  </>
}

export default Die