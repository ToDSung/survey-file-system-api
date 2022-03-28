import logo from './logo.svg';
import './App.css';

const getFile = async () => {
  // open file picker
  const [fileHandle] = await window.showOpenFilePicker();

  // get file contents
  const fileData = await fileHandle.getFile();
  console.log(fileData)
}

const directoryStructure = {}

const getDirectory = async () => {
  const directoryHandle = await window.showDirectoryPicker();
  console.log(directoryHandle)
  for await (const fileHandle of getFilesRecursively(directoryHandle, directoryStructure)) {
    // console.log(fileHandle);
  }

  console.log(directoryStructure)
}

async function* getFilesRecursively (entry, currentDirectory) {
  if (entry.kind === 'file') {
    const file = await entry.getFile();
    if (file !== null) {
      // file.relativePath = getRelativePath(entry);
      currentDirectory[entry.name] = [file]
      // yield file;
    }
  } else if (entry.kind === 'directory') {
    currentDirectory[entry.name] = {}
    for await (const handle of entry.values()) {
      yield* getFilesRecursively(handle, currentDirectory[entry.name]);
    }
  }
}

const App = () => {
  return (
    <div className="App">
      <button onClick={getFile}>
        getFile
      </button>
      <button onClick={getDirectory}>
        getDirectory
      </button>
    </div>
  );
}

export default App;
