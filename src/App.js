import React from 'react';
import GlobalStyle from './styles/global'
import {Container, Content} from './styles'
import Upload from './components/uploads/'
import FileList from './components/FileList'
import {uniqueId} from 'lodash'
import fileSize from 'filesize'
import api from './services/api'

class App extends React.Component {
  
  state = {
    uploadedFiles: [],
  };

  async componentDidMount() {
    const resp = await api.get('/posts');

    this.setState({
      uploadedFiles: resp.data.map(file => ({
        id: file._id,
        name: file.name,
        readableSize: fileSize(file.size),
        preview: file.url,
        uploaded: true,
        url: file.url
      }))
    })
  }

  handleUpload = files => {
    const uploadedFiles = files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: fileSize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
    }))

    this.setState({uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)})

    uploadedFiles.forEach(this.processUpload);
  }

  handleDelete = async (fileId) => {
    await api.delete(`posts/${fileId}`)

    this.setState({
      uploadedFiles: this.state.uploadedFiles
          .filter((fileUploaded) => fileUploaded.id !== fileId)
    })
  }

  updateFile = (fileId, data) => {
    this.setState({uploadedFiles: this.state.uploadedFiles.map(
      uploadedFile => {
        return fileId === uploadedFile.id ? 
                {...uploadedFile, ...data } : uploadedFile;
      })
    })
  }

  processUpload = (uploadedFile) => {
    const data = new FormData();
    console.log("Ini upload");
    data.append('file', uploadedFile.file, uploadedFile.name);

    api.post('posts', data, {
      onUploadProgress: e => {
        const progress = parseInt(Math.round((e.loaded * 100) / e.total));
        this.updateFile(uploadedFile.id, {progress})
      }   
    }).then(res => {
        this.updateFile(uploadedFile.id, {
          uploaded: true,
          url: res.data.url,
          id: res.data._id
        });
    }).catch(() => {
        this.updateFile(uploadedFile.id, {
          error: true
        })
    })
  }

  componentWillUnmount() {
    this.state.uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }

 render() {
  const {uploadedFiles} = this.state;
  return (
      <Container>
        <Content>
          <Upload onUpload={this.handleUpload}/>
          { !!uploadedFiles.length && (
            <FileList files={uploadedFiles} onDelete={this.handleDelete}/>
          )}
        </Content>
        <GlobalStyle/>
      </Container>
  )
}
}

export default App;
