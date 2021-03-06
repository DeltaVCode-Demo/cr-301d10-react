import axios from 'axios';
import React from 'react';
import './App.css';

const apiUrl = process.env.REACT_APP_API_URL;

class App extends React.Component {
  // instead of constructor/super
  // assign initial state as class property
  state = {
    q: null,
    location: null,
  };

  handleSearch = async event => {
    // avoid making new GET request
    event.preventDefault();

    let form = event.target;
    let input = form.elements.search;
    let q = input.value;
    console.log(q);

    // assign q in state to be value of q
    this.setState({ q, location: null });

    const url = `https://us1.locationiq.com/v1/search.php`;

    // without await, response would be a Promise of future data
    const response = await axios.get(url, {
      // query string parameters
      params: {
        // get key from environment variables
        key: process.env.REACT_APP_LOCATION_KEY,
        q, // variable already has correct name
        format: 'json',
      }
    });
    console.log(response);

    const location = response.data[0];
    this.setState({ location });

    this.getShoppingList(location);
    this.getPhotos(q);
  };

  getPhotos = async (query) => {
    const response = await axios.get(`${apiUrl}/photo`, {
      params: {
        q: query,
      },
    });

    this.setState({ photos: response.data });
  }

  getShoppingList = async (location) => {
    const response = await axios.get(`${apiUrl}/shoppingList`, {
      // Send some query parameters to Express
      params: {
        lat: location.lat,
        lon: location.lon,
      },
    });
    console.log(response);

    this.setState({
      shoppingList: response.data,
    });
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={this.handleSearch}>
          <label>
            Search for a location:
            {' '} {/* add a space between */}
            <input type="text" name="search" placeholder="Location" />
          </label>
          <div>
            <button type="submit">Search</button>
          </div>
        </form>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {this.state.photos && this.state.photos.map(photo => (
            <div style={{ width: '200px' }}>
              <h3>By {photo.photographer}</h3>
              <img src={photo.img_url} style={{ width: '100%' }} alt="" />
            </div>
          ))}
        </div>

        <ShoppingList list={this.state.shoppingList} />

        {this.state.q &&
          <>
            <h2>Search: {this.state.q}</h2>
            {this.state.location ?
              <p>
                Display Name: {this.state.location.display_name}
                ({this.state.location.lat},{this.state.location.lon})
              </p>
              : <p>Loading...</p>
            }
          </>
        }
      </div>
    );
  }
}

export default App;
