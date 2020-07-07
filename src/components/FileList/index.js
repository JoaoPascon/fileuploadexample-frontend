import React from 'react'
import {Container, FileInfo, Preview} from './styles.js'
import { CircularProgressbar } from 'react-circular-progressbar';
import {MdError, MdCheckCircle, MdLink } from 'react-icons/md'


const FileList = ({files, onDelete}) => (
    <Container>
        { 
         files.map(uploadedFile => (
            <li key={uploadedFile.id}>
              <FileInfo>
                <Preview src={uploadedFile.preview}/>
                <div>
                    <strong>{uploadedFile.name}</strong>
                    <span>
                        {uploadedFile.readableSize}
                        {uploadedFile.url && <button onClick={() => onDelete(uploadedFile.id)}>Excluir</button>}
                    </span>
                </div>
             </FileInfo>
             <div>
                 {!uploadedFile.uploaded && !uploadedFile.error && (
                    <CircularProgressbar
                    styles={{
                        root: {width: 24},
                        path: {stroke: "green"}
                    }}
                    strokeWidth={10}
                    value={uploadedFile.progress}
                    />  
                 )}
               
                {uploadedFile.url && (
                    <a href={uploadedFile.url}
                        target="_blank"
                        rel="noopener noreferrer">
                        <MdLink style={{marginRight: 8}} size={24} color="#222"/>
                    </a>
                )}

                { uploadedFile.uploaded && <MdCheckCircle size={24} color="green"/>}
                { uploadedFile.error && <MdError size={24} color="red"/>}
             </div>
            </li>
         ))
        }
      </Container>
)

export default FileList;
