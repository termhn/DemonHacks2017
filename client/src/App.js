import React from 'react'
import Typer from './Typer'
import api from './api'

import './App.css'

const data = `# loads object
sub load
{
  my $flds = $c->db_load($id,@_) || do {
    Carp::carp "Can't load (class: $c, id: $id): '$!'"; return undef
  };
  my $o = $c->_perl_new();
  $id12 = $id / 24 / 3600;
  $o->{'ID'} = $id12 + 123;
  #$o->{'SHCUT'} = $flds->{'SHCUT'};
  my $p = $o->props;
  my $vt;
  $string =~ m/^sought_text$/;
  $items = split //, 'abc';
  $string //= "bar";
  for my $key (keys %$p)
  {
    if(\${$vt.'::property'}) {
      $o->{$key . '_real'} = $flds->{$key};
      tie $o->{$key}, 'CMSBuilder::Property', $o, $key;
    }
  }
  $o->save if delete $o->{'_save_after_load'};

  # GH-117
  my $g = glob("/usr/bin/*");

  return $o;
}

__DATA__
@@ layouts/default.html.ep
<!DOCTYPE html>
<html>
  <head><title><%= title %></title></head>
  <body><%= content %></body>
</html>
__END__

=head1 NAME
POD till the end of file`

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      gameStage: 'home',
      gameId: -1,
      gameCanStart: false,
      errorMessage: '',
      playerId: -1,
      counter: 5,
      otherPlayerState: {}
    }
    api.onPlayerStateChanged(this.onPlayerStateChanged.bind(this))
  }
  createGameClicked () {
    this.setState({
      ...this.state,
      gameStage: 'creating'
    })
    api.createNewGame()
    api.onNewGameCreated(this.gameCreated.bind(this))
  }
  gameCreated (data) {
    this.setState({
      ...this.state,
      gameStage: 'host',
      playerId: data.socketId,
      gameId: data.gameId
    })
    api.onPlayerJoinedRoom(this.playerJoinedHost.bind(this))
  }
  playerJoinedHost (data) {
    this.setState({
      ...this.state,
      gameCanStart: true
    })
  }
  joinGameClickedHome () {
    this.setState({
      ...this.state,
      gameStage: 'join'
    })
  }
  joinGameClicked (e) {
    e.persist()
    e.preventDefault()
    this.setState({
      ...this.state,
      gameStage: 'joining'
    })
    const id = e.target[0].value
    api.playerJoinGame(id)
    api.onPlayerJoinedRoom(this.playerJoinedPlayer.bind(this))
    api.onPlayerFailedToJoinGame(this.playerFailedToJoin.bind(this))
  }
  playerFailedToJoin (message) {
    this.setState({
      ...this.state,
      gameStage: 'error',
      errorMessage: message
    })
  }
  playerJoinedPlayer (data) {
    this.setState({
      ...this.state,
      gameId: data.gameId,
      playerId: data.socketId,
      gameStage: 'lobby'
    })
    api.onCountdownReceived(this.countDown.bind(this))
    api.onGameStarted(this.gameStarted.bind(this))
  }
  startGameClicked () {
    api.startCountdown(this.state.gameId)
    api.onCountdownReceived(this.countDown.bind(this))
    api.onGameStarted(this.gameStarted.bind(this))
  }
  countDown (count) {
    this.setState({
      ...this.state,
      gameStage: 'countdown',
      counter: count
    })
  }
  gameStarted () {
    this.setState({
      ...this.state,
      gameStage: 'main'
    })
  }
  playerStateChanged (newState) {
    api.playerStateChanged(this.state.gameId, this.state.playerId, newState)
  }
  onPlayerStateChanged (gameId, playerId, state) {
    console.log('changed')
    if (playerId !== this.state.playerId) {
      this.setState({
        ...this.state,
        otherPlayerState: state
      })
    }
  }
  render () {
    if (this.state.gameStage === 'home') {
      return (
        <div className='App' >
          <h1 className='homeName' >Demon Typer</h1>
          <button className='btnCre' onClick={this.createGameClicked.bind(this)}>Create Game</button>
          <button className='btnJoin' onClick={this.joinGameClickedHome.bind(this)}>Join Game</button>
        </div>
      )
    } else if (this.state.gameStage === 'host') {
      return (
        <div className ='App'>        
          <h3 className = 'cGame'>Game ID:</h3>
          <div className = 'gameID'>
            {this.state.gameId}
          </div>
          <div className='btnDIV'>
            <button className ='btnStart' disabled={!this.state.gameCanStart} onClick={this.startGameClicked.bind(this)}>Start Game</button>
          </div>
        </div>
      )
    } else if (this.state.gameStage === 'creating') {
      return (
        <div className='App'>
          <h3 className='cGame'>Creating game, please wait</h3>
        </div>
      )
    } else if (this.state.gameStage === 'join') {
      return (
        <div className ='App'>        
          <h3 className='cGame'>Input Game ID:</h3>
          <form onSubmit={this.joinGameClicked.bind(this)}>
            <div className='btnDIV2'>
              <input className='inBox' type='text' />
              <button className='btnJoin2' type='submit'>Join Game</button>
            </div>
          </form>
        </div>
      )
    } else if (this.state.gameStage === 'joining') {
      return (
        <h3>Joining game, please wait</h3>
      )
    } else if (this.state.gameStage === 'error') {
      return (
        <h3>{this.state.errorMessage}</h3>
      )
    } else if (this.state.gameStage === 'lobby') {
      return (
        <div className='App'>
          <h3 className='cGame'>Game {this.state.gameId} joined, waiting for host.</h3>
        </div>
      )
    } else if (this.state.gameStage === 'countdown') {
      return (
        <div className='App'>
          <h3 className='cGame'>Game starting in {this.state.counter}</h3>
        </div>
      )
    } else if (this.state.gameStage === 'main') {
      return (
        <div>
        <div className='score'>
        </div>
        <div>
          <div className='typer-left'>
            <Typer codeData={data} onStateChange={this.playerStateChanged.bind(this)} />
          </div>
          <div className='typer-right'>
            <Typer codeData={data} isRemote remoteState={this.state.otherPlayerState} />
          </div>
        </div>
        </div>
      )
    }
  }
}

export default App
