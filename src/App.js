import React, { Component } from 'react';
import axios from 'axios';
import * as uuid from 'uuid'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    imagePreview: null,
    fileToUpload: null,
    listPhotos: null,
    isProcessing: false,
  }
  handleFileChange = (e) => {
    const reader = new FileReader()
    const file = e.target.files[0]

    this.setState({
      fileToUpload: file
    })

    reader.onload = (upload: any) => {
      this.setState({
        imagePreview: upload.target.result,
      })
      
    }
    file && reader.readAsDataURL(file)
  }
  componentDidMount() {
    this.initListPhotos()
  }
  uploadPhoto = async () => {
    const { fileToUpload } = this.state;
    if (!fileToUpload) return;
    this.setState({isProcessing: true});
    const formData = new FormData()
    var blob = fileToUpload.slice(0, -1, 'image/png'); 
    try {
      const newFile = new File([blob], `${uuid.v4()}.png`, {type: 'image/png'});
      formData.append('image', newFile);
      formData.append('name', this.photoName.value);
      const response = await axios.post(`/api/photos/`, formData, {
        xsrfCookieName: "csrftoken",
        xsrfHeaderName: "X-CSRFToken",
      });
      if (response.data.id) {
        this.setState({
          listPhotos:[response.data, ...this.state.listPhotos],
          imagePreview: null,
          fileToUpload: null,
        })
      } else {
        alert(response.data);
      }
    }catch(error) {
      alert(error)
    }
    this.setState({isProcessing: false});
  }
  initListPhotos = async () => {
    const response = await axios.get(`/api/photos/`);
    const listPhotos = response.data;
    this.setState({listPhotos})
  }
  deletePhoto = async (id) => {
    const res = await axios.delete(`/api/photos/${id}/`,{
      xsrfCookieName: "csrftoken",
      xsrfHeaderName: "X-CSRFToken"
    })

    this.initListPhotos();
  }

  render() {
    const listPhotos = this.state.listPhotos || []
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Test App</h1>
        </header>
        <div className="content-container">
            <div>
              <table className="table-upload">
                <tbody>
                  <tr>
                    <td>
                    <label> Choose a photo </label>
                    </td>
                    <td style={{textAlign: 'left'}}>
                      <input
                        type="file"
                        onChange={this.handleFileChange}
                        placeholder="Browse"
                        ref="imageFile"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <label> Photo name </label>
                    </td>
                    <td style={{textAlign: 'left'}}>
                      <input ref={(input) => this.photoName = input} type="text" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <img src={this.state.imagePreview} />
            </div>
            <div>
              <button 
              disabled={this.state.isProcessing}
              onClick={this.uploadPhoto}>
                {this.state.isProcessing? 'Processing': 'Submit'}
              </button>
            </div>
            <div className="list-images">
              <h2>List photos</h2>
              <table>
                <tbody>
                <tr>
                  <th>Name</th>
                  <th>Photo</th>
                  <th>Delete</th>
                </tr>
                {
                  listPhotos.map((photo, index) => {
                    return (
                      <tr key={index}>
                        <td>{photo.name}</td>
                        <td><img src={photo.image} /></td>
                        <td><a href="#" onClick={()=> this.deletePhoto(photo.id)}>Delete</a></td>
                      </tr>
                    )
                  })
                }
                
                </tbody>
              </table>
            </div>
        </div>
      </div>
    );
  }
}

export default App;
