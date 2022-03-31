import './App.css';
import { loadFile as loadDicomFile } from './utils/myDicomParser'
import { loadFile as loadImageFile } from './utils/myImageLoader'

console.log = () => {}

// 測試 jpg / png 讀取圖片metadata 效率
// 使用 library https://github.com/blueimp/JavaScript-Load-Image => 目前只知道怎麼讀取圖片原始寬高
// => single image 1~3sec to load a file
// => 大概三千張圖 15MB 6~8sec to load all files 
// 測試 dicom 讀取圖片metadata 效率
// => single dicom 1~3sec to load a file
// => 828MB 4~6sec to load all files

const TIMER_SINGLE_FILE = 'single_file'

const addTimer = (timerName, callback) => async () => {
  await callback(timerName)
  console.timeEnd(timerName)
}

const handleLoad = (file) => {
  if (file.name.endsWith('dcm')) {
    loadDicomFile(file)
  }

  if (file.name.endsWith('png')) {
    loadImageFile(file)
  }
  
  return
}

const getFile = async (timerName) => {
  // open file picker
  const [fileHandle] = await window.showOpenFilePicker();
  console.time(timerName)
  
  // get file contents
  const fileData = await fileHandle.getFile();
  console.log(fileData)
  handleLoad(fileData)
}

const TIMER_DIRECTORY = 'directory'

const directoryStructure = {}

const getDirectory = async (timerName) => {
  const directoryHandle = await window.showDirectoryPicker();
  console.time(timerName)
  console.log(directoryHandle)

  for await (const fileHandle of getFilesRecursively(directoryHandle, directoryStructure)) {
    console.log(fileHandle);
  }
  console.log(directoryStructure)
}

async function* getFilesRecursively (entry, currentDirectory) {
  if (entry.kind === 'file') {
    const fileData = await entry.getFile();
    if (fileData !== null) {
      // file.relativePath = getRelativePath(entry);
      currentDirectory[entry.name] = [fileData]
      loadDicomFile(fileData)
      yield fileData;
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
      <button onClick={addTimer(TIMER_SINGLE_FILE, getFile)}>
        getFile
      </button>
      <button onClick={addTimer(TIMER_DIRECTORY, getDirectory)}>
        getDirectory
      </button>
    </div>
  );
}

export default App;
