type Player = {
    id: string
    name: string
    icon: string
}

type PlayerStatus = Player & {
    ready: boolean
    filled: boolean
    loaded: boolean
  }

type PlayerGameState = Player & {
    dice: number[]
    turn: boolean //turn to play
    target: boolean
}

type Lobby = {
    lobbyId: string
    lobbyName: string
    initialAmount: number
    openLobby: boolean
    spectator: boolean
    reroll: boolean
    playerList?: PlayerStatus[]
}
