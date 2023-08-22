import { FC } from 'react'

interface DieProps {
  face: number
  size: number
  reveal: boolean
  rotation?: boolean
  customStyle? : {}
}

const Die: FC<DieProps> = ({face, size, reveal, rotation, customStyle}) => {
    const styles = {
        height: size,
        width: size,
        rotate: rotation ? Math.floor(Math.random() * 360) + "deg" : 0 + "deg",
        borderRadius: size/10
    }
    const dotStyles = {
        height: size/6,
        width: size/6,
    }
    console.log("CHANGE")
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