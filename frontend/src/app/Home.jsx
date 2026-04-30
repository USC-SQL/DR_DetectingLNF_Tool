import { useState} from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Label } from './components/ui/label';
import { Upload, FileText, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [imageFiles, setImageFiles] = useState([]);
  const [promptFile, setPromptFile] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    //each image appends to the list of images, instead of replacing the previous one
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...newFiles]);
      setImages(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
      e.target.value = '';
    }
  };

  const handlePromptChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPromptFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Backend functionality will be added later
    // console.log('Image file:', imageFile);
    // console.log('Prompt file:', promptFile);
    // navigate('/lnf_result', {state: {image}}); //send the image 
    if(!imageFiles.length || !promptFile){
      return;
    }

    try{
      setLoading(true);
      //creates a POST request to backend
      const formData = new FormData();
      imageFiles.forEach(file => formData.append('image_files[]', file));
      formData.append('prompt_file', promptFile);
      formData.append('subject_name', subjectName);

       //send request to backend
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if(!response.ok){
        throw new Error(`Request failed: ${response.status}`);
      }

      //parse backend response
      const data = await response.json();
      console.log('Backend response:' , data);

      //go to next page
      navigate('/lnf_result',{
        state:{
          images,
          result: data,
        },
      });
    }catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload files');
    } finally {
      setLoading(false);
    }
  };

  
 
  return (
    <div className="size-full flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">LNF Analyzer</CardTitle>
          <CardDescription>
            Upload image(s) and a prompt file to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image File Input */}
            <div className="space-y-2">
              <Label htmlFor="image-upload" className="flex items-center gap-2">
                <Image className="size-4" />
                Image File
              </Label>
              
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById('image-upload').click()}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:border-gray-400"
              >
                <Upload className="size-4" />
                Add Image(s)
              </button>
              
              {imageFiles.length > 0 && (
                <ul className="text-sm text-gray-600 space-y-1">
                  {imageFiles.map((file, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span>{file.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setImageFiles(prev => prev.filter((_, idx) => idx !== i));
                          setImages(prev => prev.filter((_, idx) => idx !== i));
                        }}
                        className="ml-2 text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Prompt File Input */}
            <div className="space-y-2">
              <Label htmlFor="prompt-upload" className="flex items-center gap-2">
                <FileText className="size-4" />
                Prompt File
              </Label>
              <div className="relative">
                <input
                  id="prompt-upload"
                  type="file"
                  accept=".txt,.md,.json"
                  onChange={handlePromptChange}
                  className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
              </div>
              {promptFile && (
                <p className="text-sm text-gray-600">
                  Selected: {promptFile.name}
                </p>
              )}
            </div>

            {/* Subject name */}
            <div className="space-y-2">
                <label htmlFor="subjectName">Enter Subject Name</label>
              <div className="relative">
                <input
                  id="subjectName"
                  type="text"
                  value={subjectName}
                  onChange={ (e) => setSubjectName(e.target.value)}
                  placeholder="Robinhood, Apple, etc."
                  className="w-full cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
              </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="size-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                Analyzing...
              </div>
            )}


            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!imageFiles.length || !promptFile || loading}
            >
              <Upload className="mr-2 size-4" />
              {/* Submit */}
              {loading ? 'Analyzing...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;