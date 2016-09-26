var Pokemon = function(){
  this.name = '';
  this.sprites = {front_default:  ''};
  this.abilites = [];
  this.types = [];
  this.stats = [];
}

var Pokedex = React.createClass({
  getInitialState: function() {
    return {originalList: [], filteredList: [], selectedPokemon: null};
  },
  componentWillMount: function() {
      this.loadPokemonList();
  },
  loadPokemonList: function(){
    // The initial API call for the full pokemon list
    console.log('loading pokemon list');
    $.ajax({
        url: this.props.url + "?limit=820",
        dataType: 'json',
        cache: true,
        success: function(data){
          console.log("loaded pokemon list from API",data);
          // The original and filtered lists are the same since no search has been
          // performed at this point
          this.setState({originalList: data.results, filteredList: data.results})
        }.bind(this),
        error: function(xhr, status, err) {
           console.log("error")
           console.error(this.props.url, status, err.toString());
        }.bind(this),
         timeout:1000
    });
  },

  handlePokemonClick: function(pokemon) {
    // console.log(pokemon)

   console.log('handlePokemonClick:',pokemon.target.innerHTML)
   var selected= pokemon.target.innerHTML
   //  (add a selectedPokemon variable to the state)
    // this.setState({selectedPokemon: selected})
    // Implement the AJAX calls and state change when an entry in the list is clicked
    var that=this
     $.ajax({
        url: this.props.url +selected,
        dataType: 'json',
        cache: true,
        success: function(data){
          that.setState({selectedPokemon: data})

        }.bind(this),
        error: function(xhr, status, err) {
           console.log("error")
           console.error(this.props.url, status, err.toString());
        }.bind(this),
         timeout:10000
    });
      
  },

  handlePokemonSearch: function(name){
   // Implement the state change when the user fills an input in the search field
    var newFilteredList= this.state.originalList.filter(function(poke){
        return poke.name.includes(name)
        });
    // If the search field is cleared, set filteredList to be equal to originalList
    // Otherwise use the array filter method to update the filteredList

    name ? this.setState({filteredList:newFilteredList}) : this.setState({filteredList:this.state.originalList})

 

  },

  render: function(){
    return (
      <div className = "pokedex">
        <img id="imgHeader" src="../img/pokeimage.png" />
        <h1> ReactJS Pokedex </h1>

   <div className="col-md-4">
           <PokemonSearch onChange = {this.handlePokemonSearch} />
           <PokemonList onClick = {this.handlePokemonClick} data = {this.state.filteredList} />
         </div>

    <div className="col-md-offset-1 col-md-6">
           <PokemonInfo  pokemon={this.state.selectedPokemon}/>
        </div>
      </div>
    );
  }
});


var PokemonInfo = React.createClass({
  getInitialState: function() {

    // Creating a blank pokemon since none had been selected
    // when the app starts
    var blankPoke = new Pokemon();
    return {pokemon: blankPoke};
  },
  render: function() {
    var pokemon;
    if (this.props.pokemon){
      pokemon = this.props.pokemon;
    } else {
      pokemon = this.state.pokemon;
    }

      // Use the Pokemon object and create lists 
      // from the the types property (an array)
      // and the stats propery (also an array)
    return (
      <div>
        <h2>{pokemon.name} </h2>
        <img className="pokeimage" src={pokemon.sprites.front_default} alt="Pokemon Image" />
        <h4> Type: </h4>
        <ul>
          {pokemon.types.map((a,i)=> <li className= {a.type.name
        } key={'type#'+i}>{a.type.name
        }</li>)}
        </ul>
        <h4> Stats: </h4>
        <ul>
        {pokemon.stats.map((a,i)=> <li key={i}>{a.stat.name}{' '}{a.base_stat
}</li>)}
        </ul>
      </div>
    )
  }
})

var PokemonSearch = React.createClass({
  getInitialState: function() {
    return { pokemon: ''};
  },
  handlePokemonChange: function(e) {
    // Use props to pass call the appropriate method of Pokedex
      var input= e.target.value.toLowerCase();
      this.setState({pokemon: input});
      this.props.onChange(input);
  },
  render: function() {
    return (
      <input className="form-control"
        type="text"
        placeholder="Pokemon name"
        value={this.state.pokemon}
        onChange={this.handlePokemonChange}
      />
    )
  }
})

var PokemonList = React.createClass({
  handleClick: function(pokemon){
    
    this.props.onClick(pokemon)
      // Use props to call the appropriate function of Pokedex
  },
  render: function() {

    if (this.props.data.length === 0){
      return null;
    }
    // Sorting alphabetically
    this.props.data.sort(function(firstPoke, secondPoke){
      return firstPoke.name > secondPoke.name ? 1 : -1;
    });
    // Saving 'this' context for use in the callback function provided for 'onClick'
    var that = this;
    // Creating an HTML list of all the pokemon

    var pokemonNodes = this.props.data.map(function(pokemon, index){
      return(
        // Add an onClick using bind
        <li onClick= {that.handleClick}  className="list-group-item list-group-item-action" key = {index}>
           {pokemon.name}
        </li>
      );
    });

    return (
      <ul className = "list-group pokemonList">
        {pokemonNodes}
      </ul>
    )
  }
})



 
ReactDOM.render(

  <Pokedex url="http://pokeapi.co/api/v2/pokemon/" />,

  document.getElementById('content')
);
